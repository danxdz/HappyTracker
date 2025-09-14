"""
Lightweight Caricature Generator using Stable Diffusion 1.5
Much lighter than SDXL - perfect for GTX 1060
"""

import torch
import cv2
import numpy as np
from PIL import Image
from diffusers import StableDiffusionPipeline
from pathlib import Path
import json
from typing import Dict, List, Tuple, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LightweightCaricatureGenerator:
    """
    Lightweight caricature generator using Stable Diffusion 1.5
    Optimized for GTX 1060 6GB VRAM
    """
    
    def __init__(self):
        """Initialize the lightweight caricature generator"""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"🎮 Using device: {self.device}")
        
        # Initialize SD 1.5 pipeline
        self._load_sd15_pipeline()
        
        # Caricature style templates
        self.style_templates = {
            "cartoon": {
                "base": "cartoon character, exaggerated features, colorful illustration",
                "exaggeration": "oversized eyes, prominent features, funny caricature"
            },
            "chibi": {
                "base": "chibi character, cute proportions, kawaii style",
                "exaggeration": "huge eyes, tiny body, adorable features"
            },
            "anime": {
                "base": "anime character, manga style, detailed illustration",
                "exaggeration": "expressive eyes, stylized features, anime caricature"
            },
            "disney": {
                "base": "Disney cartoon character, Pixar style, family-friendly",
                "exaggeration": "rounded features, expressive animation, Disney caricature"
            }
        }
        
    def _load_sd15_pipeline(self):
        """Load Stable Diffusion 1.5 pipeline with GTX 1060 optimization"""
        try:
            logger.info("📥 Loading Stable Diffusion 1.5 pipeline...")
            
            self.pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float16,
                use_safetensors=True,
                variant="fp16"
            )
            
            # GTX 1060 optimization
            if self.device == "cuda":
                self.pipe.enable_model_cpu_offload()
                self.pipe.enable_attention_slicing()
                
            logger.info("✅ Stable Diffusion 1.5 pipeline loaded successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to load SD 1.5 pipeline: {e}")
            raise
    
    def analyze_face_basic(self, image_path: str) -> Optional[Dict]:
        """
        Quick face analysis for caricature features
        Uses OpenCV for basic face detection and feature analysis
        """
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"❌ Could not load image: {image_path}")
                return None
                
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Load face cascade
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) == 0:
                logger.warning("⚠️ No faces detected")
                return None
                
            # Get the largest face
            face = max(faces, key=lambda x: x[2] * x[3])
            x, y, w, h = face
            
            # Extract face region
            face_region = image[y:y+h, x:x+w]
            
            # Basic feature analysis
            features = self._analyze_features(face_region, w, h)
            features['face_bbox'] = [x, y, w, h]
            
            logger.info(f"✅ Face analysis complete: {features}")
            return features
            
        except Exception as e:
            logger.error(f"❌ Face analysis failed: {e}")
            return None
    
    def _analyze_features(self, face_region: np.ndarray, width: int, height: int) -> Dict:
        """Analyze facial features for caricature generation"""
        
        # Convert to grayscale for analysis
        gray_face = cv2.cvtColor(face_region, cv2.COLOR_BGR2GRAY)
        
        # Eye detection
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        eyes = eye_cascade.detectMultiScale(gray_face, 1.1, 3)
        
        # Mouth detection (simplified)
        mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
        mouths = mouth_cascade.detectMultiScale(gray_face, 1.1, 3)
        
        # Analyze features
        features = {
            'eyes': self._analyze_eyes(eyes, width, height),
            'mouth': self._analyze_mouth(mouths, width, height),
            'face_shape': self._analyze_face_shape(width, height),
            'skin_tone': self._analyze_skin_tone(face_region)
        }
        
        return features
    
    def _analyze_eyes(self, eyes: List, width: int, height: int) -> Dict:
        """Analyze eye features"""
        if len(eyes) == 0:
            return {'size': 'unknown', 'count': 0, 'exaggeration': 'normal'}
        
        # Calculate average eye size
        avg_eye_size = sum(w * h for x, y, w, h in eyes) / len(eyes)
        face_area = width * height
        eye_ratio = avg_eye_size / face_area
        
        if eye_ratio > 0.05:
            size = 'large'
            exaggeration = 'oversized'
        elif eye_ratio < 0.02:
            size = 'small'
            exaggeration = 'tiny'
        else:
            size = 'normal'
            exaggeration = 'normal'
        
        return {
            'size': size,
            'count': len(eyes),
            'exaggeration': exaggeration,
            'ratio': eye_ratio
        }
    
    def _analyze_mouth(self, mouths: List, width: int, height: int) -> Dict:
        """Analyze mouth features"""
        if len(mouths) == 0:
            return {'size': 'unknown', 'exaggeration': 'normal'}
        
        # Calculate mouth size
        mouth = mouths[0]  # Take first detected mouth
        x, y, w, h = mouth
        mouth_area = w * h
        face_area = width * height
        mouth_ratio = mouth_area / face_area
        
        if mouth_ratio > 0.03:
            size = 'wide'
            exaggeration = 'oversized'
        elif mouth_ratio < 0.01:
            size = 'small'
            exaggeration = 'tiny'
        else:
            size = 'normal'
            exaggeration = 'normal'
        
        return {
            'size': size,
            'exaggeration': exaggeration,
            'ratio': mouth_ratio
        }
    
    def _analyze_face_shape(self, width: int, height: int) -> Dict:
        """Analyze face shape"""
        aspect_ratio = width / height
        
        if aspect_ratio > 1.2:
            shape = 'wide'
            exaggeration = 'extra_wide'
        elif aspect_ratio < 0.8:
            shape = 'long'
            exaggeration = 'extra_long'
        else:
            shape = 'balanced'
            exaggeration = 'normal'
        
        return {
            'shape': shape,
            'aspect_ratio': aspect_ratio,
            'exaggeration': exaggeration
        }
    
    def _analyze_skin_tone(self, face_region: np.ndarray) -> Dict:
        """Analyze skin tone"""
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(face_region, cv2.COLOR_BGR2HSV)
        
        # Calculate average skin tone
        avg_hue = np.mean(hsv[:, :, 0])
        avg_sat = np.mean(hsv[:, :, 1])
        avg_val = np.mean(hsv[:, :, 2])
        
        # Classify skin tone
        if avg_val > 180:
            tone = 'light'
        elif avg_val > 120:
            tone = 'medium'
        else:
            tone = 'dark'
        
        return {
            'tone': tone,
            'hue': avg_hue,
            'saturation': avg_sat,
            'value': avg_val
        }
    
    def generate_caricature_prompt(self, features: Dict, style: str = "cartoon", exaggeration_level: float = 1.0) -> str:
        """Convert features to caricature prompt"""
        
        if style not in self.style_templates:
            style = "cartoon"
        
        template = self.style_templates[style]
        prompt = f"{template['base']}, {template['exaggeration']}, "
        
        # Add feature-specific exaggerations
        if features['eyes']['exaggeration'] == 'oversized':
            prompt += "huge oversized eyes, big expressive cartoon eyes, "
        elif features['eyes']['exaggeration'] == 'tiny':
            prompt += "tiny beady eyes, small cartoon eyes, "
        
        if features['mouth']['exaggeration'] == 'oversized':
            prompt += "huge wide smile, oversized grin, "
        elif features['mouth']['exaggeration'] == 'tiny':
            prompt += "tiny cute mouth, small lips, "
        
        if features['face_shape']['exaggeration'] == 'extra_wide':
            prompt += "wide face, broad features, "
        elif features['face_shape']['exaggeration'] == 'extra_long':
            prompt += "long face, elongated features, "
        
        # Add skin tone
        skin_tone = features['skin_tone']['tone']
        prompt += f"{skin_tone} skin tone, "
        
        # Add style-specific elements
        if style == "chibi":
            prompt += "chibi proportions, kawaii style, adorable character"
        elif style == "anime":
            prompt += "anime caricature, manga illustration, detailed anime art"
        elif style == "disney":
            prompt += "Disney cartoon style, Pixar character, family-friendly animation"
        else:
            prompt += "cartoon illustration, colorful, funny caricature, professional caricature art"
        
        return prompt
    
    def generate_caricature(self, image_path: str, style: str = "cartoon", exaggeration_level: float = 1.0) -> Tuple[Optional[Image.Image], str, Dict]:
        """Generate caricature from photo using SD 1.5"""
        
        logger.info(f"🎭 Generating lightweight caricature for {image_path} with style: {style}")
        
        try:
            # Analyze face
            features = self.analyze_face_basic(image_path)
            if not features:
                logger.error("❌ No face detected, cannot generate caricature")
                return None, "", {}
            
            # Generate prompt
            prompt = self.generate_caricature_prompt(features, style, exaggeration_level)
            logger.info(f"📝 Generated prompt: {prompt}")
            
            # Negative prompt
            negative = "realistic, photographic, ugly, distorted, blurry, low quality, deformed"
            
            # Generate image with lightweight settings
            logger.info("🎨 Generating lightweight caricature image...")
            result = self.pipe(
                prompt=prompt,
                negative_prompt=negative,
                num_inference_steps=15,  # Lightweight: 15 steps
                guidance_scale=6.0,     # Lightweight: 6.0 guidance
                width=512,               # Lightweight: 512x512
                height=512,              # Lightweight: 512x512
                generator=torch.Generator(device=self.device).manual_seed(42)
            )
            
            caricature_image = result.images[0]
            logger.info("✅ Lightweight caricature generated successfully!")
            
            return caricature_image, prompt, features
            
        except Exception as e:
            logger.error(f"❌ Caricature generation failed: {e}")
            return None, "", {}
    
    def save_caricature(self, image: Image.Image, output_path: str, prompt: str, features: Dict):
        """Save caricature with metadata"""
        try:
            # Save image
            image.save(output_path)
            
            # Save metadata
            metadata_path = output_path.replace('.png', '_metadata.json')
            metadata = {
                'prompt': prompt,
                'features': features,
                'model': 'stable-diffusion-v1-5',
                'timestamp': str(Path(output_path).stat().st_mtime)
            }
            
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info(f"💾 Saved lightweight caricature: {output_path}")
            logger.info(f"💾 Saved metadata: {metadata_path}")
            
        except Exception as e:
            logger.error(f"❌ Failed to save caricature: {e}")


