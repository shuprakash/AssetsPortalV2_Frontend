export interface IAsset {
  id: number;
  title: string;
  description: string;
  category: string;
  portfolioKey: string;
  portfolioName: string;
  theme: string;
  assetType: string;
  badge?: 'agentic' | 'genai';
  status: string;
  availability: string;
  rating: number;
  downloads: number;
  views: number;
  version: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  owner: string;
  geography: string[];
  tags: string[];
  thumbnailUrl: string;
  heroImageUrl: string;
  dataResidency: {
    required: boolean;
    location?: string;
  };
  capabilities: string[];
  impact: IAssetImpact[];
  files: IAssetFile[];
  videos: IAssetVideo[];
  techStack: string;
  targetUsers: string;
  relatedAssetIds: number[];
}

export interface IAssetFile {
  id: string;
  name: string;
  type: string;
  size: string;
  iconType: 'zip' | 'file' | 'video' | 'deck' | 'sheet';
}

export interface IAssetVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
  posterUrl: string;
}

export interface IAssetImpact {
  value: string;
  label: string;
}
