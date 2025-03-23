export const antropicModels = [
  'claude-3-haiku-20240307',
]

export const deepseekModels = [
  'deepseek-chat',
  'deepseek-reasoning'
]

export const openaiModels = [
  'gpt-4',
  'gpt4o-copilot',
]

// Base interface with common properties
export interface BaseCredentials {
  apiKey: string;
  model: string;
}

// Provider-specific credential interfaces
export interface OpenAICredentials extends BaseCredentials {
  provider: 'openai';
}

export interface AzureCredentials extends BaseCredentials {
  provider: 'azure';
  azureInstanceName?: string; // Azure Instance Name
  azureEndpoint: string; // Azure OpenAI API Instance Name
  azureDeployment: string; // Azure OpenAI API Deployment Name
  azureApiVersion?: string; // Optional API version
}

export interface DeepseekCredentials extends BaseCredentials {
  provider: 'deepseek';
}

export interface AnthropicCredentials extends BaseCredentials {
  provider: 'anthropic';
}

// Union type for all credential types
export type Credentials = 
  | OpenAICredentials 
  | AzureCredentials 
  | DeepseekCredentials 
  | AnthropicCredentials;