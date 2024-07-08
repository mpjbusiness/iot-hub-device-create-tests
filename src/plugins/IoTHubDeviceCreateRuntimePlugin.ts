import {
  EaCRuntimeConfig,
  EaCRuntimePluginConfig,
  EaCRuntimePlugin,
  FathymEaCServicesPlugin,
} from '@fathym/eac/runtime';
import {
  EaCAzureOpenAILLMDetails,
  EaCDenoKVChatHistoryDetails,
  EaCMemorySaverPersistenceDetails,
  EaCSynapticCircuitsProcessor,
  EaCTavilySearchResultsToolDetails,
  FathymSynapticPlugin,
} from '@fathym/synaptic';
import { EaCDenoKVDatabaseDetails } from '@fathym/eac';
import { IoCContainer } from '@fathym/ioc';
import IoTHubDeviceCreateSynapticPlugin from './IoTHubDeviceCreateSynapticPlugin.ts';
import { DefaultIoTHubDeviceCreateProcessorHandlerResolver } from './DefaultIoTHubDeviceCreateProcessorHandlerResolver.ts';

export default class IoTHubDeviceCreateRuntimePlugin
  implements EaCRuntimePlugin
{
  constructor() {}

  public Setup(config: EaCRuntimeConfig): Promise<EaCRuntimePluginConfig> {
    const pluginConfig: EaCRuntimePluginConfig = {
      Name: 'IoTHubDeviceCreateRuntimePlugin',
      Plugins: [
        new FathymEaCServicesPlugin(),
        new IoTHubDeviceCreateSynapticPlugin(),
        new FathymSynapticPlugin(),
      ],
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          thinky: {
            Details: {
              Name: 'IoTHubDeviceCreate',
              Description: 'IoTHubDeviceCreate',
              Priority: 100,
            },
            ResolverConfigs: {
              dev: {
                Hostname: 'localhost',
                Port: config?.Server?.port || 8000,
              },
            },
            ModifierResolvers: {},
            ApplicationResolvers: {
              circuits: {
                PathPattern: '/circuits*',
                Priority: 100,
                // IsPrivate: true,
              },
            },
          },
        },
        Applications: {
          circuits: {
            Details: {
              Name: 'Circuits',
              Description: 'The API for accessing circuits',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'SynapticCircuits',
              Includes: ['chat'],
            } as EaCSynapticCircuitsProcessor,
          },
        },
        Databases: {
          cache: {
            Details: {
              Type: 'DenoKV',
              Name: 'Local Cache',
              Description: 'The Deno KV database to use for local caching.',
              DenoKVPath: Deno.env.get('LOCAL_CACHE_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
          eac: {
            Details: {
              Type: 'DenoKV',
              Name: 'EaC',
              Description: 'The Deno KV database to use for EaC',
              DenoKVPath: Deno.env.get('EAC_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
          thinky: {
            Details: {
              Type: 'DenoKV',
              Name: 'Thinky',
              Description: 'The Deno KV database to use for thinky',
              DenoKVPath: Deno.env.get('THINKY_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
        },
        AIs: {
          thinky: {
            ChatHistories: {
              tester: {
                Details: {
                  Type: 'DenoKV',
                  Name: 'Thinky',
                  Description: 'The Thinky document indexer to use.',
                  DenoKVDatabaseLookup: 'thinky',
                  RootKey: ['Thinky', 'EaC', 'ChatHistory', 'Tester'],
                } as EaCDenoKVChatHistoryDetails,
              },
            },
            LLMs: {
              thinky: {
                Details: {
                  Type: 'AzureOpenAI',
                  Name: 'Azure OpenAI LLM',
                  Description: 'The LLM for interacting with Azure OpenAI.',
                  APIKey: Deno.env.get('AZURE_OPENAI_KEY')!,
                  Endpoint: Deno.env.get('AZURE_OPENAI_ENDPOINT')!,
                  DeploymentName: 'gpt-4o',
                  ModelName: 'gpt-4o',
                  Streaming: true,
                  Verbose: false,
                } as EaCAzureOpenAILLMDetails,
              },
              'thinky-tooled': {
                Details: {
                  Type: 'AzureOpenAI',
                  Name: 'Azure OpenAI LLM',
                  Description: 'The LLM for interacting with Azure OpenAI.',
                  APIKey: Deno.env.get('AZURE_OPENAI_KEY')!,
                  Endpoint: Deno.env.get('AZURE_OPENAI_ENDPOINT')!,
                  DeploymentName: 'gpt-4o',
                  ModelName: 'gpt-4o',
                  Streaming: true,
                  Verbose: false,
                  ToolLookups: ['thinky|tavily'],
                } as EaCAzureOpenAILLMDetails,
              },
            },
            Persistence: {
              memory: {
                Details: {
                  Type: 'MemorySaver',
                } as EaCMemorySaverPersistenceDetails,
              },
            },
            Tools: {
              tavily: {
                Details: {
                  Type: 'TavilySearchResults',
                  APIKey: Deno.env.get('TAVILY_API_KEY')!,
                } as EaCTavilySearchResultsToolDetails,
              },
            },
          },
        },
      },
    };

    pluginConfig.IoC!.Register(
      DefaultIoTHubDeviceCreateProcessorHandlerResolver,
      {
        Type: pluginConfig.IoC!.Symbol('ProcessorHandlerResolver'),
      }
    );

    return Promise.resolve(pluginConfig);
  }
}
