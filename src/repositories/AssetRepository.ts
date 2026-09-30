import { IAsset } from '../models/IAsset';
import { SharePointService } from '../services/SharePointService';

export interface IAssetRepository {
  getAssets: () => Promise<IAsset[]>;
}

export class AssetRepository implements IAssetRepository {
  constructor(private readonly service: SharePointService = new SharePointService()) {}

  public async getAssets(): Promise<IAsset[]> {
    const items = await this.service.getListItems('Assets');
    return items as IAsset[];
  }
}
