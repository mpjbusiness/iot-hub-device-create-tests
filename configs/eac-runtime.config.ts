import {
  DefaultEaCConfig,
  defineEaCConfig,
  EaCRuntime,
} from '@fathym/eac/runtime';
import IoTHubDeviceCreateWebPlugin from '../src/plugins/IoTHubDeviceCreateRuntimePlugin.ts';

export const config = defineEaCConfig({
  Plugins: [
    ...(DefaultEaCConfig.Plugins || []),
    new IoTHubDeviceCreateWebPlugin(),
  ],
});

export function configure(_rt: EaCRuntime): Promise<void> {
  return Promise.resolve();
}
