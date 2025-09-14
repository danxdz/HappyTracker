#!/usr/bin/env python3
"""
Generate Training Dataset for Caricature LoRA
Quick script to create photo→caricature pairs for training
"""

import os
import sys
from pathlib import Path
import logging

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from caricature_lora_trainer import CaricatureLoRATrainer

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def generate_training_dataset():
    """Generate training dataset from source photos"""
    
    logger.info("📊 Generating Caricature Training Dataset...")
    
    # Initialize trainer
    trainer = CaricatureLoRATrainer()
    
    # Source photos for training
    source_photos = [
        "outputs/test1.jpg",
        "outputs/test2.png", 
        "outputs/easy_test_with_cartoon.png"
    ]
    
    # Check which photos exist
    existing_photos = [photo for photo in source_photos if Path(photo).exists()]
    
    if not existing_photos:
        logger.error("❌ No source photos found!")
        return
    
    logger.info(f"📸 Found {len(existing_photos)} source photos:")
    for photo in existing_photos:
        logger.info(f"  - {photo}")
    
    # Generate training dataset
    training_pairs = trainer.generate_training_dataset(existing_photos, num_variations=2)
    
    if training_pairs:
        logger.info(f"✅ Generated {len(training_pairs)} training pairs!")
        logger.info("📁 Training data saved to:")
        logger.info(f"  - Photos: {trainer.training_data_dir}/photos/")
        logger.info(f"  - Caricatures: {trainer.training_data_dir}/caricatures/")
        logger.info(f"  - Metadata: {trainer.training_data_dir}/training_metadata.json")
        
        # Show sample pairs
        logger.info("📋 Sample training pairs:")
        for i, pair in enumerate(training_pairs[:3]):
            logger.info(f"  {i+1}. {pair['pair_id']}: {pair['caption'][:50]}...")
    else:
        logger.error("❌ Failed to generate training pairs!")

if __name__ == "__main__":
    generate_training_dataset()
