import 'https://deno.land/std@0.220.1/dotenv/load.ts';
import { Registry as IoTRegistry } from 'npm:azure-iothub';

Deno.test('IoT Hub Device Create', async (t) => {
  const iotHubConnStr = Deno.env.get('IOT_HUB_CONN_STR')!;

  const iotRegistry = IoTRegistry.fromConnectionString(iotHubConnStr);

  await t.step('Add Device', async () => {
    const deviceLookup = crypto.randomUUID();

    const addDevicesResp = await iotRegistry.addDevices([
      {
        deviceId: deviceLookup,
        capabilities: {
          iotEdge: true,
        },
      },
    ]);
    
    try {
      await iotRegistry.get(deviceLookup);
    } catch (err) {
      console.error(err);

      if (err.name !== 'DeviceNotFoundError') {
        throw err;
      }
    }



    // console.log(addDevicesResp);
  });
});
