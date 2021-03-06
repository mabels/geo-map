import { createWindow } from './create-window';
import { createGoogleMock } from './create-google-mock';
import * as Constants from './constants';
import { ensureElement } from './ensure-element';
import { GeoMapGoogle } from '../geo-map-google';
import * as Result from '../result';
import * as Types from '../types';

export async function createGoogleMapImplementation(opts?: {
  config?: Partial<Types.LoadGoogleMapConfig>;
  mount?: Types.GeoMapMountInit;
  mock?: boolean;
}): Promise<Types.TestImplementation<GeoMapGoogle>> {
  try {
    const window = createWindow();

    const map = new GeoMapGoogle({
      config: {
        provider: Types.GeoMapProvider.Google,
        auth: {
          apiKey: Constants.GOOGLE_MAP_API,
          clientId: Constants.GOOGLE_MAP_CLIENT_ID,
          channel: Constants.GOOGLE_MAP_CHANNEL
        },
        language: opts && opts.config ? opts.config.language : undefined,
        viewport: opts && opts.config ? opts.config.viewport : undefined
      },
      context: {
        window,
        load:
          !opts || opts.mock !== false
            ? async () => ({ result: Result.createSuccess(createGoogleMock()) })
            : undefined,
        loaded: async () => {
          /** */
        }
      }
    });

    const el = ensureElement(Types.GeoMapProvider.Here, { window });

    await map.load();
    await map.mount(el, {
      center: Constants.S2_HAM,
      ...((opts && opts.mount) || {})
    });

    return {
      window,
      el,
      map
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
