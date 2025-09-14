#!/usr/bin/env python3
"""
Auto Face Collector for Training Data
Automatically collects diverse faces from thispersondoesnotexist.com
and generates training data for caricature model.
"""

import requests
import time
import os
from pathlib import Path
from PIL import Image
import io
import json
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AutoFaceCollector:
    def __init__(self, output_dir="collected_faces", max_faces=50):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.max_faces = max_faces
        self.collected_count = 0
        self.failed_count = 0
        
    def collect_faces(self, delay_seconds=2):
        """Collect faces from thispersondoesnotexist.com"""
        logger.info(f"🎯 Starting auto face collection (max: {self.max_faces})")
        
        while self.collected_count < self.max_faces:
            try:
                # Download face from thispersondoesnotexist.com (unique AI-generated photos)
                logger.info(f"🌐 Downloading face {self.collected_count + 1}/{self.max_faces}...")
                start_time = time.time()
                # Add browser headers to avoid blocking
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
                response = requests.get("https://thispersondoesnotexist.com", headers=headers, timeout=10)
                download_time = time.time() - start_time
                logger.info(f"⏱️ Download took {download_time:.2f}s")
                
                save_start = time.time()
                
                if response.status_code == 200:
                    # Save the image
                    face_filename = f"face_{self.collected_count + 1:04d}.jpg"
                    face_path = self.output_dir / face_filename
                    
                    with open(face_path, 'wb') as f:
                        f.write(response.content)
                    
                    # Verify it's a valid image (simplified check)
                    try:
                        # Just check if we can open it, skip expensive verify()
                        img = Image.open(face_path)
                        img.close()  # Close immediately
                        self.collected_count += 1
                        
                        save_time = time.time() - save_start
                        logger.info(f"✅ Collected face {self.collected_count}/{self.max_faces}: {face_filename} (save: {save_time:.2f}s)")
                        
                        # Save metadata
                        self._save_metadata(face_filename, response.content)
                        
                    except Exception as e:
                        logger.warning(f"⚠️ Invalid image {face_filename}: {e}")
                        face_path.unlink()  # Delete invalid image
                        self.failed_count += 1
                        
                else:
                    logger.warning(f"⚠️ HTTP {response.status_code} - retrying...")
                    self.failed_count += 1
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Network error: {e}")
                self.failed_count += 1
                
            except Exception as e:
                logger.error(f"❌ Unexpected error: {e}")
                self.failed_count += 1
            
            # Skip delay for single face collection
            if delay_seconds > 0 and self.collected_count < self.max_faces:
                time.sleep(delay_seconds)
        
        logger.info(f"🎉 Collection complete! Collected: {self.collected_count}, Failed: {self.failed_count}")
        return self.collected_count
    
    def _save_metadata(self, filename, image_data):
        """Save metadata about collected face"""
        metadata = {
            "filename": filename,
            "collected_at": datetime.now().isoformat(),
            "source": "thispersondoesnotexist.com",
            "size_bytes": len(image_data),
            "status": "collected"
        }
        
        metadata_file = self.output_dir / f"{filename}.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def generate_training_data(self):
        """Generate training data from collected faces"""
        logger.info("🎨 Generating training data from collected faces...")
        
        training_dir = Path("training_data")
        training_dir.mkdir(exist_ok=True)
        
        face_files = list(self.output_dir.glob("face_*.jpg"))
        
        for i, face_file in enumerate(face_files):
            try:
                # Load face image
                face_img = Image.open(face_file)
                
                # Generate different cartoon styles
                styles = ["cartoon", "anime", "chibi"]
                
                for style in styles:
                    # Create training pair filename
                    base_name = face_file.stem
                    training_filename = f"{base_name}_{style}.jpg"
                    training_path = training_dir / training_filename
                    
                    # Generate cartoon version (simple procedural for now)
                    cartoon_img = self._generate_cartoon_style(face_img, style)
                    
                    # Save training pair
                    cartoon_img.save(training_path)
                    
                    logger.info(f"✅ Generated {style} training data: {training_filename}")
                
            except Exception as e:
                logger.error(f"❌ Error processing {face_file}: {e}")
        
        logger.info(f"🎉 Training data generation complete!")
    
    def _generate_cartoon_style(self, image, style):
        """Generate cartoon style from original image"""
        from PIL import ImageEnhance, ImageFilter
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        if style == "cartoon":
            # Disney/Pixar style
            enhanced = ImageEnhance.Color(image).enhance(1.3)
            enhanced = ImageEnhance.Contrast(enhanced).enhance(1.2)
            enhanced = enhanced.filter(ImageFilter.SMOOTH_MORE)
            
        elif style == "anime":
            # Anime style
            enhanced = ImageEnhance.Color(image).enhance(1.5)
            enhanced = ImageEnhance.Contrast(enhanced).enhance(1.4)
            enhanced = enhanced.filter(ImageFilter.SHARPEN)
            
        elif style == "chibi":
            # Chibi style (cute, simplified)
            enhanced = ImageEnhance.Color(image).enhance(1.8)
            enhanced = ImageEnhance.Contrast(enhanced).enhance(1.1)
            enhanced = enhanced.filter(ImageFilter.SMOOTH)
        
        return enhanced
    
    def get_collection_stats(self):
        """Get statistics about collected faces"""
        face_files = list(self.output_dir.glob("face_*.jpg"))
        metadata_files = list(self.output_dir.glob("face_*.json"))
        
        return {
            "total_faces": len(face_files),
            "metadata_files": len(metadata_files),
            "collection_dir": str(self.output_dir),
            "ready_for_training": len(face_files) > 0
        }

def main():
    """Main function to run auto face collection"""
    collector = AutoFaceCollector(max_faces=20)  # Start with 20 faces
    
    print("🚀 Auto Face Collector for Training Data")
    print("=" * 50)
    
    # Collect faces
    collected = collector.collect_faces(delay_seconds=1)
    
    if collected > 0:
        # Generate training data
        collector.generate_training_data()
        
        # Show stats
        stats = collector.get_collection_stats()
        print("\n📊 Collection Statistics:")
        print(f"  Faces collected: {stats['total_faces']}")
        print(f"  Ready for training: {stats['ready_for_training']}")
        print(f"  Collection directory: {stats['collection_dir']}")
        
        print("\n🎯 Next steps:")
        print("  1. Run: python simple_lora_trainer.py")
        print("  2. Or run: python simple_validation_trainer.py")
        
    else:
        print("❌ No faces collected. Check your internet connection.")

if __name__ == "__main__":
    main()
