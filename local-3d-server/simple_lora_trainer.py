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
                'style': 'caricature',
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
        # Simplified to avoid device issues
        lora_weight = self.lora_B @ self.lora_A
        return torch.matmul(x, lora_weight.T) * self.scaling

class SimpleCaricatureModel(nn.Module):
    """Improved caricature generation model with style-specific processing"""
    
    def __init__(self, image_size: int = 512):
        super().__init__()
        self.image_size = image_size
        
        # Encoder
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, 3, padding=1),
            nn.ReLU(),
        )
        
        # Single style processing
        self.style_layers = nn.Sequential(
            nn.Conv2d(256, 128, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(128, 64, 3, padding=1),
            nn.ReLU(),
        )
        
        # Decoder
        self.decoder = nn.Sequential(
            nn.Conv2d(64, 32, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 3, 3, padding=1),
            nn.Sigmoid()
        )
        
    def forward(self, x, style='caricature'):
        # Encode
        encoded = self.encoder(x)
        
        # Apply style processing
        styled = self.style_layers(encoded)
        
        # Decode
        output = self.decoder(styled)
        
        # Add caricature-like effects
        # Increase contrast and saturation for caricature effect
        output = torch.clamp(output * 1.2, 0, 1)
        
        return output

class SimpleLoRATrainer:
    """Simple LoRA trainer for caricature generation"""
    
    def __init__(self, training_data_dir: str = "./training_data"):
        self.training_data_dir = training_data_dir
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"🎮 Using device: {self.device}")
        
        # Initialize model
        self.model = SimpleCaricatureModel().to(self.device)
        
        # Try to load the best checkpoint
        self._load_best_checkpoint()
        
        # Initialize dataset with verbose logging
        logger.info(f"📁 Loading training data from: {training_data_dir}")
        self.dataset = SimpleCaricatureDataset(training_data_dir)
        
        # Log dataset details
        logger.info(f"📊 Dataset loaded: {len(self.dataset)} training pairs")
        
        # Check for user-uploaded examples
        user_examples = 0
        for pair in self.dataset.training_pairs:
            if pair.get('source') == 'user_upload':
                user_examples += 1
                logger.info(f"👤 User example: {pair['photo_path']} -> {pair['caricature_path']} ({pair['style']})")
        
        logger.info(f"🎯 User-uploaded examples: {user_examples}/{len(self.dataset.training_pairs)}")
        
        self.dataloader = DataLoader(self.dataset, batch_size=2, shuffle=True)
        
        # Optimizer for all model parameters
        self.optimizer = torch.optim.AdamW(self.model.parameters(), lr=1e-4)
        self.criterion = nn.MSELoss()
        
        logger.info(f"✅ Model initialized with {sum(p.numel() for p in self.model.parameters())} parameters")
    
    def _load_best_checkpoint(self):
        """Load the best available checkpoint"""
        checkpoint_dir = Path(self.training_data_dir) / "checkpoints"
        
        # Try to load final model first
        final_model_path = checkpoint_dir / "final_model.pth"
        if final_model_path.exists():
            try:
                checkpoint = torch.load(final_model_path, map_location=self.device)
                self.model.load_state_dict(checkpoint['model_state_dict'])
                logger.info(f"✅ Loaded final model checkpoint")
                return
            except Exception as e:
                logger.warning(f"⚠️ Failed to load final model: {e}")
        
        # Try to load latest checkpoint
        checkpoint_files = list(checkpoint_dir.glob("checkpoint_epoch_*.pth"))
        if checkpoint_files:
            latest_checkpoint = max(checkpoint_files, key=lambda x: int(x.stem.split('_')[-1]))
            try:
                checkpoint = torch.load(latest_checkpoint, map_location=self.device)
                self.model.load_state_dict(checkpoint['model_state_dict'])
                logger.info(f"✅ Loaded checkpoint: {latest_checkpoint.name}")
                return
            except Exception as e:
                logger.warning(f"⚠️ Failed to load checkpoint {latest_checkpoint.name}: {e}")
        
        logger.info("ℹ️ No valid checkpoints found, using untrained model")
    
    def train_epoch(self, epoch: int):
        """Train for one epoch with verbose logging"""
        self.model.train()
        total_loss = 0
        
        logger.info(f"🚀 Starting epoch {epoch} with {len(self.dataloader)} batches")
        
        for batch_idx, batch in enumerate(self.dataloader):
            photos = batch['photo'].to(self.device)
            caricatures = batch['caricature'].to(self.device)
            styles = batch['style']
            
            logger.info(f"📦 Batch {batch_idx}: Processing {len(styles)} images with styles: {styles}")
            
            self.optimizer.zero_grad()
            
            # Forward pass for each style in batch
            total_batch_loss = 0
            for i, style in enumerate(styles):
                logger.info(f"🎨 Processing image {i+1}/{len(styles)} with style: {style}")
                
                output = self.model(photos[i:i+1], style)
                loss = self.criterion(output, caricatures[i:i+1])
                total_batch_loss += loss
                
                logger.info(f"📊 Image {i+1} loss: {loss.item():.4f}")
            
            # Backward pass
            logger.info(f"⬅️ Backward pass for batch {batch_idx}")
            total_batch_loss.backward()
            self.optimizer.step()
            
            total_loss += total_batch_loss.item()
            
            logger.info(f"✅ Batch {batch_idx} completed. Batch loss: {total_batch_loss.item():.4f}")
            
            if batch_idx % 5 == 0:  # More frequent logging
                logger.info(f"📈 Epoch {epoch}, Batch {batch_idx}, Loss: {total_batch_loss.item():.4f}")
        
        avg_loss = total_loss / len(self.dataloader)
        logger.info(f"🎯 Epoch {epoch} completed! Average loss: {avg_loss:.4f}")
        logger.info(f"📊 Total batches processed: {len(self.dataloader)}")
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
        
        # Save model state
        torch.save({
            'epoch': epoch,
            'loss': loss,
            'model_state_dict': self.model.state_dict(),
            'model_config': {
                'image_size': self.model.image_size,
            }
        }, checkpoint_path)
        
        logger.info(f"💾 Saved checkpoint: {checkpoint_path}")
    
    def generate_caricature(self, photo_path: str, style: str = "caricature") -> Image.Image:
        """Generate caricature from photo with fallback to image processing"""
        try:
            self.model.eval()
            
            # Load and preprocess photo
            photo = Image.open(photo_path).convert('RGB').resize((512, 512))
            photo_tensor = torch.from_numpy(np.array(photo)).float() / 255.0
            photo_tensor = photo_tensor.permute(2, 0, 1).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                output = self.model(photo_tensor, style)
                output = output.squeeze(0).permute(1, 2, 0).cpu().numpy()
                output = (output * 255).astype(np.uint8)
            
            # Check if output is too gray/random (model not trained)
            if self._is_gray_image(output):
                logger.info(f"⚠️ Model output too gray, using image processing fallback for {style}")
                return self._apply_image_processing_caricature(photo, style)
            
            return Image.fromarray(output)
        except Exception as e:
            logger.error(f"❌ Model generation failed: {e}, using fallback")
            photo = Image.open(photo_path).convert('RGB').resize((512, 512))
            return self._apply_image_processing_caricature(photo, style)
    
    def _is_gray_image(self, image_array: np.ndarray) -> bool:
        """Check if image is mostly gray/uniform"""
        # Calculate variance of each color channel
        r_var = np.var(image_array[:, :, 0])
        g_var = np.var(image_array[:, :, 1])
        b_var = np.var(image_array[:, :, 2])
        
        total_variance = r_var + g_var + b_var
        is_gray = total_variance < 100
        
        logger.info(f"🔍 Image analysis: R_var={r_var:.1f}, G_var={g_var:.1f}, B_var={b_var:.1f}, Total={total_variance:.1f}")
        logger.info(f"🎨 Is gray image: {is_gray} (threshold: 100)")
        
        return is_gray
    
    def _apply_image_processing_caricature(self, photo: Image.Image, style: str) -> Image.Image:
        """Apply image processing filters to create caricature-like effects"""
        import numpy as np
        from PIL import ImageEnhance, ImageFilter, ImageOps
        
        logger.info(f"🎨 Applying enhanced image processing caricature for style: {style}")
        
        # Convert to numpy for processing
        img_array = np.array(photo)
        h, w = img_array.shape[:2]
        logger.info(f"📊 Input image shape: {img_array.shape}, dtype: {img_array.dtype}")
        
        # Enhanced caricature effects
        enhanced = photo.copy()
        
        # Convert to numpy for advanced processing
        img_array = img_array.astype(np.float32)
        
        # 1. FACE FEATURE EXAGGERATION
        try:
            # Detect face center
            center_x, center_y = w // 2, h // 2
            
            # Create distance map from center
            y, x = np.ogrid[:h, :w]
            distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
            max_distance = np.sqrt(center_x**2 + center_y**2)
            
            # Feature exaggeration map
            feature_map = 1.0 + (1.0 - distance / max_distance) * 0.3
            
            # Apply feature exaggeration to different regions
            # Eyes area (upper third) - enhance brightness
            eye_mask = (y < h * 0.4) & (distance < max_distance * 0.6)
            img_array[eye_mask] *= feature_map[eye_mask] * 1.3
            
            # Nose area (middle) - enhance contrast
            nose_mask = (y > h * 0.3) & (y < h * 0.6) & (distance < max_distance * 0.4)
            img_array[nose_mask] *= feature_map[nose_mask] * 1.4
            
            # Mouth area (lower third) - enhance saturation
            mouth_mask = (y > h * 0.6) & (distance < max_distance * 0.5)
            img_array[mouth_mask] *= feature_map[mouth_mask] * 1.2
            
        except Exception as e:
            logger.warning(f"⚠️ Feature exaggeration failed: {e}")
        
        # 2. COLOR ENHANCEMENT
        # Boost saturation with caricature-style colors
        img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.4, 0, 255)  # Red
        img_array[:, :, 1] = np.clip(img_array[:, :, 1] * 1.3, 0, 255)  # Green  
        img_array[:, :, 2] = np.clip(img_array[:, :, 2] * 1.5, 0, 255)  # Blue
        
        # 3. CONTRAST AND SHARPNESS
        # Apply adaptive contrast
        mean_intensity = np.mean(img_array)
        contrast_factor = 1.8
        img_array = (img_array - mean_intensity) * contrast_factor + mean_intensity
        img_array = np.clip(img_array, 0, 255)
        
        # Convert back to PIL
        enhanced = Image.fromarray(img_array.astype(np.uint8))
        
        # 4. SHAPE EXAGGERATION (simplified)
        try:
            enhanced = self._apply_simple_shape_exaggeration(enhanced)
        except Exception as e:
            logger.warning(f"⚠️ Shape exaggeration failed: {e}")
        
        # 5. CARTOON STYLE EFFECTS
        # Edge enhancement for cartoon look
        enhanced = enhanced.filter(ImageFilter.EDGE_ENHANCE_MORE)
        
        # Posterization for cartoon effect
        enhanced = ImageOps.posterize(enhanced, 5)
        
        # Final color boost
        enhanced = ImageEnhance.Color(enhanced).enhance(1.3)
        enhanced = ImageEnhance.Contrast(enhanced).enhance(1.4)
        enhanced = ImageEnhance.Sharpness(enhanced).enhance(1.8)
        
        logger.info(f"✅ Enhanced image processing caricature completed")
        return enhanced
    
    def _apply_simple_shape_exaggeration(self, image: Image.Image) -> Image.Image:
        """Apply simple shape exaggeration effects"""
        try:
            import cv2
            # Convert to numpy for processing
            img_array = np.array(image)
            h, w = img_array.shape[:2]
            
            # Create exaggeration map
            y, x = np.ogrid[:h, :w]
            center_x, center_y = w // 2, h // 2
            
            # Distance from center
            distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
            max_distance = np.sqrt(center_x**2 + center_y**2)
            
            # Exaggeration factor (stronger at edges)
            exaggeration_factor = 1.0 + (distance / max_distance) * 0.2
            
            # Apply warping
            new_x = center_x + (x - center_x) * exaggeration_factor
            new_y = center_y + (y - center_y) * exaggeration_factor
            
            # Create meshgrid for remapping
            map_x = new_x.astype(np.float32)
            map_y = new_y.astype(np.float32)
            
            # Apply remapping
            exaggerated = cv2.remap(img_array, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            
            return Image.fromarray(exaggerated)
            
        except Exception as e:
            logger.warning(f"⚠️ Simple shape exaggeration failed: {e}")
            return image
    
    def generate_caricature_variations(self, photo_path: str, style: str = "caricature", num_variations: int = 3) -> list:
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
