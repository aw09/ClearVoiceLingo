import React from 'react'

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
            <path d="M19.4 13C19.2669 13.6834 19.0224 14.3334 18.6872 14.9217C18.3519 15.5101 17.9308 16.0292 17.4413 16.4533C16.9517 16.8775 16.4012 17.2006 15.8159 17.4153C15.2306 17.6301 14.619 17.7329 14 17.7226C13.3866 17.7329 12.7779 17.6301 12.1953 17.4153C11.6126 17.2006 11.0644 16.8775 10.5764 16.4533C10.0884 16.0292 9.66825 15.5101 9.33251 14.9217C8.99678 14.3334 8.75235 13.6834 8.61914 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10.5V13.5C3 17.6421 6.35786 21 10.5 21H13.5C17.6421 21 21 17.6421 21 13.5V10.5C21 6.35786 17.6421 3 13.5 3H10.5C6.35786 3 3 6.35786 3 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="ml-2 text-xl font-bold text-gray-900">ClearVoiceLingo</h1>
        </div>
        <a 
          href="https://github.com/aw09/clearvoicelingo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </header>
  )
}

export default Header