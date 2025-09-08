import React from 'react'
import { GalaxySystem } from '../components/GalaxySystem'

export const GalaxyPage: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Full Screen Immersive Galaxy Experience */}
      <GalaxySystem />
    </div>
  )
}