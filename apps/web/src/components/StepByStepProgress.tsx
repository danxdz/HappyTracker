import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'completed'
  preview?: string
  data?: any
}

interface StepByStepProgressProps {
  steps: Step[]
  currentStep: string
  onStepComplete?: (stepId: string, data?: any) => void
}

export const StepByStepProgress: React.FC<StepByStepProgressProps> = ({
  steps,
  currentStep,
  onStepComplete
}) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${
            step.status === 'active'
              ? 'border-blue-500 bg-blue-50'
              : step.status === 'completed'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          {/* Step Icon */}
          <div className="flex-shrink-0">
            {step.status === 'completed' ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : step.status === 'active' ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${
              step.status === 'active' ? 'text-blue-700' : 
              step.status === 'completed' ? 'text-green-700' : 
              'text-gray-700'
            }`}>
              {step.title}
            </h3>
            <p className={`text-sm ${
              step.status === 'active' ? 'text-blue-600' : 
              step.status === 'completed' ? 'text-green-600' : 
              'text-gray-600'
            }`}>
              {step.description}
            </p>

            {/* Step Preview */}
            {step.preview && (
              <div className="mt-3">
                <img
                  src={step.preview}
                  alt={`${step.title} preview`}
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}

            {/* Step Data Display */}
            {step.data && step.status === 'completed' && (
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Analysis Results:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  {typeof step.data === 'object' ? (
                    Object.entries(step.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))
                  ) : (
                    <div>{String(step.data)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Predefined steps for photo-to-pop pipeline
export const PHOTO_TO_POP_STEPS: Omit<Step, 'status'>[] = [
  {
    id: 'photo-analysis',
    title: '📸 Photo Analysis',
    description: 'Analyzing your uploaded photo for facial features and characteristics'
  },
  {
    id: 'face-analysis',
    title: '🔍 AI Face Analysis',
    description: 'Using AI to detect emotions, age, and facial structure'
  },
  {
    id: 'character-preview',
    title: '👤 Character Preview',
    description: 'Creating personality traits and visual characteristics'
  },
  {
    id: 'tpose-generation',
    title: '🎭 T-Pose Generation',
    description: 'Generating 6 different T-pose views for 3D modeling'
  },
  {
    id: '3d-model',
    title: '🎨 3D Model Creation',
    description: 'Converting T-pose images into a 3D GLB model'
  },
  {
    id: 'final-pop',
    title: '✨ Final Pop Creation',
    description: 'Combining all elements into your unique pop character'
  }
]