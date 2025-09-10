# 🎮 Hunyuan3D-2 Setup Guide for HappyTracker

## 🚀 **Installation Steps**

### **1. Clone and Setup**
```bash
# Clone Hunyuan3D-2 repository
git clone https://github.com/Tencent-Hunyuan/Hunyuan3D-2.git
cd Hunyuan3D-2

# Install dependencies
pip install -r requirements.txt
pip install torch torchvision torchaudio
pip install diffusers transformers accelerate
pip install open3d trimesh flask flask-cors
```

### **2. Download Models**
```bash
# Download pre-trained models (this will take a while)
python download_models.py
```

### **3. Create API Server**
Create `server.py` in the Hunyuan3D-2 directory:

```python
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import base64
import io
import os
from hunyuan3d import Hunyuan3DGenerator

app = Flask(__name__)
CORS(app)

# Initialize Hunyuan3D-2 generator
generator = Hunyuan3DGenerator()

@app.route('/generate', methods=['POST'])
def generate_3d():
    try:
        data = request.json
        image_base64 = data['image']
        style = data.get('style', 'animal_crossing')
        quality = data.get('quality', 'high')
        format_type = data.get('format', 'glb')
        
        # Decode base64 image
        image_data = base64.b64decode(image_base64.split(',')[1])
        
        # Generate 3D model
        print(f"🎮 Generating 3D model with Hunyuan3D-2 (FREE!)")
        print(f"Style: {style}, Quality: {quality}, Format: {format_type}")
        
        # Call Hunyuan3D-2 generation
        result = generator.generate_3d(
            image_data=image_data,
            style=style,
            quality=quality,
            output_format=format_type
        )
        
        # Return GLB data
        return send_file(
            io.BytesIO(result),
            mimetype='model/gltf-binary',
            as_attachment=True,
            download_name='character.glb'
        )
        
    except Exception as e:
        print(f"❌ Error generating 3D model: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'Hunyuan3D-2 (FREE!)'})

if __name__ == '__main__':
    print("🚀 Starting Hunyuan3D-2 API server (FREE!)")
    print("📡 Server will be available at: http://localhost:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)
```

### **4. Run the Server**
```bash
# Start the API server
python server.py
```

### **5. Test Integration**
Your HappyTracker app will automatically try Hunyuan3D-2 first!

## 🎯 **Integration Benefits**

### **✅ Free Usage**
- **No API costs** - Completely free
- **No credit limits** - Generate unlimited characters
- **No subscriptions** - One-time setup

### **✅ High Quality**
- **Professional 3D models** - Enterprise-grade quality
- **Animal Crossing style** - Perfect for your vision
- **GLB format** - Web-compatible 3D models

### **✅ Full Control**
- **Local processing** - Your own server
- **Customizable** - Modify as needed
- **Private** - No data sent to external APIs

## 🔧 **Configuration**

### **Server Settings**
- **Port**: 8080 (configurable)
- **Host**: localhost (or your server IP)
- **CORS**: Enabled for web integration

### **Generation Options**
- **Style**: animal_crossing (perfect for your app)
- **Quality**: high (best results)
- **Format**: glb (web-compatible)

## 🚀 **Deployment Options**

### **Local Development**
```bash
python server.py
# Access at: http://localhost:8080
```

### **Cloud Deployment**
```bash
# Deploy to cloud (AWS, Google Cloud, etc.)
# Only pay for compute resources, not the model!
```

### **Docker Deployment**
```dockerfile
FROM python:3.9
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["python", "server.py"]
```

## 💡 **Next Steps**

1. **Install Hunyuan3D-2** - Follow the steps above
2. **Start the server** - Run `python server.py`
3. **Test your app** - Upload a photo and see the magic!
4. **Enjoy free 3D generation** - No more API costs!

## 🎉 **Result**

Once set up, your HappyTracker app will:
- ✅ **Try Hunyuan3D-2 first** - FREE 3D generation
- ✅ **Generate high-quality models** - Professional results
- ✅ **No API costs** - Completely free
- ✅ **Animal Crossing style** - Perfect aesthetic match

**Hunyuan3D-2 is the perfect solution for your free 3D character generation!** 🎮✨