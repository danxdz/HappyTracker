#!/usr/bin/env python3
"""
Setup script for Local 3D Generation Server
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"📦 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False

def check_cuda():
    """Check if CUDA is available"""
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ CUDA available: {torch.cuda.get_device_name(0)}")
            return True
        else:
            print("⚠️  CUDA not available. Install CUDA toolkit for GPU acceleration.")
            return False
    except ImportError:
        print("⚠️  PyTorch not installed yet.")
        return False

def main():
    """Main setup function"""
    print("🎮 Local 3D Generation Server Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Create virtual environment (optional)
    venv_path = Path("venv")
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        if not run_command(f"{sys.executable} -m venv venv", "Virtual environment creation"):
            return
        
        # Activate virtual environment
        if os.name == 'nt':  # Windows
            activate_script = venv_path / "Scripts" / "activate.bat"
            pip_command = str(venv_path / "Scripts" / "pip")
        else:  # Unix/Linux/MacOS
            activate_script = venv_path / "bin" / "activate"
            pip_command = str(venv_path / "bin" / "pip")
        
        print("📦 Installing dependencies...")
        if not run_command(f"{pip_command} install --upgrade pip", "Pip upgrade"):
            return
        
        if not run_command(f"{pip_command} install -r requirements.txt", "Dependencies installation"):
            return
    else:
        print("✅ Virtual environment already exists")
        pip_command = "pip"
    
    # Check CUDA
    check_cuda()
    
    # Create outputs directory
    outputs_dir = Path("outputs")
    outputs_dir.mkdir(exist_ok=True)
    print("✅ Created outputs directory")
    
    print("\n🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Run the server:")
    print("   python server.py")
    print("3. Open browser to: http://localhost:7860")
    
    print("\n💡 Tips for GTX 1060 6GB:")
    print("- Start with resolution 64x64")
    print("- Use 20-30 steps for good quality")
    print("- Monitor GPU memory usage")
    print("- Clear memory between generations if needed")

if __name__ == "__main__":
    main()
