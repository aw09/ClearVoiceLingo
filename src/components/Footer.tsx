import React from 'react'

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ClearVoiceLingo. All rights reserved.
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          Built with Web Speech API and IndexedDB
        </p>
      </div>
    </footer>
  )
}

export default Footer