import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Download, Trash2, Eye, Search, Filter, X, Copy, Sparkles, Image, FileText, BarChart3, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CharacterStorage } from '../services/characterStorage'

interface Character {
  id: string
  name: string
  age: number
  height: number
  weight: number
  gender: string
  caricatureImage: string
  generationCost?: number
  style?: string
  rpgClass?: {
    name: string
    description: string
    stats: {
      strength: number
      agility: number
      intelligence: number
      wisdom: number
      charisma: number
      constitution: number
      total: number
    }
  }
  photoAnalysis?: any
  aiGuesses?: any
  generationPrompt?: string
  processingTime?: number
  costBreakdown?: any
  createdAt: Date
  variants?: {
    [variantKey: string]: {
      imageUrl: string
      variantType: string
      clothingLevel: string
      prompt: string
      cost: number
      createdAt: Date
    }
  }
}

const CharacterGallery: React.FC = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<Character[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'prompts' | 'stats'>('overview')
  const [generatingVariant, setGeneratingVariant] = useState<string | null>(null)
  const [characterVariants, setCharacterVariants] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    loadCharacters()
    loadCharacterVariants()
    
    // Refresh characters when page becomes visible (e.g., returning from character creation)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCharacters()
        loadCharacterVariants()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    filterCharacters()
  }, [characters, searchTerm, selectedClass])

  const loadCharacters = () => {
    try {
      const savedCharacters = CharacterStorage.getAllCharacters()
      console.log('📚 Loaded characters from storage:', savedCharacters.length)
      setCharacters(savedCharacters)
      
      // Redirect to character creation if no characters exist
      if (savedCharacters.length === 0) {
        console.log('📚 No characters found, redirecting to character creation')
        navigate('/dynamic-character')
      }
    } catch (error) {
      console.error('❌ Error loading characters:', error)
    }
  }

  const loadCharacterVariants = () => {
    try {
      const variants: Record<string, Record<string, string>> = {}
      characters.forEach(character => {
        if (character.variants) {
          variants[character.id] = {}
          Object.entries(character.variants).forEach(([variantKey, variantData]: [string, any]) => {
            variants[character.id][variantKey] = variantData.imageUrl
          })
        }
      })
      setCharacterVariants(variants)
      console.log(`🎭 Loaded variants for ${Object.keys(variants).length} characters`)
    } catch (error) {
      console.error('❌ Error loading variants:', error)
    }
  }

  const filterCharacters = () => {
    let filtered = characters

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.rpgClass?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(char => char.rpgClass?.name === selectedClass)
    }

    setFilteredCharacters(filtered)
  }

  const deleteCharacter = (characterId: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        CharacterStorage.deleteCharacter(characterId)
        loadCharacters()
        console.log('🗑️ Character deleted:', characterId)
      } catch (error) {
        console.error('❌ Error deleting character:', error)
        alert('Failed to delete character')
      }
    }
  }

  const generateVariant = async (characterId: string, variantType: 'sleepy' | 'happy' | 'hungry' | 'excited' | 'confused' | 'angry' | 'surprised', clothingLevel: 'basic' | 'casual' | 'formal' | 'adventure' | 'magical' = 'casual') => {
    setGeneratingVariant(`${characterId}-${variantType}-${clothingLevel}`)
    
    try {
      const { CaricatureGenerator } = await import('../services/cartoonGenerator')
      const character = characters.find(c => c.id === characterId)
      
      if (!character) {
        throw new Error('Character not found')
      }
      
      // Create character data for variant generation
      const characterData = {
        characterPrompt: character.generationPrompt || '',
        ...character
      }
      
      const result = await CaricatureGenerator.generateCharacterVariant(characterData, variantType, clothingLevel)
      
      // Store the variant with clothing level
      const variantKey = `${variantType}-${clothingLevel}`
      const variantData = {
        imageUrl: result.imageUrl,
        variantType,
        clothingLevel,
        prompt: characterData.characterPrompt || '',
        cost: result.cost
      }
      
      // Save to persistent storage
      const { CharacterStorage } = await import('../services/characterStorage')
      CharacterStorage.saveCharacterVariant(characterId, variantKey, variantData)
      
      // Update local state
      setCharacterVariants(prev => ({
        ...prev,
        [characterId]: {
          ...prev[characterId],
          [variantKey]: result.imageUrl
        }
      }))
      
      console.log(`✅ ${variantType} variant with ${clothingLevel} clothing generated for ${character.name}`)
    } catch (error) {
      console.error(`❌ Error generating ${variantType} variant:`, error)
      alert(`Error generating ${variantType} variant. Please try again.`)
    } finally {
      setGeneratingVariant(null)
    }
  }

  const downloadCharacter = (character: Character) => {
    try {
      const link = document.createElement('a')
      link.href = character.caricatureImage
      link.download = `${character.name}-character.png`
      link.click()
      console.log('📥 Character downloaded:', character.name)
    } catch (error) {
      console.error('❌ Error downloading character:', error)
      alert('Failed to download character')
    }
  }

  const openCharacterDetail = (character: Character) => {
    setSelectedCharacter(character)
    setShowDetailModal(true)
    setActiveTab('overview')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getClassIcon = (className?: string) => {
    const icons: Record<string, string> = {
      'Warrior': '⚔️',
      'Mage': '🧙',
      'Rogue': '🗡️',
      'Cleric': '⛑️',
      'Ranger': '🏹',
      'Paladin': '🛡️'
    }
    return icons[className || ''] || '🎮'
  }

  const getClassColors = (className?: string) => {
    const colors: Record<string, string> = {
      'Warrior': 'from-red-500 to-orange-500',
      'Mage': 'from-blue-500 to-purple-500',
      'Rogue': 'from-green-500 to-teal-500',
      'Cleric': 'from-yellow-500 to-orange-500',
      'Ranger': 'from-emerald-500 to-green-500',
      'Paladin': 'from-purple-500 to-pink-500'
    }
    return colors[className || ''] || 'from-gray-500 to-gray-600'
  }

  const uniqueClasses = Array.from(new Set(characters.map(char => char.rpgClass?.name).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <button
              onClick={() => navigate('/dynamic-character')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create New Character
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Character Gallery</h1>
          <p className="text-xl text-gray-300">
            Your collection of AI-generated characters ({characters.length} total)
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Class Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="all">All Classes</option>
                  {uniqueClasses.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Characters Grid */}
        {filteredCharacters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Characters Found</h3>
            <p className="text-gray-300 mb-8">
              {searchTerm || selectedClass !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first character to get started!'
              }
            </p>
            <button
              onClick={() => navigate('/dynamic-character')}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Create Your First Character
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCharacters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
              >
                {/* Character Image */}
                <div className="aspect-square bg-white p-4">
                  <img
                    src={character.caricatureImage}
                    alt={character.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                {/* Character Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white truncate">{character.name}</h3>
                    <div className="text-2xl">{getClassIcon(character.rpgClass?.name)}</div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <div><strong>Age:</strong> {character.age}</div>
                    <div><strong>Height:</strong> {character.height}cm</div>
                    <div><strong>Weight:</strong> {character.weight}kg</div>
                    <div><strong>Class:</strong> {character.rpgClass?.name || 'Unknown'}</div>
                    
                    {/* Character Statistics */}
                    {character.variants && Object.keys(character.variants).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-gray-400">
                          <div><strong>Variants:</strong> {Object.keys(character.variants).length}</div>
                          <div><strong>Total Cost:</strong> ${Object.values(character.variants).reduce((sum: number, v: any) => sum + v.cost, 0).toFixed(3)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Class Badge */}
                  {character.rpgClass && (
                    <div className={`inline-block bg-gradient-to-r ${getClassColors(character.rpgClass.name)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-4`}>
                      {character.rpgClass.name}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCharacterDetail(character)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => downloadCharacter(character)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => deleteCharacter(character.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Character Variants */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white">Generate Variants:</h4>
                    
                    {/* Clothing Level Selection */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-gray-300">Clothing Style:</h5>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { key: 'basic', label: 'Basic', emoji: '👕' },
                          { key: 'casual', label: 'Casual', emoji: '👔' },
                          { key: 'formal', label: 'Formal', emoji: '👔' },
                          { key: 'adventure', label: 'Adventure', emoji: '🎒' },
                          { key: 'magical', label: 'Magical', emoji: '🧙' }
                        ].map(({ key, label, emoji }) => (
                          <button
                            key={key}
                            onClick={() => generateVariant(character.id, 'happy', key as any)}
                            disabled={generatingVariant?.includes(`${character.id}-happy-${key}`)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-gray-500/20 text-blue-300 disabled:text-gray-400 font-semibold py-1 px-1 rounded text-xs"
                          >
                            {generatingVariant?.includes(`${character.id}-happy-${key}`) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white mx-auto"></div>
                            ) : (
                              `${emoji} ${label}`
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Expression Variants */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-gray-300">Expressions:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {['happy', 'sleepy', 'hungry', 'excited'].map((variant) => (
                          <button
                            key={variant}
                            onClick={() => generateVariant(character.id, variant as any, 'casual')}
                            disabled={generatingVariant?.includes(`${character.id}-${variant}`)}
                            className="bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-300 disabled:text-gray-400 font-semibold py-2 px-2 rounded-lg transition-colors text-xs"
                          >
                            {generatingVariant?.includes(`${character.id}-${variant}`) ? (
                              <div className="flex items-center justify-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                <span>...</span>
                              </div>
                            ) : (
                              `😊 ${variant.charAt(0).toUpperCase() + variant.slice(1)}`
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Show generated variants */}
                    {characterVariants[character.id] && (
                      <div className="mt-3">
                        <h5 className="text-xs font-semibold text-gray-300 mb-2">Generated Variants:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(characterVariants[character.id]).map(([variantKey, imageUrl]) => {
                            const [variantType, clothingLevel] = variantKey.split('-')
                            return (
                              <div key={variantKey} className="relative">
                                <img
                                  src={imageUrl}
                                  alt={`${character.name} - ${variantType} - ${clothingLevel}`}
                                  className="w-full h-16 object-contain bg-white rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg">
                                  <div className="font-semibold">{variantType}</div>
                                  <div className="text-xs opacity-75">{clothingLevel}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Character Detail Modal */}
      {showModal && selectedCharacter && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedCharacter.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-2 text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Character Image */}
              <div className="w-full h-64 bg-white rounded-xl mb-6 p-4">
                <img
                  src={selectedCharacter.caricatureImage}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Character Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">Basic Info</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div><strong>Age:</strong> {selectedCharacter.age}</div>
                    <div><strong>Height:</strong> {selectedCharacter.height}cm</div>
                    <div><strong>Weight:</strong> {selectedCharacter.weight}kg</div>
                    <div><strong>Gender:</strong> {selectedCharacter.gender}</div>
                  </div>
                </div>

                {selectedCharacter.rpgClass && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">RPG Class</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div><strong>Class:</strong> {selectedCharacter.rpgClass.name}</div>
                      <div><strong>Description:</strong> {selectedCharacter.rpgClass.description}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              {selectedCharacter.rpgClass?.stats && (
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Character Stats</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedCharacter.rpgClass.stats).map(([stat, value]) => (
                      stat !== 'total' && (
                        <div key={stat} className="text-center">
                          <div className="text-lg font-bold text-white">{value}</div>
                          <div className="text-xs text-gray-400 capitalize">{stat}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Generation Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Generation Info</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  {selectedCharacter.generationCost && (
                    <div><strong>Cost:</strong> ${selectedCharacter.generationCost.toFixed(3)} USD</div>
                  )}
                  {selectedCharacter.processingTime && (
                    <div><strong>Processing Time:</strong> {selectedCharacter.processingTime}ms</div>
                  )}
                  <div><strong>Created:</strong> {new Date(selectedCharacter.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadCharacter(selectedCharacter)}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    deleteCharacter(selectedCharacter.id)
                  }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Character
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Character Detail Modal */}
      {showDetailModal && selectedCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden">
                    <img
                      src={selectedCharacter.caricatureImage}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCharacter.name}</h2>
                    <p className="text-gray-300">{selectedCharacter.rpgClass?.name || 'Unknown Class'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'variants', label: 'Variants', icon: Image },
                  { id: 'prompts', label: 'Prompts', icon: FileText },
                  { id: 'stats', label: 'Stats', icon: BarChart3 }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === id
                        ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Character Info</h3>
                        <div className="space-y-2 text-gray-300">
                          <div><strong>Age:</strong> {selectedCharacter.age}</div>
                          <div><strong>Height:</strong> {selectedCharacter.height}cm</div>
                          <div><strong>Weight:</strong> {selectedCharacter.weight}kg</div>
                          <div><strong>Gender:</strong> {selectedCharacter.gender}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">RPG Stats</h3>
                        {selectedCharacter.rpgClass?.stats ? (
                          <div className="space-y-2 text-gray-300">
                            <div><strong>Strength:</strong> {selectedCharacter.rpgClass.stats.strength}</div>
                            <div><strong>Agility:</strong> {selectedCharacter.rpgClass.stats.agility}</div>
                            <div><strong>Intelligence:</strong> {selectedCharacter.rpgClass.stats.intelligence}</div>
                            <div><strong>Wisdom:</strong> {selectedCharacter.rpgClass.stats.wisdom}</div>
                            <div><strong>Charisma:</strong> {selectedCharacter.rpgClass.stats.charisma}</div>
                            <div><strong>Constitution:</strong> {selectedCharacter.rpgClass.stats.constitution}</div>
                            <div className="pt-2 border-t border-white/10"><strong>Total:</strong> {selectedCharacter.rpgClass.stats.total}</div>
                          </div>
                        ) : (
                          <p className="text-gray-400">No stats available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => downloadCharacter(selectedCharacter)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Character
                      </button>
                      <button
                        onClick={() => deleteCharacter(selectedCharacter.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Character
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Character Variants</h3>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate New Variant
                      </button>
                    </div>
                    
                    {selectedCharacter.variants && Object.keys(selectedCharacter.variants).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedCharacter.variants).map(([variantKey, variantData]: [string, any]) => {
                          const [variantType, clothingLevel] = variantKey.split('-')
                          return (
                            <div key={variantKey} className="bg-white/5 rounded-xl p-4">
                              <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                                <img
                                  src={variantData.imageUrl}
                                  alt={`${selectedCharacter.name} - ${variantType}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-white capitalize">{variantType}</div>
                                <div className="text-xs text-gray-400 capitalize">{clothingLevel}</div>
                                <div className="text-xs text-gray-500 mt-1">${variantData.cost.toFixed(3)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No variants generated yet</p>
                        <button
                          onClick={() => setActiveTab('overview')}
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Generate Your First Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'prompts' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Generation Prompts</h3>
                    
                    {selectedCharacter.generationPrompt && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white">Original Character Prompt</h4>
                          <button
                            onClick={() => copyToClipboard(selectedCharacter.generationPrompt!)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-300 font-mono overflow-x-auto">
                          {selectedCharacter.generationPrompt}
                        </div>
                      </div>
                    )}
                    
                    {selectedCharacter.variants && Object.keys(selectedCharacter.variants).length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">Variant Prompts</h4>
                        {Object.entries(selectedCharacter.variants).map(([variantKey, variantData]: [string, any]) => {
                          const [variantType, clothingLevel] = variantKey.split('-')
                          return (
                            <div key={variantKey} className="bg-white/5 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-white capitalize">{variantType} - {clothingLevel}</h5>
                                <button
                                  onClick={() => copyToClipboard(variantData.prompt)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-300 font-mono overflow-x-auto">
                                {variantData.prompt}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Character Statistics</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-3">Generation Stats</h4>
                        <div className="space-y-2 text-gray-300">
                          <div><strong>Created:</strong> {new Date(selectedCharacter.createdAt).toLocaleDateString()}</div>
                          <div><strong>Generation Cost:</strong> ${selectedCharacter.generationCost?.toFixed(3) || '0.000'}</div>
                          <div><strong>Processing Time:</strong> {selectedCharacter.processingTime || 0}ms</div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-semibold text-white mb-3">Variant Stats</h4>
                        {selectedCharacter.variants && Object.keys(selectedCharacter.variants).length > 0 ? (
                          <div className="space-y-2 text-gray-300">
                            <div><strong>Total Variants:</strong> {Object.keys(selectedCharacter.variants).length}</div>
                            <div><strong>Total Variant Cost:</strong> ${Object.values(selectedCharacter.variants).reduce((sum: number, v: any) => sum + v.cost, 0).toFixed(3)}</div>
                            <div><strong>Total Investment:</strong> ${((selectedCharacter.generationCost || 0) + Object.values(selectedCharacter.variants).reduce((sum: number, v: any) => sum + v.cost, 0)).toFixed(3)}</div>
                          </div>
                        ) : (
                          <p className="text-gray-400">No variants generated</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CharacterGallery