import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Download, Eye, Calendar, DollarSign, User, Sword } from 'lucide-react'
import { CharacterStorage, SavedCharacter } from '../services/characterStorage'

const CharacterGallery: React.FC = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<SavedCharacter[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<SavedCharacter | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadCharacters()
  }, [])

  // Auto-redirect to character creation if no characters exist
  useEffect(() => {
    if (characters.length === 0) {
      const timer = setTimeout(() => {
        console.log('🔄 No characters found, redirecting to character creation...')
        navigate('/dynamic-character')
      }, 2000) // Wait 2 seconds to show the empty state message
      
      return () => clearTimeout(timer)
    }
  }, [characters.length, navigate])

  const loadCharacters = () => {
    const savedCharacters = CharacterStorage.getAllCharacters()
    setCharacters(savedCharacters)
  }

  const deleteCharacter = (id: string) => {
    if (CharacterStorage.deleteCharacter(id)) {
      loadCharacters()
      setShowDeleteConfirm(null)
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(null)
      }
    }
  }

  const clearAllCharacters = () => {
    if (window.confirm('Are you sure you want to delete ALL characters? This cannot be undone.')) {
      CharacterStorage.clearAllCharacters()
      loadCharacters()
      setSelectedCharacter(null)
    }
  }

  const downloadCharacter = (character: SavedCharacter) => {
    // Create a data URL for the caricature image
    const link = document.createElement('a')
    link.href = character.caricatureImage
    link.download = `${character.name}_caricature.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getGalleryStats = () => {
    const stats = CharacterStorage.getGalleryStats()
    return stats
  }

  const stats = getGalleryStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">🎨 Character Gallery</h1>
          </div>
          
          {characters.length > 0 && (
            <button
              onClick={clearAllCharacters}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Stats */}
        {characters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-300">Characters Created</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">${stats.totalCost.toFixed(2)}</div>
              <div className="text-gray-300">Total Spent</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.newestDate ? new Date(stats.newestDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-gray-300">Last Created</div>
            </div>
          </div>
        )}

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Characters Yet</h2>
            <p className="text-gray-300 mb-8">Create your first character to see it here!</p>
            <button
              onClick={() => window.location.href = '/dynamic-character'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Create Character
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedCharacter(character)}
              >
                {/* Character Image */}
                <div className="aspect-square bg-white rounded-t-xl overflow-hidden">
                  <img
                    src={character.caricatureImage}
                    alt={character.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Character Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2">{character.name}</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Age: {character.age}, {character.height}cm, {character.weight}kg
                    </div>
                    {character.rpgClass && (
                      <div className="flex items-center">
                        <Sword className="w-4 h-4 mr-2" />
                        Class: {character.rpgClass.name}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(character.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${character.generationCost?.toFixed(3) || '0.000'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedCharacter.name}</h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Photo */}
              {selectedCharacter.photo && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    📸 Original Photo
                  </h3>
                  <div className="bg-white rounded-xl p-4">
                    <img
                      src={selectedCharacter.photo}
                      alt="Original photo"
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Generated Cartoon */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  🎨 Generated Caricature
                </h3>
                <div className="bg-white rounded-xl p-4">
                  <img
                    src={selectedCharacter.caricatureImage}
                    alt="Generated caricature"
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Character Details */}
            <div className="mt-6 bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Character Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Name</div>
                  <div className="text-white font-semibold">{selectedCharacter.name}</div>
                </div>
                <div>
                  <div className="text-gray-400">Age</div>
                  <div className="text-white font-semibold">{selectedCharacter.age}</div>
                </div>
                <div>
                  <div className="text-gray-400">Height</div>
                  <div className="text-white font-semibold">{selectedCharacter.height}cm</div>
                </div>
                <div>
                  <div className="text-gray-400">Weight</div>
                  <div className="text-white font-semibold">{selectedCharacter.weight}kg</div>
                </div>
                <div>
                  <div className="text-gray-400">Gender</div>
                  <div className="text-white font-semibold capitalize">{selectedCharacter.gender}</div>
                </div>
                <div>
                  <div className="text-gray-400">Created</div>
                  <div className="text-white font-semibold">
                    {new Date(selectedCharacter.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Cost</div>
                  <div className="text-white font-semibold">
                    ${selectedCharacter.generationCost?.toFixed(3) || '0.000'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Style</div>
                  <div className="text-white font-semibold capitalize">{selectedCharacter.style}</div>
                </div>
              </div>
            </div>

            {/* RPG Class Information */}
            {selectedCharacter.rpgClass && (
              <div className="mt-6 bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Sword className="w-5 h-5 mr-2" />
                  RPG Class: {selectedCharacter.rpgClass.name}
                </h3>
                <p className="text-gray-300 mb-4">{selectedCharacter.rpgClass.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Strength</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.strength}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Agility</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.agility}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Intelligence</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.intelligence}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Wisdom</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.wisdom}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Charisma</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.charisma}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Constitution</div>
                    <div className="text-white font-bold text-lg">{selectedCharacter.rpgClass.stats.constitution}</div>
                  </div>
                </div>
                <div className="text-center mt-4 pt-4 border-t border-white/10">
                  <div className="text-gray-400 text-sm">Total Stats</div>
                  <div className="text-white font-bold text-xl">{selectedCharacter.rpgClass.stats.total}</div>
                </div>
              </div>
            )}

            {/* Photo Analysis */}
            {selectedCharacter.photoAnalysis && (
              <div className="mt-6 bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">🤖 AI Photo Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Detected Gender</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.gender}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Detected Age</div>
                    <div className="text-white font-semibold">{selectedCharacter.photoAnalysis.age}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Hair Color</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.hairColor}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Hair Style</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.hairStyle}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Skin Tone</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.skinTone}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Expression</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.expression}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Face Shape</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.faceShape}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Build</div>
                    <div className="text-white font-semibold capitalize">{selectedCharacter.photoAnalysis.build}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Glasses</div>
                    <div className="text-white font-semibold">{selectedCharacter.photoAnalysis.glasses ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Facial Hair</div>
                    <div className="text-white font-semibold">{selectedCharacter.photoAnalysis.facialHair ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Generation Prompt */}
            {selectedCharacter.generationPrompt && (
              <div className="mt-6 bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">📝 Generation Prompt</h3>
                <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-300 font-mono">
                  {selectedCharacter.generationPrompt}
                </div>
              </div>
            )}

            {/* Processing Info */}
            {(selectedCharacter.processingTime || selectedCharacter.costBreakdown) && (
              <div className="mt-6 bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">⚙️ Processing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedCharacter.processingTime && (
                    <div>
                      <div className="text-gray-400">Processing Time</div>
                      <div className="text-white font-semibold">{(selectedCharacter.processingTime / 1000).toFixed(2)}s</div>
                    </div>
                  )}
                  {selectedCharacter.costBreakdown && (
                    <>
                      <div>
                        <div className="text-gray-400">Image Analysis Cost</div>
                        <div className="text-white font-semibold">${selectedCharacter.costBreakdown.imageAnalysis.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Generation Cost</div>
                        <div className="text-white font-semibold">${selectedCharacter.costBreakdown.caricatureGeneration.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Total Cost</div>
                        <div className="text-white font-semibold">${selectedCharacter.costBreakdown.total.toFixed(3)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => downloadCharacter(selectedCharacter)}
                className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Cartoon
              </button>
              
              <button
                onClick={() => {
                  setShowDeleteConfirm(selectedCharacter.id)
                }}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 px-4 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Delete Character?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this character? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-500/20 border border-gray-500/30 text-gray-400 py-3 px-4 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCharacter(showDeleteConfirm)}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 px-4 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default CharacterGallery