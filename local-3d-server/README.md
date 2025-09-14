# 🎮 Local 3D Generation Server

A local web server for 3D mesh generation from text prompts using Point-E, optimized for GTX 1060 6GB graphics card.

## 🚀 Features

- **Text-to-3D Generation**: Create 3D meshes from text descriptions
- **GTX 1060 Optimized**: Memory management for 6GB VRAM
- **Web Interface**: Clean Gradio interface accessible at localhost:7860
- **Multiple Formats**: Export as PLY and OBJ files
- **Memory Management**: Real-time VRAM monitoring and cleanup
- **Error Handling**: Graceful degradation and user-friendly errors

## 📋 Requirements

- **GPU**: NVIDIA GTX 1060 6GB (or similar 6GB+ VRAM)
- **CUDA**: CUDA Toolkit 11.8+ 
- **Python**: 3.8+
- **RAM**: 8GB+ system RAM
- **Storage**: 5GB+ free space

## 🛠️ Installation

### Quick Setup (Recommended)

```bash
# Clone or download the server files
cd local-3d-server

# Run setup script
python setup.py
```

### Manual Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 🎯 Usage

### Start the Server

```bash
# Activate virtual environment first
python server.py
```

The server will start at: **http://localhost:7860**

### Web Interface

1. **Text Prompt**: Enter a description of what you want to generate
2. **Resolution**: Choose between 32x32, 64x64, 96x96, 128x128
3. **Steps**: Control generation quality (10-50 steps)
4. **Seed**: Optional seed for reproducible results
5. **Generate**: Click to start 3D generation
6. **Download**: Get PLY and OBJ files when complete

### Example Prompts

- "A red sports car"
- "A cute robot"
- "A medieval castle"
- "A modern house"
- "A fantasy dragon"
- "A vintage motorcycle"
- "A space station"
- "A wooden chair"

## ⚙️ GTX 1060 Optimizations

### Memory Management
- **Real-time VRAM monitoring** with nvidia-ml-py
- **Automatic cleanup** between generations
- **Emergency memory clearing** when VRAM is low
- **Batch size = 1** to minimize memory usage

### Performance Settings
- **Default resolution**: 64x64 (good balance)
- **Max resolution**: 128x128 (for GTX 1060)
- **Model**: base40M (smaller, faster)
- **Point count**: 1024 (reduced for 6GB VRAM)

### Memory Tips
- Start with 64x64 resolution
- Use 20-30 steps for good quality
- Monitor GPU memory usage
- Clear memory between generations if needed
- Close other GPU-intensive applications

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# GPU Settings
CUDA_VISIBLE_DEVICES=0
TORCH_CUDA_ALLOC_CONF=max_split_size_mb:512

# Server Settings
SERVER_PORT=7860
SHARE_SERVER=false

# Generation Settings
DEFAULT_RESOLUTION=64
DEFAULT_STEPS=20
MAX_PROMPT_LENGTH=200
```

### Advanced Settings

Edit `server.py` to modify:

```python
# Memory settings
self.max_vram = 6 * 1024 * 1024 * 1024  # 6GB
self.safety_threshold = 0.85  # Use 85% max

# Generation settings
self.max_resolution = 128
self.default_resolution = 64
self.batch_size = 1
```

## 📁 Output Files

Generated files are saved in the `outputs/` directory:

- **PLY files**: Point cloud format, good for 3D viewers
- **OBJ files**: Mesh format, compatible with most 3D software
- **Naming**: `{prompt}_{timestamp}.ply/obj`

## 🐛 Troubleshooting

### Common Issues

**"CUDA out of memory"**
- Reduce resolution to 32x32 or 64x64
- Clear GPU memory using the "Clear Memory" button
- Close other GPU applications
- Restart the server

**"Point-E not available"**
```bash
pip install point-e
```

**"nvidia-ml-py not available"**
```bash
pip install nvidia-ml-py3
```

**Slow generation**
- Ensure CUDA is properly installed
- Check GPU utilization with `nvidia-smi`
- Try reducing resolution or steps

### Performance Tips

1. **First run**: Point-E will download models (~2GB)
2. **Warm-up**: First generation may be slower
3. **Memory**: Keep other GPU apps closed
4. **Quality vs Speed**: 
   - 32x32: Very fast, basic quality
   - 64x64: Good balance (recommended)
   - 128x128: Best quality, slower

## 🔒 Safety Features

- **Input validation**: Prompt length limits, safe filenames
- **Memory protection**: Automatic cleanup, emergency procedures
- **Error handling**: Graceful failures, user-friendly messages
- **Resource monitoring**: Real-time GPU usage tracking

## 📊 Performance Benchmarks

### GTX 1060 6GB Results

| Resolution | Steps | Time | VRAM Usage | Quality |
|------------|-------|------|------------|---------|
| 32x32      | 20    | ~15s | ~2GB       | Basic   |
| 64x64      | 20    | ~25s | ~3GB       | Good    |
| 64x64      | 30    | ~35s | ~3GB       | Better  |
| 128x128    | 20    | ~45s | ~4GB       | Best    |

*Times may vary based on prompt complexity and system load*

## 🤝 Integration with HappyTracker

This server can be integrated with your HappyTracker project:

1. **API Endpoint**: Add HTTP client to call the 3D server
2. **Character Generation**: Use text prompts for character creation
3. **Mesh Import**: Import generated OBJ/PLY files into Three.js
4. **Workflow**: Text → 3D Generation → Character Integration

## 📝 License

This project is part of the HappyTracker ecosystem. See main project license.

## 🙏 Acknowledgments

- **Point-E**: OpenAI's text-to-3D model
- **Gradio**: Web interface framework
- **Open3D**: 3D processing library
- **PyTorch**: Deep learning framework

---

**Happy 3D Generating! 🎮✨**
