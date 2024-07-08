import {
  assert,
  assertStringIncludes,
  EverythingAsCodeDatabases,
  EverythingAsCodeSynaptic,
  HumanMessage,
  Runnable,
} from '../test.deps.ts';
import { buildTestIoC } from '../test-eac-setup.ts';
import IoTHubDeviceCreateRuntimePlugin from '../../src/plugins/IoTHubDeviceCreateRuntimePlugin.ts';

Deno.test('IoTHubDeviceCreateSynapticPlugin Circuits Tests', async (t) => {
  const eac = {} as EverythingAsCodeSynaptic & EverythingAsCodeDatabases;

  const { ioc, kvCleanup } = await buildTestIoC(eac, [
    new IoTHubDeviceCreateRuntimePlugin(),
  ]);

  await t.step('Chat', async (t) => {
    await t.step('Generic - Invoke', async () => {
      const circuit = await ioc.Resolve<Runnable>(
        ioc.Symbol('Circuit'),
        'chat'
      );

      const chunk = await circuit.invoke(
        {
          Input: 'Is the color red mean to mean sad?',
        },
        {
          //   configurable: {
          //     thread_id: 'testing',
          //   },
        }
      );

      assert(chunk?.content, JSON.stringify(chunk));

      console.log(chunk.content);

      //   assert(chunk.Messages.slice(-1)[0].content, JSON.stringify(chunk));

      //   console.log(chunk.Messages.slice(-1)[0].content);
    });
  });

  await kvCleanup();
});
