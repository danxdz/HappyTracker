#!/usr/bin/env python3
"""
Simple LoRA Trainer for Caricature Generation
Bypasses complex dependency issues by using basic PyTorch operations
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import json
import os
import logging
from pathlib import Path
import numpy as np
from typing import Dict, List, Tuple

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SimpleCaricatureDataset(Dataset):
    """Simple dataset for caricature training"""
    
    def __init__(self, training_data_dir: str, image_size: int = 512):
        self.training_data_dir = Path(training_data_dir)
        self.image_size = image_size
        
        # Load training metadata
        metadata_path = self.training_data_dir / "training_metadata.json"
        with open(metadata_path, 'r') as f:
            self.metadata = json.load(f)
        
        self.training_pairs = self.metadata['training_pairs']
        logger.info(f"📊 Loaded {len(self.training_pairs)} training pairs")
    
    def __len__(self):
        return len(self.training_pairs)
    
    def __getitem__(self, idx):
        pair = self.training_pairs[idx]
        
        # Load images
        photo_path = self.training_data_dir / pair['photo_path']
        caricature_path = self.training_data_dir / pair['caricature_path']
        
        try:
            photo = Image.open(photo_path).convert('RGB').resize((self.image_size, self.image_size))
            caricature = Image.open(caricature_path).convert('RGB').resize((self.image_size, self.image_size))
            
            # Convert to tensors
            photo_tensor = torch.from_numpy(np.array(photo)).float() / 255.0
            caricature_tensor = torch.from_numpy(np.array(caricature)).float() / 255.0
            
            # Permute to CHW format
            photo_tensor = photo_tensor.permute(2, 0, 1)
            caricature_tensor = caricature_tensor.permute(2, 0, 1)
            
            return {
                'photo': photo_tensor,
                'caricature': caricature_tensor,
                'style': pair['style'],
                'face_id': pair['face_id']
            }
        except Exception as e:
            logger.error(f"❌ Error loading pair {idx}: {e}")
            # Return dummy data
            dummy = torch.zeros(3, self.image_size, self.image_size)
            return {
                'photo': dummy,
                'caricature': dummy,
                'style': 'cartoon',
                'face_id': 'dummy'
            }

class SimpleLoRALayer(nn.Module):
    """Simple LoRA layer implementation"""
    
    def __init__(self, in_features: int, out_features: int, rank: int = 16):
        super().__init__()
        self.rank = rank
        self.scaling = 1.0 / rank
        
        # LoRA matrices
        self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))
        
    def forward(self, x):
        # LoRA: x @ A.T @ B.T * scaling
        # Correct LoRA formula: x @ (B @ A).T * scaling
        return F.linear(x, (self.lora_B @ self.lora_A).T) * self.scaling

class SimpleCaricatureModel(nn.Module):
    """Simple caricature generation model"""
    
    def __init__(self, image_size: int = 512):
        super().__init__()
        self.image_size = image_size
        
        # Simple encoder-decoder architecture
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(128, 256, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        
        # LoRA layers for style adaptation
        self.lora_layers = nn.ModuleDict({
            'cartoon': SimpleLoRALayer(256, 256),
            'chibi': SimpleLoRALayer(256, 256),
            'anime': SimpleLoRALayer(256, 256),
        })
        
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(128, 64, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 3, 3, padding=1),
            nn.Sigmoid()
        )
        
    def forward(self, x, style='cartoon'):
        # Encode
        encoded = self.encoder(x)
        
        # Apply LoRA for style
        if style in self.lora_layers:
            # Reshape for LoRA
            b, c, h, w = encoded.shape
            encoded_flat = encoded.view(b, c, -1).permute(0, 2, 1)  # (b, h*w, c)
            lora_out = self.lora_layers[style](encoded_flat)
            encoded = lora_out.permute(0, 2, 1).view(b, c, h, w)
        
        # Decode
        output = self.decoder(encoded)
        return output

class SimpleLoRATrainer:
    """Simple LoRA trainer for caricature generation"""
    
    def __init__(self, training_data_dir: str = "./training_data"):
        self.training_data_dir = training_data_dir
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"🎮 Using device: {self.device}")
        
        # Initialize model
        self.model = SimpleCaricatureModel().to(self.device)
        
        # Initialize dataset
        self.dataset = SimpleCaricatureDataset(training_data_dir)
        self.dataloader = DataLoader(self.dataset, batch_size=2, shuffle=True)
        
        # Optimizer (only train LoRA parameters)
        lora_params = []
        for lora_layer in self.model.lora_layers.values():
            lora_params.extend([lora_layer.lora_A, lora_layer.lora_B])
        
        self.optimizer = torch.optim.AdamW(lora_params, lr=1e-4)
        self.criterion = nn.MSELoss()
        
        logger.info(f"✅ Model initialized with {sum(p.numel() for p in lora_params)} LoRA parameters")
    
    def train_epoch(self, epoch: int):
        """Train for one epoch"""
        self.model.train()
        total_loss = 0
        
        for batch_idx, batch in enumerate(self.dataloader):
            photos = batch['photo'].to(self.device)
            caricatures = batch['caricature'].to(self.device)
            styles = batch['style']
            
            self.optimizer.zero_grad()
            
            # Forward pass for each style in batch
            total_batch_loss = 0
            for i, style in enumerate(styles):
                output = self.model(photos[i:i+1], style)
                loss = self.criterion(output, caricatures[i:i+1])
                total_batch_loss += loss
            
            # Backward pass
            total_batch_loss.backward()
            self.optimizer.step()
            
            total_loss += total_batch_loss.item()
            
            if batch_idx % 10 == 0:
                logger.info(f"Epoch {epoch}, Batch {batch_idx}, Loss: {total_batch_loss.item():.4f}")
        
        avg_loss = total_loss / len(self.dataloader)
        logger.info(f"📊 Epoch {epoch} completed. Average loss: {avg_loss:.4f}")
        return avg_loss
    
    def train(self, num_epochs: int = 5):
        """Main training loop"""
        logger.info(f"🚀 Starting LoRA training for {num_epochs} epochs...")
        
        for epoch in range(num_epochs):
            loss = self.train_epoch(epoch)
            
            # Save checkpoint
            if epoch % 2 == 0:
                self.save_checkpoint(epoch, loss)
        
        # Save final model
        self.save_checkpoint(num_epochs, loss, final=True)
        logger.info("🎉 Training completed!")
    
    def save_checkpoint(self, epoch: int, loss: float, final: bool = False):
        """Save model checkpoint"""
        checkpoint_dir = Path(self.training_data_dir) / "checkpoints"
        checkpoint_dir.mkdir(exist_ok=True)
        
        filename = "final_model.pth" if final else f"checkpoint_epoch_{epoch}.pth"
        checkpoint_path = checkpoint_dir / filename
        
        # Save only LoRA parameters
        lora_state = {}
        for style, lora_layer in self.model.lora_layers.items():
            lora_state[style] = {
                'lora_A': lora_layer.lora_A.cpu(),
                'lora_B': lora_layer.lora_B.cpu(),
            }
        
        torch.save({
            'epoch': epoch,
            'loss': loss,
            'lora_state': lora_state,
            'model_config': {
                'image_size': self.model.image_size,
            }
        }, checkpoint_path)
        
        logger.info(f"💾 Saved checkpoint: {checkpoint_path}")
    
    def generate_caricature(self, photo_path: str, style: str = "cartoon") -> Image.Image:
        """Generate caricature from photo"""
        self.model.eval()
        
        # Load and preprocess photo
        photo = Image.open(photo_path).convert('RGB').resize((512, 512))
        photo_tensor = torch.from_numpy(np.array(photo)).float() / 255.0
        photo_tensor = photo_tensor.permute(2, 0, 1).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(photo_tensor, style)
            output = output.squeeze(0).permute(1, 2, 0).cpu().numpy()
            output = (output * 255).astype(np.uint8)
        
        return Image.fromarray(output)
    
    def generate_caricature_variations(self, photo_path: str, style: str = "cartoon", num_variations: int = 3) -> list:
        """Generate multiple caricature variations from a single photo"""
        variations = []
        
        # Load and preprocess photo
        photo = Image.open(photo_path).convert('RGB').resize((512, 512))
        photo_tensor = torch.from_numpy(np.array(photo)).float() / 255.0
        photo_tensor = photo_tensor.permute(2, 0, 1).unsqueeze(0).to(self.device)
        
        self.model.eval()
        with torch.no_grad():
            for i in range(num_variations):
                # Add slight noise/randomness for variation
                noise_factor = 0.02 * (i + 1)  # Increasing noise for each variation
                noise = torch.randn_like(photo_tensor) * noise_factor
                noisy_input = photo_tensor + noise
                
                # Generate variation
                output = self.model(noisy_input, style)
                output = output.squeeze(0).permute(1, 2, 0).cpu().numpy()
                output = (output * 255).astype(np.uint8)
                
                variations.append(Image.fromarray(output))
        
        return variations

def main():
    """Main training function"""
    logger.info("🎨 Simple LoRA Caricature Trainer")
    logger.info("=" * 50)
    
    # Initialize trainer
    trainer = SimpleLoRATrainer()
    
    # Start training
    trainer.train(num_epochs=5)
    
    logger.info("🎉 Simple LoRA training completed!")
    logger.info("💡 Next steps:")
    logger.info("  - Test the trained model")
    logger.info("  - Generate caricatures with different styles")
    logger.info("  - Compare with baseline procedural generation")

if __name__ == "__main__":
    main()
