#!/usr/bin/env python3
"""
Procedural Training Data Generator
Generates training pairs using advanced procedural caricature effects
Bypasses AI model dependencies for immediate training data
"""

import os
import sys
from pathlib import Path
import logging
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import json
import cv2
import numpy as np
import webbrowser
import time

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProceduralTrainingGenerator:
    """Generate training data using procedural caricature effects"""
    
    def __init__(self):
        self.collected_faces_dir = "./collected_faces"
        self.training_data_dir = "./training_data"
        self.caricatures_dir = f"{self.training_data_dir}/caricatures"
        self.photos_dir = f"{self.training_data_dir}/photos"
        
        # Create directories
        Path(self.training_data_dir).mkdir(exist_ok=True)
        Path(self.caricatures_dir).mkdir(exist_ok=True)
        Path(self.photos_dir).mkdir(exist_ok=True)
        
        logger.info(f"📁 Training data directory: {self.training_data_dir}")
        logger.info(f"📁 Caricatures directory: {self.caricatures_dir}")
        logger.info(f"📁 Photos directory: {self.photos_dir}")
    
    def analyze_face_features(self, image_path: str) -> dict:
        """Analyze face features using OpenCV"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return {}
                
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Load face cascade
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) == 0:
                return {}
                
            # Get the largest face
            face = max(faces, key=lambda x: x[2] * x[3])
            x, y, w, h = face
            
            # Extract face region
            face_region = image[y:y+h, x:x+w]
            
            # Analyze features
            features = {
                'face_size': w * h,
                'aspect_ratio': w / h,
                'face_bbox': [x, y, w, h],
                'face_center': [x + w//2, y + h//2]
            }
            
            # Eye detection
            eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
            eyes = eye_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
            features['eyes_detected'] = len(eyes)
            features['eye_positions'] = [(x + ex, y + ey, ew, eh) for ex, ey, ew, eh in eyes]
            
            # Mouth detection
            mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
            mouths = mouth_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
            features['mouths_detected'] = len(mouths)
            features['mouth_positions'] = [(x + mx, y + my, mw, mh) for mx, my, mw, mh in mouths]
            
            return features
            
        except Exception as e:
            logger.error(f"❌ Face analysis failed: {e}")
            return {}
    
    def create_advanced_caricature(self, image_path: str, style: str, features: dict) -> Image.Image:
        """Create advanced procedural caricature with feature exaggeration"""
        try:
            # Load original image
            original = Image.open(image_path)
            img_array = np.array(original)
            
            # Create caricature based on detected features
            if style == "cartoon":
                caricature = self._create_cartoon_caricature(img_array, features)
            elif style == "chibi":
                caricature = self._create_chibi_caricature(img_array, features)
            elif style == "anime":
                caricature = self._create_anime_caricature(img_array, features)
            else:
                caricature = self._create_default_caricature(img_array, features)
            
            return caricature
            
        except Exception as e:
            logger.error(f"❌ Caricature creation failed: {e}")
            return None
    
    def _create_cartoon_caricature(self, img_array: np.ndarray, features: dict) -> Image.Image:
        """Create cartoon-style caricature with feature exaggeration"""
        # Convert to PIL
        img = Image.fromarray(img_array)
        
        # Apply cartoon effects
        # 1. Reduce colors (posterize effect)
        img = img.quantize(colors=64)
        img = img.convert('RGB')
        
        # 2. Enhance contrast
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.8)
        
        # 3. Enhance saturation
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.3)
        
        # 4. Apply edge enhancement
        img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
        
        # 5. Feature-specific exaggeration
        if features.get('eyes_detected', 0) >= 2:
            img = self._exaggerate_eyes(img, features)
        
        if features.get('mouths_detected', 0) >= 1:
            img = self._exaggerate_mouth(img, features)
        
        return img
    
    def _create_chibi_caricature(self, img_array: np.ndarray, features: dict) -> Image.Image:
        """Create chibi-style caricature with cute proportions"""
        img = Image.fromarray(img_array)
        
        # Chibi effects: bright, cute, high contrast
        # 1. Increase brightness
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.3)
        
        # 2. Increase saturation (cute colors)
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.6)
        
        # 3. High contrast
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.2)
        
        # 4. Reduce colors for chibi style
        img = img.quantize(colors=32)
        img = img.convert('RGB')
        
        # 5. Sharpen for crisp chibi look
        img = img.filter(ImageFilter.SHARPEN)
        
        # 6. Exaggerate eyes more for chibi
        if features.get('eyes_detected', 0) >= 2:
            img = self._exaggerate_eyes(img, features, exaggeration_factor=2.0)
        
        return img
    
    def _create_anime_caricature(self, img_array: np.ndarray, features: dict) -> Image.Image:
        """Create anime-style caricature with manga aesthetics"""
        img = Image.fromarray(img_array)
        
        # Anime effects: high contrast, reduced palette, sharp edges
        # 1. Reduce colors to anime palette
        img = img.quantize(colors=128)
        img = img.convert('RGB')
        
        # 2. High contrast for anime look
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.5)
        
        # 3. Enhance colors
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.4)
        
        # 4. Sharpen for manga-style edges
        img = img.filter(ImageFilter.SHARPEN)
        img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
        
        # 5. Anime-style eye exaggeration
        if features.get('eyes_detected', 0) >= 2:
            img = self._exaggerate_eyes(img, features, exaggeration_factor=1.8)
        
        return img
    
    def _create_default_caricature(self, img_array: np.ndarray, features: dict) -> Image.Image:
        """Create default caricature with basic effects"""
        img = Image.fromarray(img_array)
        
        # Basic caricature effects
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.5)
        
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.2)
        
        img = img.filter(ImageFilter.SMOOTH_MORE)
        
        return img
    
    def _exaggerate_eyes(self, img: Image.Image, features: dict, exaggeration_factor: float = 1.5) -> Image.Image:
        """Exaggerate eye features"""
        try:
            # This is a simplified eye exaggeration
            # In a full implementation, we'd use face landmarks for precise warping
            
            # For now, we'll apply a subtle effect to the eye regions
            img_array = np.array(img)
            
            # Find eye regions and apply enhancement
            eye_positions = features.get('eye_positions', [])
            for ex, ey, ew, eh in eye_positions:
                # Ensure coordinates are within image bounds
                ex = max(0, min(ex, img.width - ew))
                ey = max(0, min(ey, img.height - eh))
                
                # Extract eye region
                eye_region = img_array[ey:ey+eh, ex:ex+ew]
                
                if eye_region.size > 0:
                    # Enhance the eye region
                    eye_img = Image.fromarray(eye_region)
                    enhancer = ImageEnhance.Contrast(eye_img)
                    eye_img = enhancer.enhance(exaggeration_factor)
                    
                    # Put back
                    img_array[ey:ey+eh, ex:ex+ew] = np.array(eye_img)
            
            return Image.fromarray(img_array)
            
        except Exception as e:
            logger.warning(f"⚠️ Eye exaggeration failed: {e}")
            return img
    
    def _exaggerate_mouth(self, img: Image.Image, features: dict, exaggeration_factor: float = 1.3) -> Image.Image:
        """Exaggerate mouth features"""
        try:
            img_array = np.array(img)
            
            # Find mouth regions and apply enhancement
            mouth_positions = features.get('mouth_positions', [])
            for mx, my, mw, mh in mouth_positions:
                # Ensure coordinates are within image bounds
                mx = max(0, min(mx, img.width - mw))
                my = max(0, min(my, img.height - mh))
                
                # Extract mouth region
                mouth_region = img_array[my:my+mh, mx:mx+mw]
                
                if mouth_region.size > 0:
                    # Enhance the mouth region
                    mouth_img = Image.fromarray(mouth_region)
                    enhancer = ImageEnhance.Color(mouth_img)
                    mouth_img = enhancer.enhance(exaggeration_factor)
                    
                    # Put back
                    img_array[my:my+mh, mx:mx+mw] = np.array(mouth_img)
            
            return Image.fromarray(img_array)
            
        except Exception as e:
            logger.warning(f"⚠️ Mouth exaggeration failed: {e}")
            return img
    
    def generate_training_pairs(self, num_faces: int = 20, variations_per_face: int = 1):
        """Generate training pairs from collected faces"""
        logger.info(f"🎨 Generating training pairs from {num_faces} faces...")
        
        # Get list of collected faces
        face_files = list(Path(self.collected_faces_dir).glob("face_*.jpg"))
        
        if not face_files:
            logger.error("❌ No collected faces found! Run auto_face_collector.py first.")
            return
        
        # Limit to requested number
        num_faces = min(num_faces, len(face_files))
        selected_faces = face_files[:num_faces]
        
        training_pairs = []
        styles = ["cartoon", "chibi", "anime"]
        
        for i, face_file in enumerate(selected_faces):
            logger.info(f"📸 Processing face {i+1}/{num_faces}: {face_file.name}")
            
            # Analyze face features
            features = self.analyze_face_features(str(face_file))
            
            if not features:
                logger.warning(f"⚠️ No face detected in {face_file.name}")
                continue
            
            # Copy original photo to training data
            photo_copy_path = f"{self.photos_dir}/{face_file.name}"
            Image.open(face_file).save(photo_copy_path)
            
            # Use relative paths for the metadata
            photo_relative_path = f"photos/{face_file.name}"
            
            # Generate caricatures for different styles
            for style in styles:
                for variation in range(variations_per_face):
                    logger.info(f"🎨 Generating {style} caricature (variation {variation+1})...")
                    
                    # Generate caricature
                    caricature = self.create_advanced_caricature(str(face_file), style, features)
                    
                    if caricature:
                        # Save caricature
                        caricature_filename = f"{face_file.stem}_{style}_v{variation+1}.jpg"
                        caricature_path = f"{self.caricatures_dir}/{caricature_filename}"
                        caricature.save(caricature_path)
                        
                        # Create training pair with relative paths
                        caricature_relative_path = f"caricatures/{caricature_filename}"
                        
                        training_pair = {
                            'photo_path': photo_relative_path,
                            'caricature_path': caricature_relative_path,
                            'style': style,
                            'variation': variation + 1,
                            'features': features,
                            'face_id': face_file.stem
                        }
                        
                        training_pairs.append(training_pair)
                        
                        logger.info(f"✅ Generated {style} caricature: {caricature_filename}")
                    else:
                        logger.error(f"❌ Failed to generate {style} caricature for {face_file.name}")
        
        # Convert numpy types to Python types for JSON serialization
        def convert_numpy_types(obj):
            if isinstance(obj, (np.integer, np.int32, np.int64)):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float32, np.float64)):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, dict):
                return {key: convert_numpy_types(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy_types(item) for item in obj]
            elif isinstance(obj, tuple):
                return tuple(convert_numpy_types(item) for item in obj)
            else:
                return obj
        
        # Convert training pairs to JSON-serializable format
        serializable_pairs = []
        for pair in training_pairs:
            # Simplify features to avoid numpy serialization issues
            simple_features = {
                'eyes_detected': int(pair['features'].get('eyes_detected', 0)),
                'mouths_detected': int(pair['features'].get('mouths_detected', 0)),
                'face_size': int(pair['features'].get('face_size', 0)),
                'aspect_ratio': float(pair['features'].get('aspect_ratio', 1.0))
            }
            
            serializable_pair = {
                'photo_path': pair['photo_path'],
                'caricature_path': pair['caricature_path'],
                'style': pair['style'],
                'variation': pair['variation'],
                'face_id': pair['face_id'],
                'features': simple_features
            }
            serializable_pairs.append(serializable_pair)
        
        # Save training metadata
        metadata = {
            'total_pairs': len(training_pairs),
            'faces_processed': len(selected_faces),
            'styles': styles,
            'variations_per_style': variations_per_face,
            'generation_timestamp': time.time(),
            'training_pairs': serializable_pairs
        }
        
        metadata_path = f"{self.training_data_dir}/training_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 Saved {len(training_pairs)} training pairs to {metadata_path}")
        logger.info(f"📊 Training data summary:")
        logger.info(f"  - Photos: {len(selected_faces)}")
        logger.info(f"  - Caricatures: {len(training_pairs)}")
        logger.info(f"  - Styles: {len(styles)}")
        logger.info(f"  - Variations per style: {variations_per_face}")
        
        return training_pairs
    
    def create_training_gallery(self, training_pairs: list):
        """Create carousel validation gallery for training data"""
        logger.info("🖼️ Creating carousel validation gallery...")
        
        # Group pairs by face_id
        faces_data = {}
        for pair in training_pairs:
            face_id = pair['face_id']
            if face_id not in faces_data:
                faces_data[face_id] = {
                    'photo_path': pair['photo_path'],
                    'caricatures': []
                }
            faces_data[face_id]['caricatures'].append(pair)
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Training Data Validation</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }}
        
        h1 {{
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2.5em;
        }}
        
        .carousel-container {{
            display: none;
        }}
        
        .carousel-container.active {{
            display: block;
        }}
        
        .photo-grid {{
            display: flex;
            gap: 15px;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }}
        
        .photo-section {{
            text-align: center;
            flex: 1;
            min-width: 160px;
        }}
        
        .photo-section.clickable {{
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 15px;
            padding: 10px;
        }}
        
        .photo-section.clickable:hover {{
            background: rgba(102, 126, 234, 0.1);
            transform: scale(1.05);
        }}
        
        .photo-section.clickable.selected {{
            background: rgba(102, 126, 234, 0.2);
            border: 3px solid #667eea;
        }}
        
        .photo-section img {{
            width: 160px;
            height: 160px;
            object-fit: cover;
            border-radius: 15px;
            border: 3px solid #e9ecef;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .photo-section.clickable img {{
            border: 3px solid #667eea;
        }}
        
        .photo-section.clickable.selected img {{
            border: 3px solid #28a745;
            box-shadow: 0 0 20px rgba(40, 167, 69, 0.5);
        }}
        
        .photo-label {{
            margin-top: 10px;
            font-weight: bold;
            color: #333;
        }}
        
        .photo-section.clickable .photo-label {{
            color: #667eea;
        }}
        
        .photo-section.clickable.selected .photo-label {{
            color: #28a745;
        }}
        
        .controls {{
            text-align: center;
            margin-top: 30px;
        }}
        
        .btn {{
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 10px;
            transition: all 0.3s ease;
        }}
        
        .btn:hover {{
            background: #c82333;
            transform: translateY(-2px);
        }}
        
        .progress {{
            text-align: center;
            margin-bottom: 30px;
            font-size: 18px;
            color: #666;
        }}
        
        .results {{
            display: none;
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 15px;
        }}
        
        .results.show {{
            display: block;
        }}
        
        .style-badge {{
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
            margin: 2px;
        }}
        
        .style-cartoon {{ background: #28a745; }}
        .style-chibi {{ background: #ffc107; color: #333; }}
        .style-anime {{ background: #dc3545; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Training Data Validation</h1>
        <div class="progress">
            <span id="current-photo">1</span> / <span id="total-photos">{len(faces_data)}</span> photos
        </div>
        
        <div id="carousel-container">
"""
        
        # Create carousel for each face
        for i, (face_id, face_data) in enumerate(faces_data.items()):
            html_content += f"""
            <div class="carousel-container" id="photo-{i+1}">
                <div class="photo-grid">
                    <div class="photo-section">
                        <img src="{face_data['photo_path']}" alt="Original">
                        <div class="photo-label">Original</div>
                    </div>
"""
            
            # Add caricatures (clickable)
            for caricature in face_data['caricatures']:
                html_content += f"""
                    <div class="photo-section clickable" onclick="selectStyle('{caricature['style']}', {i+1})">
                        <img src="{caricature['caricature_path']}" alt="{caricature['style']}">
                        <div class="photo-label">{caricature['style'].title()}</div>
                    </div>
"""
            
            html_content += """
                </div>
                <div class="controls">
                    <button class="btn" onclick="skipPhoto()">❌ Skip This Photo</button>
                </div>
            </div>
"""
        
        html_content += """
        </div>
        
        <div class="results" id="results">
            <h2>🎉 Validation Complete!</h2>
            <p>Thank you for validating the training data!</p>
            <div id="validation-summary"></div>
        </div>
    </div>
    
    <script>
        let currentPhoto = 1;
        let totalPhotos = """ + str(len(faces_data)) + """;
        let validationResults = [];
        let selectedStyle = null;
        
        function showPhoto(photoNum) {
            // Hide all photos
            document.querySelectorAll('.carousel-container').forEach(container => {
                container.classList.remove('active');
            });
            
            // Show current photo
            document.getElementById(`photo-${photoNum}`).classList.add('active');
            
            // Update progress
            document.getElementById('current-photo').textContent = photoNum;
            
            // Reset selection
            selectedStyle = null;
            document.querySelectorAll('.photo-section.clickable').forEach(section => {
                section.classList.remove('selected');
            });
        }
        
        function selectStyle(style, photoNum) {
            // Remove previous selection
            document.querySelectorAll('.photo-section.clickable').forEach(section => {
                section.classList.remove('selected');
            });
            
            // Select current style
            event.target.closest('.photo-section').classList.add('selected');
            selectedStyle = style;
            
            // Auto-advance to next photo
            setTimeout(() => {
                validatePhoto(photoNum, style);
            }, 500);
        }
        
        function validatePhoto(photoNum, style) {
            validationResults.push({
                photo: photoNum,
                selectedStyle: style,
                timestamp: new Date().toISOString()
            });
            
            if (photoNum < totalPhotos) {
                currentPhoto++;
                showPhoto(currentPhoto);
            } else {
                showResults();
            }
        }
        
        function skipPhoto() {
            validationResults.push({
                photo: currentPhoto,
                selectedStyle: 'skipped',
                timestamp: new Date().toISOString()
            });
            
            if (currentPhoto < totalPhotos) {
                currentPhoto++;
                showPhoto(currentPhoto);
            } else {
                showResults();
            }
        }
        
        function showResults() {
            document.getElementById('carousel-container').style.display = 'none';
            document.getElementById('results').classList.add('show');
            
            // Show summary
            let summary = '<h3>Validation Summary:</h3><ul>';
            validationResults.forEach(result => {
                if (result.selectedStyle !== 'skipped') {
                    summary += `<li>Photo ${result.photo}: <span class="style-badge style-${result.selectedStyle}">${result.selectedStyle}</span></li>`;
                } else {
                    summary += `<li>Photo ${result.photo}: Skipped</li>`;
                }
            });
            summary += '</ul>';
            
            document.getElementById('validation-summary').innerHTML = summary;
            
            // Save results
            console.log('Validation Results:', validationResults);
        }
        
        // Start with first photo
        showPhoto(1);
    </script>
</body>
</html>
"""
        
        # Save gallery
        gallery_path = f"{self.training_data_dir}/training_gallery.html"
        with open(gallery_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"✅ Training gallery created: {gallery_path}")
        
        # Open in browser
        try:
            webbrowser.open(f"file://{os.path.abspath(gallery_path)}")
            logger.info("🌐 Training gallery opened in browser")
        except Exception as e:
            logger.warning(f"⚠️ Could not open browser: {e}")
            logger.info(f"📁 Open manually: {gallery_path}")
        
        return gallery_path

def main():
    """Main function to generate procedural training data"""
    
    logger.info("🎨 Procedural Training Data Generator")
    logger.info("=" * 50)
    
    # Initialize generator
    generator = ProceduralTrainingGenerator()
    
    # Generate training pairs
    training_pairs = generator.generate_training_pairs(num_faces=20, variations_per_face=1)
    
    if training_pairs:
        # Create training gallery
        generator.create_training_gallery(training_pairs)
        
        logger.info("🎉 Procedural training data generation completed!")
        logger.info("💡 Features:")
        logger.info("  - Advanced procedural caricature effects")
        logger.info("  - Feature-based exaggeration")
        logger.info("  - Multiple styles (cartoon, chibi, anime)")
        logger.info("  - Training data gallery for review")
        logger.info("  - Ready for LoRA training")
    else:
        logger.error("❌ Failed to generate training data!")

if __name__ == "__main__":
    main()
