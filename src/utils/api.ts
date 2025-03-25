import { AzureChatOpenAI, ChatOpenAI } from '@langchain/openai';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatAnthropic } from '@langchain/anthropic';
import { SupportedLanguageCode, SupportedLanguages, LanguageResponse, LanguageResponseSchema } from '../models/languages';
import { Credentials, OpenAICredentials, AzureCredentials, DeepseekCredentials, AnthropicCredentials } from '../models/credentials';

let currentConfig: Credentials | null = null;

const getApiInstance = () => {
  if (!currentConfig) {
    throw new Error('API not configured');
  }

  let baseModel;
  switch (currentConfig.provider) {
    case 'azure':
      const azureConfig = currentConfig as AzureCredentials;
      baseModel = new AzureChatOpenAI({
        azureOpenAIApiKey: azureConfig.apiKey,
        azureOpenAIApiInstanceName: azureConfig.azureInstanceName,
        azureOpenAIEndpoint: azureConfig.azureEndpoint,
        azureOpenAIApiDeploymentName: azureConfig.azureDeployment,
        azureOpenAIApiVersion: azureConfig.azureApiVersion,
        modelName: azureConfig.model
      });
    
    case 'deepseek':
      const deepseekConfig = currentConfig as DeepseekCredentials;
      baseModel = new ChatDeepSeek({
        apiKey: deepseekConfig.apiKey,
        modelName: deepseekConfig.model
      });
    
    case 'anthropic':
      const anthropicConfig = currentConfig as AnthropicCredentials;
      baseModel = new ChatAnthropic({
        anthropicApiKey: anthropicConfig.apiKey,
        modelName: anthropicConfig.model
      });
    
    case 'openai':
    default:
      const openaiConfig = currentConfig as OpenAICredentials;
      baseModel = new ChatOpenAI({
        openAIApiKey: openaiConfig.apiKey,
        modelName: openaiConfig.model
      });
  }
  return baseModel.withStructuredOutput(LanguageResponseSchema);
};

export const isApiConfigured = () => {
  return currentConfig !== null;
};

export const configureApi = (config: Credentials) => {
  currentConfig = config;
};

export const generateLanguagePair = async (
  text: string,
  sourceLang: SupportedLanguageCode,
  targetLang: SupportedLanguageCode
): Promise<Array<LanguageResponse>> => {
  const api = getApiInstance();
  const sourceLangName = SupportedLanguages.find((lang) => lang.code === sourceLang)?.name;
  const targetLangName = SupportedLanguages.find((lang) => lang.code === targetLang)?.name;
  
  try {
    const response = await api.invoke([
      {
        role: "system",
        content: `You are a language learning assistant specializing in translations between ${sourceLangName} and ${targetLangName}. `
      },
      {
        role: "user",
        content: text
      }
    ]);
    
    return response.result;
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};