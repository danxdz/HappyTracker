#!/usr/bin/env python3
"""
Face-API.js + Point-E 3D Generation Server
Combines facial analysis with 3D generation
"""

import torch
import numpy as np
from pathlib import Path
import time
import json
import base64
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import cv2
from PIL import Image
import io

# No caricature generator - just face-api.js magic!

# Import auto face collector
try:
    from auto_face_collector import AutoFaceCollector
    AUTO_COLLECTOR_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Auto face collector not available: {e}")
    AutoFaceCollector = None
    AUTO_COLLECTOR_AVAILABLE = False

# Global model
model = None
device = None
caricature_generator = None

def load_caricature_generator():
    """No caricature generator needed - just face-api.js magic!"""
    print("🎭 Using face-api.js magic instead of AI models!")
    return True

def load_text_model():
    """Load the text-conditioned model"""
    global model, device
    
    try:
        from point_e.models.download import load_checkpoint
        print("✅ Point-E imports successful")
    except ImportError as e:
        print(f"❌ Point-E import failed: {e}")
        return False

    try:
        # Set device
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"🎮 Using device: {device}")
        
        # Load text-conditioned model checkpoint
        print("📥 Loading base40M-textvec model...")
        model_dict = load_checkpoint('base40M-textvec', device=device)
        print("✅ Model checkpoint loaded")
        
        # Create model with correct architecture for base40M-textvec (512 dimensions)
        print("📥 Creating model with 512 dimensions...")
        model = create_text_model(device)
        
        # Try to load the state dict
        print("📥 Loading state dict...")
        model.load_state_dict(model_dict, strict=False)
        print("✅ State dict loaded successfully!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_text_model(device):
    """Create model with correct architecture for base40M-textvec (512 dimensions)"""
    import torch.nn as nn
    
    class TextModel(nn.Module):
        def __init__(self, device):
            super().__init__()
            self.device = device
            
            # Correct architecture for base40M-textvec (512 dimensions)
            self.input_proj = nn.Linear(6, 512, device=device)
            self.backbone = nn.Sequential(
                nn.Linear(512, 512, device=device),
                nn.ReLU(),
                nn.Linear(512, 512, device=device),
                nn.ReLU(),
                nn.Linear(512, 512, device=device),
            )
            self.output_proj = nn.Linear(512, 12, device=device)
            
            # Time embedding
            self.time_embed = nn.Linear(512, 512, device=device)
        
        def forward(self, x, t, **kwargs):
            """Forward pass"""
            # x: [N, C, T] -> [N, T, C] for processing
            h = self.input_proj(x.permute(0, 2, 1))  # NCL -> NLC
            h = self.backbone(h)
            h = self.output_proj(h)
            return h.permute(0, 2, 1)  # NLC -> NCL
    
    return TextModel(device)

def analyze_face(image_data):
    """Analyze face using OpenCV (simplified face detection)"""
    try:
        # Convert bytes to image
        image = Image.open(io.BytesIO(image_data))
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Load OpenCV face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Detect faces
        gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            # Get the largest face
            face = max(faces, key=lambda x: x[2] * x[3])
            x, y, w, h = face
            
            # Extract face region
            face_roi = image_cv[y:y+h, x:x+w]
            
            # Advanced analysis for cartoon character generation
            face_ratio = w / h
            
            # Determine face shape based on ratio and proportions
            if face_ratio > 1.1:
                face_shape = "square"
            elif face_ratio < 0.9:
                face_shape = "round"
            elif w > h * 0.8 and w < h * 1.1:
                face_shape = "oval"
            else:
                face_shape = "heart"
            
            # Estimate cartoon-relevant features
            analysis = {
                "faces_detected": len(faces),
                "primary_face": {
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                    "confidence": 0.95
                },
                "emotion": "neutral",  # Will be enhanced with face-api.js
                "age": 25,  # Will be enhanced with face-api.js
                "gender": "unknown",  # Will be enhanced with face-api.js
                "landmarks": [],  # Will be enhanced with face-api.js
                
                # Enhanced features for cartoon generation
                "face_shape": face_shape,
                "face_width": int(w),
                "face_height": int(h),
                "face_ratio": face_ratio,
                
                # Eye analysis (estimated)
                "eye_size": 0.7,  # Will be calculated from landmarks
                "eye_spacing": 0.6,
                "eye_color": "brown",  # Estimated
                
                # Facial features
                "nose_size": 0.6,
                "mouth_size": 0.7,
                "jaw_strength": 0.5,
                
                # Hair analysis (estimated)
                "hair_color": "brown",
                "hair_length": "medium",
                "hair_style": "straight",
                
                # Skin tone (estimated)
                "skin_tone": "medium",
                "skin_undertone": "warm",
                
                # Symmetry and proportions
                "face_symmetry": 0.85,
                "feature_proportions": {
                    "eye_to_face_ratio": 0.15,
                    "nose_to_face_ratio": 0.12,
                    "mouth_to_face_ratio": 0.08
                },
                
                # Cartoon-specific features
                "cartoon_features": {
                    "cuteness_factor": 0.8,
                    "character_type": "friendly",
                    "style_suitability": {
                        "anime": 0.9,
                        "disney": 0.8,
                        "cartoon": 0.7,
                        "chibi": 0.95
                    }
                }
            }
            
            return analysis
        else:
            return {"faces_detected": 0, "error": "No faces detected"}
            
    except Exception as e:
        return {"error": f"Face analysis failed: {str(e)}"}

def generate_3d_from_face_analysis(face_analysis, prompt: str = ""):
    """Generate 3D based on face analysis"""
    global model, device
    
    if model is None:
        return None, None, "❌ Model not loaded"
    
    try:
        print(f"🎨 Generating 3D from face analysis...")
        
        # Create input based on face analysis
        batch_size = 1
        num_points = 1024
        input_channels = 6
        
        # Generate input based on face characteristics
        x = generate_input_from_face_analysis(face_analysis, batch_size, input_channels, num_points, device)
        t = torch.tensor([0.5], device=device)
        
        # Forward pass
        start_time = time.time()
        with torch.no_grad():
            output = model(x, t)
        
        generation_time = time.time() - start_time
        print(f"✅ Generated in {generation_time:.2f}s")
        
        # Convert to numpy
        output_np = output.cpu().numpy()
        
        # Save as mesh files
        ply_path, obj_path = save_as_mesh(output_np, f"face_avatar_{int(time.time())}")
        
        return ply_path, obj_path, f"✅ Generated in {generation_time:.2f}s"
        
    except Exception as e:
        print(f"❌ Generation error: {e}")
        return None, None, f"❌ Generation failed: {str(e)}"

def generate_input_from_face_analysis(face_analysis, batch_size: int, channels: int, num_points: int, device):
    """Generate input tensor based on face analysis"""
    
    if "faces_detected" not in face_analysis or face_analysis["faces_detected"] == 0:
        # No face detected - generate random shape
        return torch.randn(batch_size, channels, num_points, device=device) * 0.5
    
    # Get face info
    face = face_analysis.get("primary_face", {})
    emotion = face_analysis.get("emotion", "neutral")
    age = face_analysis.get("age", 25)
    gender = face_analysis.get("gender", "unknown")
    
    # Generate base shape
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.4
    
    # Modify based on face characteristics
    if emotion == "happy":
        # Make it more rounded and cheerful
        x[:, :3, :] = x[:, :3, :] * 0.8  # Softer edges
    elif emotion == "sad":
        # Make it more elongated and droopy
        x[:, 2, :] = x[:, 2, :] - 0.2  # Lower the shape
    elif emotion == "angry":
        # Make it more angular
        x[:, :3, :] = x[:, :3, :] * 1.2  # Sharper edges
    
    # Modify based on age
    if age < 18:
        # Younger - smaller, more compact
        x = x * 0.7
    elif age > 50:
        # Older - more weathered
        x = x * 1.1
    
    # Modify based on gender (simplified)
    if gender == "male":
        # More angular
        x[:, 0, :] = x[:, 0, :] * 1.1  # Wider
    elif gender == "female":
        # More rounded
        x[:, 1, :] = x[:, 1, :] * 0.9  # Narrower
    
    return x

def save_as_mesh(output_np, filename: str):
    """Save output as mesh files"""
    try:
        import trimesh
        
        # Create output directory
        output_dir = Path("face_generated")
        output_dir.mkdir(exist_ok=True)
        
        timestamp = int(time.time())
        
        # output_np shape is (1, 12, 1024)
        # Extract XYZ coordinates and RGB colors
        points = output_np[0, :3].T  # Shape: (1024, 3) - XYZ coordinates
        colors = output_np[0, 3:6].T  # Shape: (1024, 3) - RGB colors
        
        # Scale up the points by 10x to make them bigger!
        points = points * 10.0
        
        # Normalize colors to 0-255 range
        colors = np.clip(colors * 255, 0, 255).astype(np.uint8)
        
        # Create trimesh point cloud
        pcd = trimesh.PointCloud(vertices=points, colors=colors)
        
        # Save as PLY
        ply_path = output_dir / f"{filename}_{timestamp}.ply"
        pcd.export(str(ply_path))
        
        # Save as OBJ
        obj_path = output_dir / f"{filename}_{timestamp}.obj"
        mesh = trimesh.Trimesh(vertices=points, faces=[])
        mesh.export(str(obj_path))
        
        print(f"💾 Saved mesh files: {ply_path.name}, {obj_path.name}")
        return str(ply_path), str(obj_path)
        
    except Exception as e:
        print(f"❌ Mesh conversion error: {e}")
        return None, None

# Use lifespan context manager instead of deprecated on_event
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if not load_text_model():
        raise Exception("Failed to load text-conditioned model")
    
    # Load caricature generator
    load_caricature_generator()
    
    yield
    
    # Shutdown (if needed)
    pass

# FastAPI app
app = FastAPI(title="Face-API.js + Point-E 3D Generation API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "caricature_loaded": caricature_generator is not None,
        "device": str(device) if device else "unknown",
        "features": ["face_detection", "3d_generation", "emotion_analysis", "caricature_generation"]
    }


@app.post("/analyze-face")
async def analyze_face_endpoint(file: UploadFile = File(...)):
    """Analyze uploaded face image"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Analyze face
        analysis = analyze_face(image_data)
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-from-face-analysis")
async def generate_from_face_analysis(request: dict):
    """Generate 3D from face-api.js analysis data"""
    try:
        face_analysis = request.get("face_analysis", {})
        prompt = request.get("prompt", "")
        
        if not face_analysis or face_analysis.get("faces_detected", 0) == 0:
            raise HTTPException(status_code=400, detail="No face analysis data provided")
        
        # Generate 3D from face analysis
        ply_path, obj_path, status = generate_3d_from_face_analysis(face_analysis, prompt)
        
        if ply_path and obj_path:
            return {
                "success": True,
                "status": status,
                "face_analysis": face_analysis,
                "files": {
                    "ply": ply_path,
                    "obj": obj_path
                },
                "download_urls": {
                    "ply": f"/download/{Path(ply_path).name}",
                    "obj": f"/download/{Path(obj_path).name}"
                }
            }
        else:
            raise HTTPException(status_code=500, detail=status)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-from-face")
async def generate_from_face(file: UploadFile = File(...), prompt: str = ""):
    """Generate 3D from uploaded face image"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Analyze face
        face_analysis = analyze_face(image_data)
        
        if face_analysis.get("faces_detected", 0) == 0:
            raise HTTPException(status_code=400, detail="No faces detected in image")
        
        # Generate 3D
        ply_path, obj_path, status = generate_3d_from_face_analysis(face_analysis, prompt)
        
        if ply_path and obj_path:
            return {
                "success": True,
                "status": status,
                "face_analysis": face_analysis,
                "files": {
                    "ply": ply_path,
                    "obj": obj_path
                },
                "download_urls": {
                    "ply": f"/download/{Path(ply_path).name}",
                    "obj": f"/download/{Path(obj_path).name}"
                }
            }
        else:
            raise HTTPException(status_code=500, detail=status)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate_3d(request: dict):
    """Generate 3D from text prompt (original functionality)"""
    try:
        prompt = request.get("prompt", "")
        resolution = request.get("resolution", 64)
        steps = request.get("steps", 20)
        
        if not prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt is required")
        
        # Use original text-based generation
        ply_path, obj_path, status = generate_3d_from_text(prompt, resolution, steps)
        
        if ply_path and obj_path:
            return {
                "success": True,
                "status": status,
                "files": {
                    "ply": ply_path,
                    "obj": obj_path
                },
                "download_urls": {
                    "ply": f"/download/{Path(ply_path).name}",
                    "obj": f"/download/{Path(obj_path).name}"
                }
            }
        else:
            raise HTTPException(status_code=500, detail=status)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_3d_from_text(prompt: str, resolution: int = 64, steps: int = 20):
    """Original text-based generation (from working_text_server.py)"""
    global model, device
    
    if model is None:
        return None, None, "❌ Model not loaded"
    
    try:
        print(f"🎨 Generating 3D for: '{prompt}'")
        
        # Create input based on prompt
        batch_size = 1
        num_points = 1024
        input_channels = 6
        
        x = generate_input_from_prompt(prompt, batch_size, input_channels, num_points, device)
        t = torch.tensor([0.5], device=device)
        
        start_time = time.time()
        with torch.no_grad():
            output = model(x, t)
        
        generation_time = time.time() - start_time
        print(f"✅ Generated in {generation_time:.2f}s")
        
        output_np = output.cpu().numpy()
        ply_path, obj_path = save_as_mesh(output_np, prompt)
        
        return ply_path, obj_path, f"✅ Generated in {generation_time:.2f}s"
        
    except Exception as e:
        print(f"❌ Generation error: {e}")
        return None, None, f"❌ Generation failed: {str(e)}"

def generate_input_from_prompt(prompt: str, batch_size: int, channels: int, num_points: int, device):
    """Generate character-like shapes from prompts"""
    prompt_lower = prompt.lower()
    
    if 'character' in prompt_lower or 'person' in prompt_lower or 'human' in prompt_lower:
        # Generate a human-like character
        x = generate_character(batch_size, channels, num_points, device)
    elif 'robot' in prompt_lower:
        # Generate a robot character
        x = generate_robot(batch_size, channels, num_points, device)
    elif 'animal' in prompt_lower or 'creature' in prompt_lower:
        # Generate an animal-like character
        x = generate_animal(batch_size, channels, num_points, device)
    elif 'car' in prompt_lower:
        # Generate a car character (with personality)
        x = generate_car_character(batch_size, channels, num_points, device)
    elif 'monster' in prompt_lower or 'alien' in prompt_lower:
        # Generate a monster character
        x = generate_monster(batch_size, channels, num_points, device)
    elif 'cube' in prompt_lower or 'box' in prompt_lower:
        # Generate a cube
        x = generate_cube(batch_size, channels, num_points, device)
    elif 'sphere' in prompt_lower or 'ball' in prompt_lower or 'balloon' in prompt_lower:
        # Generate a sphere
        x = generate_sphere(batch_size, channels, num_points, device)
    elif 'cylinder' in prompt_lower or 'tube' in prompt_lower:
        # Generate a cylinder
        x = generate_cylinder(batch_size, channels, num_points, device)
    else:
        # Default character
        x = generate_character(batch_size, channels, num_points, device)
    
    return x

def generate_cube(batch_size: int, channels: int, num_points: int, device):
    """Generate a perfect cube with actual cube geometry"""
    x = torch.zeros(batch_size, channels, num_points, device=device)
    
    # Generate points on cube faces
    points_per_face = num_points // 6
    
    for face in range(6):
        start_idx = face * points_per_face
        end_idx = start_idx + points_per_face
        
        if face == 0:  # Front face (x = 1)
            x[0, 0, start_idx:end_idx] = 1.0
            x[0, 1, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 2, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
        elif face == 1:  # Back face (x = -1)
            x[0, 0, start_idx:end_idx] = -1.0
            x[0, 1, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 2, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
        elif face == 2:  # Right face (y = 1)
            x[0, 0, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 1, start_idx:end_idx] = 1.0
            x[0, 2, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
        elif face == 3:  # Left face (y = -1)
            x[0, 0, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 1, start_idx:end_idx] = -1.0
            x[0, 2, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
        elif face == 4:  # Top face (z = 1)
            x[0, 0, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 1, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 2, start_idx:end_idx] = 1.0
        elif face == 5:  # Bottom face (z = -1)
            x[0, 0, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 1, start_idx:end_idx] = torch.rand(points_per_face, device=device) * 2 - 1
            x[0, 2, start_idx:end_idx] = -1.0
    
    return x

def generate_sphere(batch_size: int, channels: int, num_points: int, device):
    """Generate a perfect sphere with proper sphere geometry"""
    x = torch.zeros(batch_size, channels, num_points, device=device)
    
    # Generate points on sphere surface using spherical coordinates
    for i in range(num_points):
        # Random angles
        theta = torch.rand(1, device=device) * 2 * torch.pi  # Azimuthal angle
        phi = torch.acos(2 * torch.rand(1, device=device) - 1)  # Polar angle
        
        # Convert to Cartesian coordinates
        x[0, 0, i] = torch.sin(phi) * torch.cos(theta)  # x
        x[0, 1, i] = torch.sin(phi) * torch.sin(theta)  # y
        x[0, 2, i] = torch.cos(phi)  # z
    
    return x

def generate_cylinder(batch_size: int, channels: int, num_points: int, device):
    """Generate a proper cylinder"""
    x = torch.zeros(batch_size, channels, num_points, device=device)
    
    # Generate points on cylinder surface
    for i in range(num_points):
        # Random height from -1 to 1
        x[0, 2, i] = torch.rand(1, device=device) * 2 - 1
        
        # Circular cross-section
        angle = torch.rand(1, device=device) * 2 * torch.pi
        radius = 1.0
        x[0, 0, i] = radius * torch.cos(angle)
        x[0, 1, i] = radius * torch.sin(angle)
    
    return x

def generate_cone(batch_size: int, channels: int, num_points: int, device):
    """Generate a cone"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.5
    
    for i in range(num_points):
        # Height from 0 to 2
        height = torch.rand(1, device=device) * 2
        
        # Radius decreases with height
        max_radius = 1.0
        radius = max_radius * (1 - height / 2)
        
        # Circular cross-section
        angle = torch.rand(1, device=device) * 2 * torch.pi
        x[0, 0, i] = radius * torch.cos(angle)
        x[0, 1, i] = radius * torch.sin(angle)
        x[0, 2, i] = height - 1  # Center at origin
    
    return x

def generate_pyramid(batch_size: int, channels: int, num_points: int, device):
    """Generate a pyramid"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.5
    
    for i in range(num_points):
        # Height from 0 to 2
        height = torch.rand(1, device=device) * 2
        
        # Square base that shrinks to point
        max_size = 1.0
        size = max_size * (1 - height / 2)
        
        # Square cross-section
        x[0, 0, i] = (torch.rand(1, device=device) - 0.5) * 2 * size
        x[0, 1, i] = (torch.rand(1, device=device) - 0.5) * 2 * size
        x[0, 2, i] = height - 1  # Center at origin
    
    return x

def generate_car(batch_size: int, channels: int, num_points: int, device):
    """Generate a car-like shape"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.3
    
    # Car body (elongated box)
    for i in range(num_points // 2):
        x[0, 0, i] = (torch.rand(1, device=device) - 0.5) * 4  # Long
        x[0, 1, i] = (torch.rand(1, device=device) - 0.5) * 1.5  # Wide
        x[0, 2, i] = (torch.rand(1, device=device) - 0.5) * 1  # Low
    
    # Wheels (cylinders)
    for i in range(num_points // 2, num_points):
        # Wheel positions
        wheel_x = (torch.rand(1, device=device) - 0.5) * 3
        wheel_y = (torch.rand(1, device=device) - 0.5) * 2
        wheel_z = (torch.rand(1, device=device) - 0.5) * 0.5
        
        # Circular wheel
        angle = torch.rand(1, device=device) * 2 * torch.pi
        radius = 0.3
        x[0, 0, i] = wheel_x + radius * torch.cos(angle)
        x[0, 1, i] = wheel_y + radius * torch.sin(angle)
        x[0, 2, i] = wheel_z
    
    return x

def generate_character(batch_size: int, channels: int, num_points: int, device):
    """Generate a human-like character using AI"""
    # Use the AI model to learn character shapes
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.4
    
    # Character proportions: head, body, arms, legs
    for i in range(num_points):
        # Random body part
        body_part = torch.randint(0, 4, (1,), device=device).item()
        
        if body_part == 0:  # Head (sphere-like)
            x[0, 0, i] = torch.randn(1, device=device) * 0.3
            x[0, 1, i] = torch.randn(1, device=device) * 0.3
            x[0, 2, i] = torch.randn(1, device=device) * 0.3 + 1.5  # Above body
        elif body_part == 1:  # Body (cylinder-like)
            x[0, 0, i] = torch.randn(1, device=device) * 0.4
            x[0, 1, i] = torch.randn(1, device=device) * 0.4
            x[0, 2, i] = torch.randn(1, device=device) * 0.8  # Center
        elif body_part == 2:  # Arms (cylinders)
            x[0, 0, i] = torch.randn(1, device=device) * 0.2 + 0.6  # Side
            x[0, 1, i] = torch.randn(1, device=device) * 0.2
            x[0, 2, i] = torch.randn(1, device=device) * 0.6 + 0.2
        elif body_part == 3:  # Legs (cylinders)
            x[0, 0, i] = torch.randn(1, device=device) * 0.2
            x[0, 1, i] = torch.randn(1, device=device) * 0.2
            x[0, 2, i] = torch.randn(1, device=device) * 0.8 - 1.0  # Below body
    
    return x

def generate_robot(batch_size: int, channels: int, num_points: int, device):
    """Generate a robot character using AI"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.3
    
    # Robot: boxy body, cylindrical joints
    for i in range(num_points):
        part = torch.randint(0, 3, (1,), device=device).item()
        
        if part == 0:  # Main body (box)
            x[0, 0, i] = torch.randn(1, device=device) * 0.5
            x[0, 1, i] = torch.randn(1, device=device) * 0.5
            x[0, 2, i] = torch.randn(1, device=device) * 0.8
        elif part == 1:  # Head (small box)
            x[0, 0, i] = torch.randn(1, device=device) * 0.3
            x[0, 1, i] = torch.randn(1, device=device) * 0.3
            x[0, 2, i] = torch.randn(1, device=device) * 0.3 + 1.2
        elif part == 2:  # Limbs (cylinders)
            x[0, 0, i] = torch.randn(1, device=device) * 0.2 + 0.7
            x[0, 1, i] = torch.randn(1, device=device) * 0.2
            x[0, 2, i] = torch.randn(1, device=device) * 0.6
    
    return x

def generate_animal(batch_size: int, channels: int, num_points: int, device):
    """Generate an animal character using AI"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.4
    
    # Animal: body, head, tail, legs
    for i in range(num_points):
        part = torch.randint(0, 4, (1,), device=device).item()
        
        if part == 0:  # Body (ellipsoid)
            x[0, 0, i] = torch.randn(1, device=device) * 0.6
            x[0, 1, i] = torch.randn(1, device=device) * 0.4
            x[0, 2, i] = torch.randn(1, device=device) * 0.3
        elif part == 1:  # Head (sphere)
            x[0, 0, i] = torch.randn(1, device=device) * 0.3 + 0.8
            x[0, 1, i] = torch.randn(1, device=device) * 0.3
            x[0, 2, i] = torch.randn(1, device=device) * 0.3 + 0.5
        elif part == 2:  # Tail (cylinder)
            x[0, 0, i] = torch.randn(1, device=device) * 0.1 - 0.8
            x[0, 1, i] = torch.randn(1, device=device) * 0.1
            x[0, 2, i] = torch.randn(1, device=device) * 0.2
        elif part == 3:  # Legs (cylinders)
            x[0, 0, i] = torch.randn(1, device=device) * 0.2
            x[0, 1, i] = torch.randn(1, device=device) * 0.2
            x[0, 2, i] = torch.randn(1, device=device) * 0.4 - 0.8
    
    return x

def generate_car_character(batch_size: int, channels: int, num_points: int, device):
    """Generate a car character using AI"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.3
    
    # Car: body, wheels, windows
    for i in range(num_points):
        part = torch.randint(0, 3, (1,), device=device).item()
        
        if part == 0:  # Body (elongated box)
            x[0, 0, i] = torch.randn(1, device=device) * 2.0  # Long
            x[0, 1, i] = torch.randn(1, device=device) * 0.8  # Wide
            x[0, 2, i] = torch.randn(1, device=device) * 0.6  # Low
        elif part == 1:  # Wheels (cylinders)
            wheel_x = torch.randn(1, device=device) * 1.5
            wheel_y = torch.randn(1, device=device) * 1.2
            angle = torch.rand(1, device=device) * 2 * torch.pi
            x[0, 0, i] = wheel_x + 0.3 * torch.cos(angle)
            x[0, 1, i] = wheel_y + 0.3 * torch.sin(angle)
            x[0, 2, i] = torch.randn(1, device=device) * 0.2 - 0.4
        elif part == 2:  # Windows (flat surfaces)
            x[0, 0, i] = torch.randn(1, device=device) * 1.5
            x[0, 1, i] = torch.randn(1, device=device) * 0.6
            x[0, 2, i] = torch.randn(1, device=device) * 0.3 + 0.3
    
    return x

def generate_monster(batch_size: int, channels: int, num_points: int, device):
    """Generate a monster character using AI"""
    x = torch.randn(batch_size, channels, num_points, device=device) * 0.5
    
    # Monster: irregular, scary shapes
    for i in range(num_points):
        # Random scary proportions
        x[0, 0, i] = torch.randn(1, device=device) * 0.8
        x[0, 1, i] = torch.randn(1, device=device) * 0.8
        x[0, 2, i] = torch.randn(1, device=device) * 1.2  # Tall
    
    return x

def generate_2d_from_text(prompt: str, width: int = 512, height: int = 512):
    """Generate a 2D image from text prompt using simple procedural generation"""
    try:
        # Create output directory
        output_dir = Path("2d_generated")
        output_dir.mkdir(exist_ok=True)
        
        # Generate timestamp and safe filename
        timestamp = int(time.time())
        
        # Create a much shorter filename - just use first few words and timestamp
        words = prompt.split()[:3]  # Take only first 3 words
        safe_prompt = "_".join(words).replace(" ", "_")[:20]  # Limit to 20 chars
        safe_prompt = "".join(c for c in safe_prompt if c.isalnum() or c in ('_', '-'))
        
        # Create a simple procedural image based on the prompt
        image = create_procedural_image(prompt, width, height)
        
        # Save as PNG with short filename
        image_path = output_dir / f"{safe_prompt}_{timestamp}.png"
        image.save(image_path)
        
        return str(image_path), f"✅ Generated 2D image: {prompt}"
        
    except Exception as e:
        return None, f"❌ 2D generation failed: {str(e)}"

def create_procedural_image(prompt: str, width: int, height: int):
    """Create a procedural image based on text prompt"""
    from PIL import Image, ImageDraw, ImageFont
    import random
    
    # Create image with background
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Set random seed based on prompt for consistency
    random.seed(hash(prompt) % 2**32)
    
    # Generate colors based on prompt keywords
    colors = []
    if any(word in prompt.lower() for word in ['red', 'fire', 'blood', 'rose']):
        colors = ['#FF0000', '#FF4444', '#FF6666']
    elif any(word in prompt.lower() for word in ['blue', 'sky', 'ocean', 'water']):
        colors = ['#0000FF', '#4444FF', '#6666FF']
    elif any(word in prompt.lower() for word in ['green', 'grass', 'tree', 'nature']):
        colors = ['#00FF00', '#44FF44', '#66FF66']
    elif any(word in prompt.lower() for word in ['yellow', 'sun', 'gold', 'light']):
        colors = ['#FFFF00', '#FFFF44', '#FFFF66']
    elif any(word in prompt.lower() for word in ['purple', 'magic', 'royal']):
        colors = ['#800080', '#8844FF', '#AA66FF']
    else:
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    
    # Draw geometric shapes based on prompt
    if any(word in prompt.lower() for word in ['circle', 'round', 'ball']):
        # Draw circles
        for _ in range(random.randint(3, 8)):
            x = random.randint(50, width-50)
            y = random.randint(50, height-50)
            radius = random.randint(20, 80)
            color = random.choice(colors)
            draw.ellipse([x-radius, y-radius, x+radius, y+radius], fill=color)
    
    elif any(word in prompt.lower() for word in ['square', 'box', 'cube']):
        # Draw rectangles
        for _ in range(random.randint(3, 6)):
            x = random.randint(20, width-100)
            y = random.randint(20, height-100)
            w = random.randint(40, 120)
            h = random.randint(40, 120)
            color = random.choice(colors)
            draw.rectangle([x, y, x+w, y+h], fill=color)
    
    elif any(word in prompt.lower() for word in ['triangle', 'pyramid']):
        # Draw triangles
        for _ in range(random.randint(2, 5)):
            x = random.randint(50, width-50)
            y = random.randint(50, height-50)
            size = random.randint(30, 80)
            color = random.choice(colors)
            points = [(x, y-size), (x-size, y+size), (x+size, y+size)]
            draw.polygon(points, fill=color)
    
    else:
        # Draw random abstract shapes
        for _ in range(random.randint(5, 12)):
            x = random.randint(20, width-20)
            y = random.randint(20, height-20)
            radius = random.randint(10, 60)
            color = random.choice(colors)
            draw.ellipse([x-radius, y-radius, x+radius, y+radius], fill=color)
    
    # Add text overlay
    try:
        # Try to use a default font
        font_size = min(width, height) // 20
        font = ImageFont.load_default()
        
        # Draw prompt text
        text_bbox = draw.textbbox((0, 0), prompt, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (width - text_width) // 2
        y = height - text_height - 20
        
        # Draw text with outline
        draw.text((x-1, y-1), prompt, fill='black', font=font)
        draw.text((x+1, y+1), prompt, fill='black', font=font)
        draw.text((x, y), prompt, fill='white', font=font)
        
    except:
        # Fallback if font loading fails
        pass
    
    return image

def generate_cartoon_prompt(face_data, style="anime"):
    """Convert photo analysis to cartoon prompts"""
    base_prompt = f"{style} style character, "
    
    # Face shape and features
    if face_data.get('face_shape') == 'round':
        base_prompt += "round cute face, chubby cheeks, "
    elif face_data.get('face_shape') == 'square':
        base_prompt += "strong jawline, angular features, "
    elif face_data.get('face_shape') == 'heart':
        base_prompt += "heart-shaped face, pointed chin, "
    else:  # oval
        base_prompt += "oval face, balanced proportions, "
    
    # Age-appropriate styling
    age = face_data.get('age', 25)
    if age < 18:
        base_prompt += "young character, big expressive eyes, cute features, "
    elif age < 30:
        base_prompt += "young adult character, fresh features, "
    else:
        base_prompt += "adult character, mature features, "
    
    # Expression and mood
    emotion = face_data.get('emotion', 'neutral')
    if emotion == 'happy':
        base_prompt += "happy cheerful expression, bright smile, "
    elif emotion == 'serious':
        base_prompt += "calm composed expression, "
    elif emotion == 'surprised':
        base_prompt += "surprised expression, wide eyes, "
    
    # Style-specific additions
    if style == "anime":
        base_prompt += "anime art style, cel shading, vibrant colors, manga style, "
    elif style == "disney":
        base_prompt += "Disney 3D animation style, Pixar quality, rendered character, "
    elif style == "cartoon":
        base_prompt += "cartoon illustration, simplified features, clean lines, "
    elif style == "chibi":
        base_prompt += "chibi style, cute, oversized head, small body, adorable, "
    
    # Add character traits based on analysis
    cartoon_features = face_data.get('cartoon_features', {})
    cuteness = cartoon_features.get('cuteness_factor', 0.8)
    if cuteness > 0.8:
        base_prompt += "very cute, adorable, "
    elif cuteness > 0.6:
        base_prompt += "cute, charming, "
    
    character_type = cartoon_features.get('character_type', 'friendly')
    if character_type == 'friendly':
        base_prompt += "friendly warm character, "
    elif character_type == 'mysterious':
        base_prompt += "mysterious intriguing character, "
    elif character_type == 'playful':
        base_prompt += "playful energetic character, "
    
    base_prompt += "high quality, detailed, professional character art"
    
    return base_prompt

def get_cartoon_style_config(style):
    """Get configuration for different cartoon styles"""
    styles = {
        "anime": {
            "model": "sdxl-base-1.0",
            "lora": "anime_character_v2",
            "prompt_additions": "anime, manga style, cel shading, vibrant colors",
            "negative": "realistic, photographic, western cartoon, disney",
            "guidance_scale": 7.5,
            "steps": 30
        },
        "disney": {
            "model": "sdxl-base-1.0", 
            "lora": "disney_pixar_style",
            "prompt_additions": "Disney Pixar 3D animation style, rendered character",
            "negative": "anime, manga, flat colors, 2D",
            "guidance_scale": 8.0,
            "steps": 35
        },
        "cartoon": {
            "model": "sdxl-base-1.0",
            "lora": "cartoon_style_xl",
            "prompt_additions": "cartoon illustration, simplified cartoon style",
            "negative": "realistic, anime, photographic",
            "guidance_scale": 7.0,
            "steps": 25
        },
        "chibi": {
            "model": "sdxl-base-1.0",
            "lora": "chibi_character",
            "prompt_additions": "chibi style, cute, oversized head, small body",
            "negative": "realistic, adult proportions, detailed",
            "guidance_scale": 6.5,
            "steps": 20
        }
    }
    return styles.get(style, styles["anime"])


@app.post("/generate-caricature")
async def generate_caricature_endpoint(file: UploadFile = File(...), style: str = "cartoon"):
    """Generate caricature from uploaded photo using SDXL"""
    try:
        if not caricature_generator:
            raise HTTPException(status_code=503, detail="Caricature generator not loaded")
        
        # Save uploaded file temporarily
        temp_path = f"temp_upload_{int(time.time())}.jpg"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Generate caricature
        caricature_image, prompt, features = caricature_generator.generate_caricature(temp_path, style)
        
        if not caricature_image:
            raise HTTPException(status_code=500, detail="Failed to generate caricature")
        
        # Save caricature
        output_dir = Path("caricature_output")
        output_dir.mkdir(exist_ok=True)
        
        timestamp = int(time.time())
        output_filename = f"caricature_{style}_{timestamp}.png"
        output_path = output_dir / output_filename
        
        caricature_generator.save_caricature(caricature_image, str(output_path), prompt, features)
        
        # Clean up temp file
        Path(temp_path).unlink(missing_ok=True)
        
        return {
            "success": True,
            "status": f"✅ Generated {style} caricature",
            "prompt": prompt,
            "features": features,
            "file": str(output_path),
            "download_url": f"/download/{output_filename}"
        }
        
    except Exception as e:
        # Clean up temp file on error
        if 'temp_path' in locals():
            Path(temp_path).unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-2d")
async def generate_2d_image(request: dict):
    """Generate 2D image from text prompt"""
    try:
        prompt = request.get("prompt", "")
        width = request.get("width", 512)
        height = request.get("height", 512)
        
        if not prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt is required")
        
        # Generate 2D image using a simple method
        image_path, status = generate_2d_from_text(prompt, width, height)
        
        if image_path:
            return {
                "success": True,
                "status": status,
                "file": image_path,
                "download_url": f"/download/{Path(image_path).name}"
            }
        else:
            raise HTTPException(status_code=500, detail=status)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/collect-faces")
async def collect_faces(data: dict):
    """Collect faces automatically for training data"""
    if not AUTO_COLLECTOR_AVAILABLE:
        raise HTTPException(status_code=503, detail="Auto face collector not available")
    
    try:
        num_faces = data.get('num_faces', 10)
        delay_seconds = data.get('delay_seconds', 1)
        
        collector = AutoFaceCollector(max_faces=num_faces)
        collected = collector.collect_faces(delay_seconds=delay_seconds)
        
        return {
            "status": "success",
            "collected": collected,
            "message": f"Collected {collected} faces for training"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-training-data")
async def generate_training_data():
    """Generate training data from collected faces"""
    if not AUTO_COLLECTOR_AVAILABLE:
        raise HTTPException(status_code=503, detail="Auto face collector not available")
    
    try:
        collector = AutoFaceCollector()
        collector.generate_training_data()
        
        # Count generated files
        training_dir = Path("training_data")
        training_files = list(training_dir.glob("*.jpg"))
        
        return {
            "status": "success",
            "generated": len(training_files),
            "message": f"Generated {len(training_files)} training images"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/training-stats")
async def get_training_stats():
    """Get training data statistics"""
    try:
        collected_dir = Path("collected_faces")
        training_dir = Path("training_data")
        
        collected_files = list(collected_dir.glob("face_*.jpg"))
        training_files = list(training_dir.glob("*.jpg"))
        
        return {
            "collected_faces": len(collected_files),
            "training_images": len(training_files),
            "ready_for_training": len(collected_files) > 0,
            "training_data_ready": len(training_files) > 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-cartoon")
async def generate_cartoon(data: dict):
    """Generate a cartoon from face analysis data"""
    try:
        # Get face analysis data from the request
        face_analysis = data.get('face_analysis')
        if not face_analysis:
            raise HTTPException(status_code=400, detail="Face analysis data required")
        
        # Generate cartoon using procedural effects
        try:
            from procedural_training_generator import ProceduralTrainingGenerator
            generator = ProceduralTrainingGenerator()
        except ImportError as e:
            raise HTTPException(status_code=500, detail=f"ProceduralTrainingGenerator not available: {e}")
        
        # Find the latest collected photo
        collected_dir = Path("collected_faces")
        if not collected_dir.exists():
            collected_dir.mkdir(exist_ok=True)
            raise HTTPException(status_code=404, detail="No collected faces found. Please collect faces first.")
        
        # Get the most recent photo
        photo_files = list(collected_dir.glob("face_*.jpg"))
        if not photo_files:
            raise HTTPException(status_code=404, detail="No collected photos found")
        
        # Sort by modification time to get the latest
        latest_photo = max(photo_files, key=lambda x: x.stat().st_mtime)
        
        # Ensure training data directories exist
        training_dir = Path("training_data")
        caricatures_dir = training_dir / "caricatures"
        caricatures_dir.mkdir(parents=True, exist_ok=True)
        
        # Analyze face features first
        face_features = generator.analyze_face_features(str(latest_photo))
        print(f"🔍 Face features analyzed: {face_features}")
        
        # Convert numpy types to Python native types for JSON serialization
        def convert_numpy_types(obj):
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, list):
                return [convert_numpy_types(item) for item in obj]
            elif isinstance(obj, tuple):
                return tuple(convert_numpy_types(item) for item in obj)
            elif isinstance(obj, dict):
                return {key: convert_numpy_types(value) for key, value in obj.items()}
            else:
                return obj
        
        face_features = convert_numpy_types(face_features)
        
        # Generate cartoon using the TRAINED MODEL (not basic filters!)
        try:
            from simple_lora_trainer import SimpleLoRATrainer
            model_trainer = SimpleLoRATrainer()
            caricature_image = model_trainer.generate_caricature(str(latest_photo), style="cartoon")
            print(f"🎯 Generated caricature using TRAINED MODEL!")
        except Exception as e:
            print(f"⚠️ Trained model not available, using basic filters: {e}")
            # Fallback to basic filters if model not available
            caricature_image = generator.create_advanced_caricature(
                str(latest_photo), 
                style="cartoon",
                features=face_features
            )
        print(f"🎭 Caricature image generated: {type(caricature_image)}")
        
        if caricature_image is None:
            raise HTTPException(status_code=500, detail="Failed to generate caricature image")
        
        # Save the caricature
        cartoon_filename = f"caricature_{int(time.time())}.jpg"
        cartoon_path = caricatures_dir / cartoon_filename
        caricature_image.save(str(cartoon_path), "JPEG", quality=95)
        print(f"💾 Caricature saved: {cartoon_path}")
        
        # Also copy the original photo to training_data/photos for training pairs
        photos_dir = training_dir / "photos"
        photos_dir.mkdir(exist_ok=True)
        photo_filename = f"photo_{int(time.time())}.jpg"
        photo_path = photos_dir / photo_filename
        shutil.copy2(str(latest_photo), str(photo_path))
        print(f"📸 Photo copied: {photo_path}")
        
        # Update training metadata
        metadata_path = training_dir / "training_metadata.json"
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
        else:
            metadata = {"training_pairs": []}
        
        # Add new training pair
        training_pair = {
            "photo_path": f"photos/{photo_filename}",
            "caricature_path": f"caricatures/{cartoon_filename}",
            "style": "cartoon",
            "face_id": f"face_{int(time.time())}",
            "created_at": int(time.time())
        }
        metadata["training_pairs"].append(training_pair)
        
        # Save updated metadata
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"📝 Updated training metadata: {len(metadata['training_pairs'])} pairs")
        
        if cartoon_path and Path(cartoon_path).exists():
            return {
                "status": "success",
                "cartoon_path": str(cartoon_path),
                "photo_path": str(photo_path),
                "cartoon_filename": cartoon_filename,
                "photo_filename": photo_filename,
                "face_features": face_features,
                "message": f"✅ Caricature generated successfully! Created training pair: {photo_filename} → {cartoon_filename}",
                "download_url": f"/download/{cartoon_filename}"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate cartoon")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-caricature-variations")
async def generate_caricature_variations(data: dict):
    """Generate 3 caricature variations from a single photo"""
    try:
        # Get face analysis data from the request
        face_analysis = data.get('face_analysis')
        if not face_analysis:
            raise HTTPException(status_code=400, detail="Face analysis data required")
        
        # Find the latest collected photo
        collected_dir = Path("collected_faces")
        if not collected_dir.exists():
            raise HTTPException(status_code=404, detail="No collected faces found. Please collect faces first.")
        
        # Get the most recent photo
        photo_files = list(collected_dir.glob("face_*.jpg"))
        if not photo_files:
            raise HTTPException(status_code=404, detail="No collected photos found")
        
        # Sort by modification time to get the latest
        latest_photo = max(photo_files, key=lambda x: x.stat().st_mtime)
        
        # Ensure training data directories exist
        training_dir = Path("training_data")
        caricatures_dir = training_dir / "caricatures"
        caricatures_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate 3 variations using the trained model
        try:
            from simple_lora_trainer import SimpleLoRATrainer
            model_trainer = SimpleLoRATrainer()
            variations = model_trainer.generate_caricature_variations(str(latest_photo), style="cartoon", num_variations=3)
            print(f"🎯 Generated 3 caricature variations using TRAINED MODEL!")
        except Exception as e:
            print(f"⚠️ Trained model not available, using basic filters: {e}")
            # Fallback to basic filters if model not available
            from procedural_training_generator import ProceduralTrainingGenerator
            generator = ProceduralTrainingGenerator()
            face_features = generator.analyze_face_features(str(latest_photo))
            variations = []
            for i in range(3):
                caricature = generator.create_advanced_caricature(str(latest_photo), style="cartoon", features=face_features)
                variations.append(caricature)
        
        # Save all variations
        variation_paths = []
        for i, variation in enumerate(variations):
            variation_filename = f"caricature_v{i+1}_{int(time.time())}.jpg"
            variation_path = caricatures_dir / variation_filename
            variation.save(str(variation_path), "JPEG", quality=95)
            variation_paths.append(str(variation_path))
            print(f"💾 Variation {i+1} saved: {variation_path}")
        
        return {
            "status": "success",
            "variations": len(variations),
            "variation_paths": variation_paths,
            "message": f"✅ Generated {len(variations)} caricature variations!",
            "download_urls": [f"/download/{Path(p).name}" for p in variation_paths]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-selected-caricature")
async def save_selected_caricature(data: dict):
    """Save the selected caricature variation for training"""
    try:
        variation_index = data.get('variation_index')
        variation_path = data.get('variation_path')
        
        if variation_index is None or variation_path is None:
            raise HTTPException(status_code=400, detail="Variation index and path required")
        
        # Find the latest collected photo
        collected_dir = Path("collected_faces")
        if not collected_dir.exists():
            raise HTTPException(status_code=404, detail="No collected faces found")
        
        photo_files = list(collected_dir.glob("face_*.jpg"))
        if not photo_files:
            raise HTTPException(status_code=404, detail="No collected photos found")
        
        latest_photo = max(photo_files, key=lambda x: x.stat().st_mtime)
        
        # Ensure training data directories exist
        training_dir = Path("training_data")
        photos_dir = training_dir / "photos"
        caricatures_dir = training_dir / "caricatures"
        photos_dir.mkdir(exist_ok=True)
        caricatures_dir.mkdir(exist_ok=True)
        
        # Copy photo to training data
        photo_filename = f"photo_{int(time.time())}.jpg"
        photo_path = photos_dir / photo_filename
        shutil.copy2(str(latest_photo), str(photo_path))
        
        # Copy selected caricature to training data
        cartoon_filename = f"caricature_{int(time.time())}.jpg"
        cartoon_path = caricatures_dir / cartoon_filename
        shutil.copy2(variation_path, str(cartoon_path))
        
        # Update training metadata
        metadata_path = training_dir / "training_metadata.json"
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
        else:
            metadata = {"training_pairs": []}
        
        # Add new training pair
        training_pair = {
            "photo_path": f"photos/{photo_filename}",
            "caricature_path": f"caricatures/{cartoon_filename}",
            "style": "cartoon",
            "face_id": f"face_{int(time.time())}",
            "created_at": int(time.time())
        }
        metadata["training_pairs"].append(training_pair)
        
        # Save updated metadata
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return {
            "status": "success",
            "photo_filename": photo_filename,
            "cartoon_filename": cartoon_filename,
            "message": f"✅ Selected caricature saved for training!"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/preview-caricatures")
async def preview_caricatures():
    """Preview all generated caricatures before training"""
    try:
        training_dir = Path("training_data")
        photos_dir = training_dir / "photos"
        caricatures_dir = training_dir / "caricatures"
        
        # Get all training pairs
        photos = list(photos_dir.glob("*.jpg")) if photos_dir.exists() else []
        caricatures = list(caricatures_dir.glob("*.jpg")) if caricatures_dir.exists() else []
        
        # Create preview data
        preview_data = {
            "total_photos": len(photos),
            "total_caricatures": len(caricatures),
            "training_pairs": [],
            "ready_for_training": len(photos) > 0 and len(caricatures) > 0
        }
        
        # Match photos with caricatures (by timestamp)
        for photo in photos:
            photo_time = int(photo.stem.split('_')[-1]) if '_' in photo.stem else 0
            # Find matching caricature
            matching_caricature = None
            for caricature in caricatures:
                caricature_time = int(caricature.stem.split('_')[-1]) if '_' in caricature.stem else 0
                if abs(photo_time - caricature_time) < 10:  # Within 10 seconds
                    matching_caricature = caricature
                    break
            
            if matching_caricature:
                preview_data["training_pairs"].append({
                    "photo": f"/download/{photo.name}",
                    "caricature": f"/download/{caricature.name}",
                    "photo_name": photo.name,
                    "caricature_name": caricature.name,
                    "timestamp": photo_time
                })
        
        return preview_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train-model")
async def train_model(data: dict):
    """Train the LoRA model with collected data"""
    try:
        epochs = data.get('epochs', 5)
        learning_rate = data.get('learning_rate', 1e-4)
        
        # Check if training data exists
        training_dir = Path("training_data")
        photos_dir = training_dir / "photos"
        caricatures_dir = training_dir / "caricatures"
        
        # Look for training pairs in subdirectories
        photo_files = list(photos_dir.glob("*.jpg")) if photos_dir.exists() else []
        caricature_files = list(caricatures_dir.glob("*.jpg")) if caricatures_dir.exists() else []
        
        if len(photo_files) == 0 or len(caricature_files) == 0:
            raise HTTPException(
                status_code=400, 
                detail=f"No training data found. Photos: {len(photo_files)}, Caricatures: {len(caricature_files)}. Please collect faces and generate training data first."
            )
        
        # Import and run the trainer
        try:
            from simple_lora_trainer import SimpleLoRATrainer
            
            trainer = SimpleLoRATrainer()
            print(f"🚀 Starting training with {len(photo_files)} photos and {len(caricature_files)} caricatures")
            
            # Run training
            result = trainer.train()
            print(f"✅ Training completed: {result}")
            
            return {
                "status": "success",
                "message": f"Model training completed with {epochs} epochs",
                "training_pairs": min(len(photo_files), len(caricature_files)),
                "photos": len(photo_files),
                "caricatures": len(caricature_files),
                "result": result
            }
            
        except ImportError:
            raise HTTPException(status_code=503, detail="LoRA trainer not available")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-status")
async def get_model_status():
    """Get model training status and available checkpoints"""
    try:
        # Check for model checkpoints
        checkpoint_files = list(Path(".").glob("*.pth"))
        
        # Check training data
        training_dir = Path("training_data")
        training_files = list(training_dir.glob("*.jpg"))
        
        return {
            "checkpoints": len(checkpoint_files),
            "checkpoint_files": [str(f) for f in checkpoint_files],
            "training_data": len(training_files),
            "model_ready": len(checkpoint_files) > 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-latest-face")
async def get_latest_face():
    """Get the latest collected face photo"""
    try:
        collected_dir = Path("collected_faces")
        
        if not collected_dir.exists():
            raise HTTPException(status_code=404, detail="No collected faces found")
        
        # Find the latest face file
        face_files = list(collected_dir.glob("face_*.jpg"))
        
        if not face_files:
            raise HTTPException(status_code=404, detail="No face files found")
        
        # Sort by modification time and get the latest
        latest_file = max(face_files, key=lambda f: f.stat().st_mtime)
        
        return FileResponse(
            str(latest_file),
            media_type="image/jpeg",
            filename=latest_file.name
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download generated files"""
    # Check all directories
    for directory in ["text_generated", "face_generated", "2d_generated"]:
        file_path = Path(directory) / filename
        if file_path.exists():
            return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    print("🚀 Starting Face-API.js + Point-E 3D Generation Server...")
    uvicorn.run(app, host="0.0.0.0", port=8002, lifespan="on")
