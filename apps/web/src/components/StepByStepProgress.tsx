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

            {/* Character Criteria Display */}
            {step.id === 'character-criteria' && step.data && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Character Criteria:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-medium">Class:</span> {step.data.gameCriteria?.characterClass}</div>
                  <div><span className="font-medium">Health Potential:</span> {step.data.gameCriteria?.gameAttributes?.healthPotential}/100</div>
                  <div><span className="font-medium">Social Skills:</span> {step.data.gameCriteria?.gameAttributes?.socialSkills}/100</div>
                  <div><span className="font-medium">Learning Ability:</span> {step.data.gameCriteria?.gameAttributes?.learningAbility}/100</div>
                  <div className="col-span-2">
                    <span className="font-medium">Special Abilities:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {step.data.gameCriteria?.specialAbilities?.map((ability: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Character Model Display */}
            {step.id === '3d-character' && step.data && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">3D In-Game Character:</h4>
                
                {/* T-pose Views */}
                {step.data.tPoseViews && step.data.tPoseViews.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-600 mb-2">T-Pose Views:</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {step.data.tPoseViews.map((view: string, index: number) => (
                        <img
                          key={index}
                          src={view}
                          alt={`T-pose view ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 3D Model Info */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-gray-200 mx-auto flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎮</div>
                      <div className="text-xs text-gray-600">3D Model</div>
                      <div className="text-xs text-gray-500">{step.data.characterClass}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">✨ Your 3D character is ready for the game!</p>
                </div>
              </div>
            )}

            {/* Character Preview Display */}
            {step.id === 'character-preview' && step.data && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Character Preview:</h4>
                <div className="text-center">
                  <img
                    src={step.data}
                    alt="Your 3D character preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 mx-auto"
                  />
                  <p className="text-xs text-gray-600 mt-2">✨ Your character preview is ready!</p>
                </div>
              </div>
            )}

            {/* Character Preview */}
            {step.id === 'character-preview' && step.data && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Character Traits:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-medium">Face:</span> {step.data.faceShape}</div>
                  <div><span className="font-medium">Eyes:</span> {step.data.eyeColor}</div>
                  <div><span className="font-medium">Hair:</span> {step.data.hairColor}</div>
                  <div><span className="font-medium">Style:</span> {step.data.style}</div>
                  <div className="col-span-2">
                    <span className="font-medium">Personality:</span> 
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Energy:</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${step.data.personality?.energy || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Friendliness:</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${step.data.personality?.friendliness || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    id: 'face-analysis',
    title: '🔍 AI Face Analysis',
    description: 'Using AI to analyze your photo and detect facial features, emotions, and characteristics'
  },
  {
    id: 'character-criteria',
    title: '👤 Character Criteria',
    description: 'Creating personality traits, game attributes, and character class based on your photo analysis'
  },
  {
    id: '3d-character',
    title: '🎮 Creating 3D In-Game Character',
    description: 'Generating your unique 3D character model that will become your avatar in the game'
  },
  {
    id: 'character-preview',
    title: '🖼️ Character Preview',
    description: 'Creating a preview image of your new 3D character for the UI'
  }
]