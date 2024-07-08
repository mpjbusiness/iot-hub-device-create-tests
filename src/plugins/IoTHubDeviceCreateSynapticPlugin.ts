import { z } from 'npm:zod';
import {
  EaCRuntimeConfig,
  EaCRuntimePluginConfig,
  EaCRuntimePlugin,
  FathymEaCServicesPlugin,
  EaCRuntimeEaC,
} from '@fathym/eac/runtime';
import {
  EaCAzureOpenAILLMDetails,
  EaCChatPromptNeuron,
  EaCDenoKVChatHistoryDetails,
  EaCLLMNeuron,
  EaCLinearCircuitDetails,
  EaCMemorySaverPersistenceDetails,
  EaCNeuronLike,
  EaCTavilySearchResultsToolDetails,
  EverythingAsCodeSynaptic,
  FathymSynapticPlugin,
} from '@fathym/synaptic';
import { EaCDenoKVDatabaseDetails } from '@fathym/eac';
import { RunnableLambda } from 'npm:@langchain/core/runnables';
import { HumanMessage, MessagesPlaceholder } from '../../tests/test.deps.ts';
import { BaseMessage } from 'npm:@langchain/core/messages';

export default class IoTHubDeviceCreateSynapticPlugin
  implements EaCRuntimePlugin
{
  constructor() {}

  public Setup(
    config: EaCRuntimeConfig<EaCRuntimeEaC & EverythingAsCodeSynaptic>
  ): Promise<EaCRuntimePluginConfig> {
    const pluginConfig: EaCRuntimePluginConfig<
      EaCRuntimeEaC & EverythingAsCodeSynaptic
    > = {
      Name: 'IoTHubDeviceCreateSynapticPlugin',
      Plugins: [],
      EaC: {
        Circuits: {
          $neurons: {
            'thinky-llm': {
              Type: 'LLM',
              LLMLookup: `thinky|thinky`,
            } as EaCLLMNeuron as any,
          },
          chat: {
            Details: {
              Type: 'Linear',
              Priority: 100,
              // Name: 'Chat',
              // Description: 'Open, no memory chat',
              // InputSchema: z.object({
              //   Input: z.string().describe('The input for the chat'),
              // }),
              Neurons: {
                '': {
                  Type: 'ChatPrompt',
                  SystemMessage: 'You are a friendly pirate validation bot.',
                  NewMessages: [new MessagesPlaceholder('Messages')],
                  Neurons: {
                    '': 'thinky-llm',
                  },
                } as EaCChatPromptNeuron,
              },
              Bootstrap: (r) =>
                RunnableLambda.from((s: { Input: string }) => {
                  return {
                    Messages: [new HumanMessage(s.Input || 'Hi')],
                  };
                })
                  .pipe(r)
                  .pipe(
                    RunnableLambda.from((msg: BaseMessage) => {
                      return {
                        Messages: [msg],
                      };
                    })
                  ),
            } as EaCLinearCircuitDetails as any,
          },
        },
      },
    };

    return Promise.resolve(pluginConfig);
  }
}
