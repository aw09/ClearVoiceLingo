import React, { useState, useEffect } from 'react'
import { getSetting, saveSetting } from '../utils/db'

function Settings() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [azureKey, setAzureKey] = useState('')
  const [azureRegion, setAzureRegion] = useState('')
  const [apiProvider, setApiProvider] = useState('openai')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedOpenaiKey = await getSetting('openai_api_key')
        const savedAzureKey = await getSetting('azure_api_key')
        const savedAzureRegion = await getSetting('azure_region')
        const savedApiProvider = await getSetting('api_provider')
        
        if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey)
        if (savedAzureKey) setAzureKey(savedAzureKey)
        if (savedAzureRegion) setAzureRegion(savedAzureRegion)
        if (savedApiProvider) setApiProvider(savedApiProvider)
      } catch (err) {
        setError('Failed to load settings. Please try again.')
        console.error('Error loading settings:', err)
      }
    }
    
    loadSettings()
  }, [])

  // Save settings
  const saveSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setError('')
    
    try {
      // Save API keys and settings
      await saveSetting('openai_api_key', openaiKey)
      await saveSetting('azure_api_key', azureKey)
      await saveSetting('azure_region', azureRegion)
      await saveSetting('api_provider', apiProvider)
      
      setSaveSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Failed to save settings. Please try again.')
      console.error('Error saving settings:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">API Settings</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>Settings saved successfully!</p>
        </div>
      )}
      
      <form onSubmit={saveSettings}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">API Provider</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-primary-600"
                value="openai"
                checked={apiProvider === 'openai'}
                onChange={() => setApiProvider('openai')}
              />
              <span className="ml-2">OpenAI</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-primary-600"
                value="azure"
                checked={apiProvider === 'azure'}
                onChange={() => setApiProvider('azure')}
              />
              <span className="ml-2">Azure OpenAI</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="openaiKey" className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
          <input
            type="password"
            id="openaiKey"
            className="input w-full"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
          />
          <p className="mt-1 text-xs text-gray-500">Your OpenAI API key will be stored securely in your browser.</p>
        </div>
        
        <div className={`mb-4 ${apiProvider === 'azure' ? 'opacity-100' : 'opacity-50'}`}>
          <label htmlFor="azureKey" className="block text-sm font-medium text-gray-700 mb-1">Azure OpenAI API Key</label>
          <input
            type="password"
            id="azureKey"
            className="input w-full"
            value={azureKey}
            onChange={(e) => setAzureKey(e.target.value)}
            placeholder="Enter your Azure OpenAI API key"
            disabled={apiProvider !== 'azure'}
          />
        </div>
        
        <div className={`mb-6 ${apiProvider === 'azure' ? 'opacity-100' : 'opacity-50'}`}>
          <label htmlFor="azureRegion" className="block text-sm font-medium text-gray-700 mb-1">Azure Region</label>
          <input
            type="text"
            id="azureRegion"
            className="input w-full"
            value={azureRegion}
            onChange={(e) => setAzureRegion(e.target.value)}
            placeholder="e.g., eastus"
            disabled={apiProvider !== 'azure'}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings