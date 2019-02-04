import { Service, Inject } from 'typedi';
import { DataStorage } from '../storage';
import { SYNC_PARAM_KEY } from '../annotation/sync';

@Service('LocalstorageService')
export class LocalstorageService {
  @Inject('DataStorage')
  public dataStorage: DataStorage;

  constructor() {
    if (global.IS_BROWSER) {
      window.addEventListener('storage', e => {
        const value = JSON.parse(e.newValue);
        const key: string = e.key.replace(SYNC_PARAM_KEY, '');
        const data: any = this.dataStorage;

        if (data[key] && data[key] !== value) {
          data[key] = value;
        }
      });
    }
  }
}