def test_lightweight_caricature():
    """Test lightweight caricature generation"""
    
    logger.info("🧪 Starting lightweight caricature generation test...")
    
    # Initialize generator
    generator = LightweightCaricatureGenerator()
    
    # Test images
    test_images = [
        "outputs/easy_test_with_cartoon.png",
        "outputs/test2.png",
        "outputs/test1.jpg"
    ]
    
    # Create output directory
    output_dir = Path("lightweight_caricature_output")
    output_dir.mkdir(exist_ok=True)
    
    # Test styles
    styles = ["cartoon", "chibi"]
    
    for image_path in test_images:
        if not Path(image_path).exists():
            logger.warning(f"⚠️ Test image not found: {image_path}")
            continue
            
        logger.info(f"📸 Processing {image_path}...")
        
        for style in styles:
            try:
                # Generate caricature
                caricature, prompt, features = generator.generate_caricature(image_path, style)
                
                if caricature:
                    # Save results
                    image_name = Path(image_path).stem
                    output_name = f"lightweight_{image_name}_{style}.png"
                    output_path = output_dir / output_name
                    
                    generator.save_caricature(caricature, str(output_path), prompt, features)
                    
                    logger.info(f"✅ Generated: {output_name}")
                    logger.info(f"📝 Prompt: {prompt[:100]}...")
                    logger.info("-" * 50)
                else:
                    logger.error(f"❌ Failed to generate caricature for {image_path}")
                    
            except Exception as e:
                logger.error(f"❌ Error with {image_path} ({style}): {e}")
    
    logger.info("🎉 Lightweight caricature generation test completed!")


if __name__ == "__main__":
    test_lightweight_caricature()
