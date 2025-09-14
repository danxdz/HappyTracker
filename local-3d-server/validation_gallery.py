#!/usr/bin/env python3
"""
Validation Gallery for Caricature Training
Shows photo vs generated caricature comparisons
"""

import os
import sys
from pathlib import Path
import logging
from PIL import Image
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

class ValidationGallery:
    """Validation gallery for caricature training results"""
    
    def __init__(self):
        self.collected_faces_dir = "./collected_faces"
        self.training_data_dir = "./training_data"
        self.gallery_output_dir = "./validation_gallery"
        
        # Create directories
        Path(self.gallery_output_dir).mkdir(exist_ok=True)
        
        logger.info(f"📁 Gallery output directory: {self.gallery_output_dir}")
        
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
                'face_bbox': [x, y, w, h]
            }
            
            # Eye detection
            eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
            eyes = eye_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
            features['eyes_detected'] = len(eyes)
            
            # Mouth detection
            mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
            mouths = mouth_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
            features['mouths_detected'] = len(mouths)
            
            return features
            
        except Exception as e:
            logger.error(f"❌ Face analysis failed: {e}")
            return {}
    
    def generate_caricature_with_lightweight(self, photo_path: str, style: str) -> Image.Image:
        """Generate caricature using lightweight generator"""
        try:
            # Import the lightweight generator
            from lightweight_caricature import LightweightCaricatureGenerator
            
            # Generate caricature
            generator = LightweightCaricatureGenerator()
            caricature, prompt, features = generator.generate_caricature(photo_path, style)
            
            return caricature
            
        except Exception as e:
            logger.error(f"❌ Caricature generation failed: {e}")
            return None
    
    def create_caricature_prompt(self, features: dict, style: str) -> str:
        """Create caricature prompt based on features"""
        prompt = f"caricature {style} character, exaggerated features, "
        
        # Add feature-specific exaggerations
        if features.get('eyes_detected', 0) >= 2:
            prompt += "large cartoon eyes, "
        if features.get('mouths_detected', 0) >= 1:
            prompt += "wide cartoon smile, "
            
        # Add style-specific elements
        if style == "chibi":
            prompt += "chibi proportions, kawaii style, adorable character"
        elif style == "anime":
            prompt += "anime caricature, manga illustration, detailed anime art"
        else:
            prompt += "cartoon illustration, colorful, funny caricature, professional caricature art"
        
        return prompt
    
    def create_gallery_html(self, gallery_data: list):
        """Create HTML gallery for validation"""
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caricature Validation Gallery</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .header h1 {{
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }}
        
        .header p {{
            margin: 10px 0 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .stats {{
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 20px 0;
            flex-wrap: wrap;
        }}
        
        .stat {{
            text-align: center;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            min-width: 120px;
        }}
        
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            display: block;
        }}
        
        .stat-label {{
            font-size: 0.9em;
            opacity: 0.8;
        }}
        
        .gallery {{
            padding: 30px;
        }}
        
        .gallery-item {{
            margin-bottom: 40px;
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            background: #fafafa;
        }}
        
        .gallery-header {{
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .gallery-title {{
            font-size: 1.3em;
            font-weight: 500;
        }}
        
        .gallery-features {{
            font-size: 0.9em;
            opacity: 0.8;
        }}
        
        .gallery-content {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            padding: 20px;
        }}
        
        .photo-section {{
            text-align: center;
        }}
        
        .photo-section h3 {{
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 1.1em;
        }}
        
        .photo-section img {{
            width: 100%;
            max-width: 200px;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .caricature-section {{
            text-align: center;
        }}
        
        .caricature-section h3 {{
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 1.1em;
        }}
        
        .caricature-section img {{
            width: 100%;
            max-width: 200px;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .prompt-section {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #3498db;
        }}
        
        .prompt-section h3 {{
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 1.1em;
        }}
        
        .prompt-text {{
            font-size: 0.9em;
            line-height: 1.4;
            color: #555;
            background: white;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }}
        
        .quality-badge {{
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-top: 10px;
        }}
        
        .quality-good {{
            background: #d4edda;
            color: #155724;
        }}
        
        .quality-poor {{
            background: #f8d7da;
            color: #721c24;
        }}
        
        .quality-unknown {{
            background: #fff3cd;
            color: #856404;
        }}
        
        .footer {{
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }}
        
        @media (max-width: 768px) {{
            .gallery-content {{
                grid-template-columns: 1fr;
            }}
            
            .stats {{
                flex-direction: column;
                align-items: center;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Caricature Validation Gallery</h1>
            <p>Photo → Caricature Generation Results</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">{len(gallery_data)}</span>
                    <span class="stat-label">Total Faces</span>
                </div>
                <div class="stat">
                    <span class="stat-number">{sum(1 for item in gallery_data if item.get('caricatures'))}</span>
                    <span class="stat-label">With Caricatures</span>
                </div>
                <div class="stat">
                    <span class="stat-number">{sum(len(item.get('caricatures', {})) for item in gallery_data)}</span>
                    <span class="stat-label">Total Caricatures</span>
                </div>
            </div>
        </div>
        
        <div class="gallery">
"""
        
        for i, item in enumerate(gallery_data):
            face_id = item['face_id']
            photo_path = item['photo_path']
            features = item['features']
            caricatures = item.get('caricatures', {})
            
            # Create feature description
            feature_desc = []
            if features.get('eyes_detected', 0) >= 2:
                feature_desc.append(f"{features['eyes_detected']} eyes")
            if features.get('mouths_detected', 0) >= 1:
                feature_desc.append(f"{features['mouths_detected']} mouth(s)")
            if features.get('face_size'):
                feature_desc.append(f"Face size: {features['face_size']}")
            
            feature_text = ", ".join(feature_desc) if feature_desc else "No features detected"
            
            html_content += f"""
            <div class="gallery-item">
                <div class="gallery-header">
                    <div class="gallery-title">Face {face_id}</div>
                    <div class="gallery-features">{feature_text}</div>
                </div>
                <div class="gallery-content">
                    <div class="photo-section">
                        <h3>📸 Original Photo</h3>
                        <img src="{photo_path}" alt="Original photo">
                    </div>
"""
            
            # Add caricature sections
            for style, caricature_data in caricatures.items():
                caricature_path = caricature_data['path']
                prompt = caricature_data['prompt']
                quality = caricature_data.get('quality', 'unknown')
                
                quality_class = f"quality-{quality}"
                quality_text = quality.title()
                
                html_content += f"""
                    <div class="caricature-section">
                        <h3>🎭 {style.title()} Caricature</h3>
                        <img src="{caricature_path}" alt="{style} caricature">
                        <div class="quality-badge {quality_class}">{quality_text}</div>
                    </div>
"""
            
            # Add prompt section
            if caricatures:
                first_prompt = list(caricatures.values())[0]['prompt']
                html_content += f"""
                    <div class="prompt-section">
                        <h3>📝 Generated Prompt</h3>
                        <div class="prompt-text">{first_prompt}</div>
                    </div>
"""
            
            html_content += """
                </div>
            </div>
"""
        
        html_content += """
        </div>
        
        <div class="footer">
            <p>Generated by Caricature Validation Gallery</p>
            <p>Use this gallery to assess caricature quality and identify training improvements</p>
        </div>
    </div>
</body>
</html>
"""
        
        return html_content
    
    def generate_validation_gallery(self, num_faces: int = 10):
        """Generate validation gallery with photo-caricature comparisons"""
        logger.info(f"🎨 Generating validation gallery for {num_faces} faces...")
        
        # Get list of collected faces
        face_files = list(Path(self.collected_faces_dir).glob("face_*.jpg"))
        
        if not face_files:
            logger.error("❌ No collected faces found! Run auto_face_collector.py first.")
            return
        
        # Limit to requested number
        num_faces = min(num_faces, len(face_files))
        selected_faces = face_files[:num_faces]
        
        gallery_data = []
        
        for i, face_file in enumerate(selected_faces):
            logger.info(f"📸 Processing face {i+1}/{num_faces}: {face_file.name}")
            
            # Analyze face features
            features = self.analyze_face_features(str(face_file))
            
            if not features:
                logger.warning(f"⚠️ No face detected in {face_file.name}")
                continue
            
            # Generate caricatures for different styles
            caricatures = {}
            styles = ["cartoon", "chibi", "anime"]
            
            for style in styles:
                logger.info(f"🎨 Generating {style} caricature...")
                
                # Generate caricature
                caricature = self.generate_caricature_with_lightweight(str(face_file), style)
                
                if caricature:
                    # Save caricature
                    caricature_filename = f"{face_file.stem}_{style}.jpg"
                    caricature_path = f"{self.gallery_output_dir}/{caricature_filename}"
                    caricature.save(caricature_path)
                    
                    # Create prompt
                    prompt = self.create_caricature_prompt(features, style)
                    
                    caricatures[style] = {
                        'path': caricature_path,
                        'prompt': prompt,
                        'quality': 'unknown'  # Will be manually assessed
                    }
                    
                    logger.info(f"✅ Generated {style} caricature: {caricature_filename}")
                else:
                    logger.error(f"❌ Failed to generate {style} caricature for {face_file.name}")
            
            # Add to gallery data
            gallery_data.append({
                'face_id': face_file.stem,
                'photo_path': str(face_file),
                'features': features,
                'caricatures': caricatures
            })
        
        # Create HTML gallery
        html_content = self.create_gallery_html(gallery_data)
        
        # Save HTML file
        html_path = f"{self.gallery_output_dir}/validation_gallery.html"
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"✅ Validation gallery created: {html_path}")
        logger.info(f"📊 Gallery contains {len(gallery_data)} faces with {sum(len(item.get('caricatures', {})) for item in gallery_data)} caricatures")
        
        # Open in browser
        try:
            webbrowser.open(f"file://{os.path.abspath(html_path)}")
            logger.info("🌐 Gallery opened in browser")
        except Exception as e:
            logger.warning(f"⚠️ Could not open browser: {e}")
            logger.info(f"📁 Open manually: {html_path}")
        
        return html_path

def main():
    """Main function to generate validation gallery"""
    
    logger.info("🎨 Caricature Validation Gallery Generator")
    logger.info("=" * 50)
    
    # Initialize gallery
    gallery = ValidationGallery()
    
    # Generate gallery
    html_path = gallery.generate_validation_gallery(num_faces=10)
    
    if html_path:
        logger.info("🎉 Validation gallery generation completed!")
        logger.info("💡 Use the gallery to:")
        logger.info("  - Compare photo vs caricature quality")
        logger.info("  - Assess different style results")
        logger.info("  - Identify training improvements")
        logger.info("  - Validate caricature generation")
    else:
        logger.error("❌ Failed to generate validation gallery!")

if __name__ == "__main__":
    main()
