import { AzureChatOpenAI, ChatOpenAI } from '@langchain/openai';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatAnthropic } from '@langchain/anthropic';
import { SupportedLanguageCode, SupportedLanguages } from '../models/languages';
import { Credentials, OpenAICredentials, AzureCredentials, DeepseekCredentials, AnthropicCredentials } from '../models/credentials';

let currentConfig: Credentials | null = null;

const getApiInstance = () => {
  if (!currentConfig) {
    throw new Error('API not configured');
  }

  switch (currentConfig.provider) {
    case 'azure':
      const azureConfig = currentConfig as AzureCredentials;
      return new AzureChatOpenAI({
        azureOpenAIApiKey: azureConfig.apiKey,
        azureOpenAIApiInstanceName: azureConfig.azureEndpoint,
        azureOpenAIApiDeploymentName: azureConfig.azureDeployment,
        azureOpenAIApiVersion: azureConfig.azureApiVersion,
        modelName: azureConfig.model
      });
    
    case 'deepseek':
      const deepseekConfig = currentConfig as DeepseekCredentials;
      return new ChatDeepSeek({
        apiKey: deepseekConfig.apiKey,
        modelName: deepseekConfig.model
      });
    
    case 'anthropic':
      const anthropicConfig = currentConfig as AnthropicCredentials;
      return new ChatAnthropic({
        anthropicApiKey: anthropicConfig.apiKey,
        modelName: anthropicConfig.model
      });
    
    case 'openai':
    default:
      const openaiConfig = currentConfig as OpenAICredentials;
      return new ChatOpenAI({
        openAIApiKey: openaiConfig.apiKey,
        modelName: openaiConfig.model
      });
  }
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
) => {
  const api = getApiInstance();
  const sourceLangName = SupportedLanguages.find((lang) => lang.code === sourceLang)?.name;
  const targetLangName = SupportedLanguages.find((lang) => lang.code === targetLang)?.name;
  try {
    const aiMsg = await api.invoke([
      {
        role: "system",
        content: `Translate from ${sourceLangName} to ${targetLangName}`,
      },
      {
        role: "user",
        content: text,
      },
    ]);
    aiMsg;

    return {
      targetText: aiMsg.content,
    } as { targetText: string };
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};