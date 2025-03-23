import React, { useState, useEffect } from 'react'
import { getSetting, saveSetting } from '../utils/db'
import { configureApi } from '../utils/api'
import { openaiModels, antropicModels, deepseekModels } from '../models/credentials'

// Helper function to get default model for each provider
const getDefaultModelForProvider = (provider: string): string => {
  switch(provider) {
    case 'openai':
      return openaiModels[0] // Default to first model in the list
    case 'azure':
      return openaiModels[1]
    case 'deepseek':
      return deepseekModels[0]
    case 'anthropic':
      return antropicModels[0]
    default:
      return openaiModels[0]
  }
}

function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [azureInstanceName, setAzureInstanceName] = useState('')
  const [azureApiVersion, setAzureApiVersion] = useState('2023-05-15')
  const [azureApiBase, setAzureApiBase] = useState('')
  const [apiProvider, setApiProvider] = useState('openai')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedApiProvider = await getSetting('api_provider')
        const savedAzureInstanceName = await getSetting('azure_instance_name')
        const savedAzureApiVersion = await getSetting('azure_api_version')
        const savedAzureApiBase = await getSetting('azure_api_base')
        
        // Set provider first so we know which key to load
        if (savedApiProvider) setApiProvider(savedApiProvider)
        if (savedAzureInstanceName) setAzureInstanceName(savedAzureInstanceName)
        if (savedAzureApiVersion) setAzureApiVersion(savedAzureApiVersion)
        if (savedAzureApiBase) setAzureApiBase(savedAzureApiBase)
        
        // Load the API key based on the provider
        const provider = savedApiProvider || 'openai'
        const keyName = `${provider}_api_key`
        const savedApiKey = await getSetting(keyName)
        if (savedApiKey) setApiKey(savedApiKey)
      } catch (err) {
        setError('Failed to load settings. Please try again.')
        console.error('Error loading settings:', err)
      }
    }
    
    loadSettings()
  }, [])
  
  // Update API key when provider changes
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const keyName = `${apiProvider}_api_key`
        const savedApiKey = await getSetting(keyName)
        if (savedApiKey) setApiKey(savedApiKey)
        else setApiKey('') // Clear the key if none is found for this provider
      } catch (err) {
        console.error('Error loading API key for provider:', err)
      }
    }
    
    loadApiKey()
  }, [apiProvider])

  // Save settings
  const saveSettings = async (e :React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setError('')
    
    try {
      // Save API key for the current provider
      const keyName = `${apiProvider}_api_key`
      await saveSetting(keyName, apiKey)
      
      // Save other settings
      await saveSetting('azure_api_version', azureApiVersion)
      await saveSetting('azure_api_base', azureApiBase)
      await saveSetting('api_provider', apiProvider)
      
      // Configure API with the appropriate credentials based on provider
      try {
        const selectedModel = getDefaultModelForProvider(apiProvider)
        
        // Create base configuration with common properties
        const baseConfig = {
          provider: apiProvider,
          apiKey: apiKey,
          model: selectedModel
        }
        
        // Add provider-specific properties if needed
        if (apiProvider === 'azure') {
          configureApi({
            ...baseConfig,
            provider: 'azure',
            azureEndpoint: azureApiBase,
            azureDeployment: 'gpt4o-copilot', // Default deployment name
            azureApiVersion: azureApiVersion
          })
        } else {
          // For other providers, use the base configuration
          configureApi(baseConfig as any)
        }
      } catch (configErr) {
        console.error('Error configuring API:', configErr)
        // We still want to save settings even if API config fails
      }
      
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
          <label htmlFor="apiProvider" className="block text-sm font-medium text-gray-700 mb-1">API Provider</label>
          <select
            id="apiProvider"
            className="input w-full"
            value={apiProvider}
            onChange={(e) => setApiProvider(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="azure">Azure OpenAI</option>
            <option value="deepseek">Deepseek</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">{apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API Key</label>
          <input
            type="password"
            id="apiKey"
            className="input w-full"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Enter your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key`}
          />
          <p className="mt-1 text-xs text-gray-500">Your API key will be stored securely in your browser.</p>
        </div>
        
        {apiProvider === 'azure' && (
          <>
            <div className="mb-4">
              <label htmlFor="azureApiBase" className="block text-sm font-medium text-gray-700 mb-1">Azure API Base URL</label>
              <input
                type="text"
                id="azureApiBase"
                className="input w-full"
                value={azureApiBase}
                onChange={(e) => setAzureApiBase(e.target.value)}
                placeholder="e.g., https://your-resource.openai.azure.com"
              />
            </div>
            {/* azureInstanceName */}
            <div className="mb-4">
              <label htmlFor="azureInstanceName" className="block text-sm font-medium text-gray-700 mb-1">Azure Instance Name</label>
              <input
                type="text"
                id="azureInstanceName"
                className="input w-full"
                value={azureInstanceName}
                onChange={(e) => setAzureInstanceName(e.target.value)}
                placeholder="e.g., your-resource"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="azureApiVersion" className="block text-sm font-medium text-gray-700 mb-1">Azure API Version</label>
              <input
                type="text"
                id="azureApiVersion"
                className="input w-full"
                value={azureApiVersion}
                onChange={(e) => setAzureApiVersion(e.target.value)}
                placeholder="e.g., 2023-05-15"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings