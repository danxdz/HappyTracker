/**
 * 📸 Photo Upload Component
 * 
 * Clean, simple photo upload for cartoon generation
 */

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, X, Check } from 'lucide-react'

export interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void
  onPhotoRemove: () => void
  selectedFile?: File | null
  isProcessing?: boolean
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelect,
  onPhotoRemove,
  selectedFile,
  isProcessing = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    onPhotoSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removePhoto = () => {
    onPhotoRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        /* Upload Area */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${isProcessing ? 'pointer-events-none opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <motion.div
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
            className="mx-auto mb-4 w-16 h-16 flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </motion.div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isProcessing ? 'Processing...' : 'Upload Your Photo'}
          </h3>
          
          <p className="text-gray-500 mb-4">
            {isProcessing 
              ? 'Creating your cartoon character...' 
              : 'Drag & drop or click to select'
            }
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-1" />
              JPG, PNG
            </div>
            <div>•</div>
            <div>Max 10MB</div>
          </div>

          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-2xl flex items-center justify-center"
            >
              <div className="text-blue-600 font-semibold">Drop your photo here</div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Selected Photo Preview */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected photo"
              className="w-full h-64 object-cover"
            />
            
            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={removePhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Processing overlay */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <div className="text-sm">Creating cartoon...</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* File info */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedFile.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}