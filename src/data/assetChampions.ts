export type ChampionRegion = 'india' | 'australia' | 'middle-east' | 'japan' | 'china' | 'united-kingdom' | 'global';
export type ChampionRegionFilter = 'all' | ChampionRegion;

export interface IChampionFlag {
  background: string;
  color?: string;
  label?: string;
}

export interface IChampionRegion {
  flag: IChampionFlag;
  key: ChampionRegion;
  label: string;
}

export interface IAssetChampion {
  assetCount: number;
  initials: string;
  name: string;
  portfolios: string[];
  region: ChampionRegion;
  role: string;
  since: number;
}

export const championRegions: IChampionRegion[] = [
  {
    key: 'india',
    label: 'India',
    flag: { background: 'linear-gradient(180deg, #ff9933 0 33%, #fff 33% 66%, #138808 66%)' },
  },
  {
    key: 'australia',
    label: 'Australia',
    flag: { background: '#153b8a', label: '*', color: '#fff' },
  },
  {
    key: 'middle-east',
    label: 'Middle East',
    flag: { background: 'linear-gradient(180deg, #00843d 0 33%, #fff 33% 66%, #000 66%)' },
  },
  {
    key: 'japan',
    label: 'Japan',
    flag: { background: 'radial-gradient(circle, #bc002d 0 31%, #fff 33%)' },
  },
  {
    key: 'china',
    label: 'China',
    flag: { background: '#de2910', label: '*', color: '#ffde00' },
  },
  {
    key: 'united-kingdom',
    label: 'United Kingdom',
    flag: { background: '#012169', label: '+', color: '#fff' },
  },
  {
    key: 'global',
    label: 'Global',
    flag: { background: '#0b8fab', label: '@', color: '#fff' },
  },
];

export const championRegionByKey = championRegions.reduce<Record<ChampionRegion, IChampionRegion>>((acc, region) => {
  acc[region.key] = region;
  return acc;
}, {} as Record<ChampionRegion, IChampionRegion>);

export const championRegionFilters: Array<{ key: ChampionRegionFilter; label: string; region?: IChampionRegion }> = [
  { key: 'all', label: 'All regions' },
  ...championRegions.map((region) => ({ key: region.key, label: region.label, region })),
];

export const assetChampions: IAssetChampion[] = [
  {
    initials: 'PY',
    name: 'Patil, Yatin',
    role: 'ET&P Asset Champion',
    region: 'india',
    portfolios: ['DEC', 'SAP', 'Oracle'],
    assetCount: 28,
    since: 2023,
  },
  {
    initials: 'KA',
    name: 'Kumar, Ashis',
    role: 'Asset Lead - Digital Core',
    region: 'india',
    portfolios: ['DEC', 'Tech Strategy'],
    assetCount: 6,
    since: 2023,
  },
  {
    initials: 'JL',
    name: 'Jaganathan, Lakshminivashini',
    role: 'AI Lead',
    region: 'india',
    portfolios: ['SAP', 'Emerging Tech'],
    assetCount: 14,
    since: 2024,
  },
  {
    initials: 'SV',
    name: 'Shetty, Vipin',
    role: 'SAP Asset Champion',
    region: 'australia',
    portfolios: ['SAP'],
    assetCount: 12,
    since: 2023,
  },
  {
    initials: 'PS',
    name: 'Poojaru, Sandeep',
    role: 'SAP AI Lead',
    region: 'australia',
    portfolios: ['SAP', 'Emerging Tech'],
    assetCount: 14,
    since: 2024,
  },
  {
    initials: 'SK',
    name: 'Saurav, Kumar',
    role: 'Oracle Asset Champion',
    region: 'middle-east',
    portfolios: ['Oracle'],
    assetCount: 12,
    since: 2022,
  },
  {
    initials: 'GA',
    name: 'Garate, Ashlesh',
    role: 'Oracle AI Lead',
    region: 'middle-east',
    portfolios: ['Oracle', 'Supply Chain & Ops'],
    assetCount: 20,
    since: 2024,
  },
  {
    initials: 'KR',
    name: 'Kapoor, Rashmi',
    role: 'Finance Asset Champion',
    region: 'japan',
    portfolios: ['Finance'],
    assetCount: 3,
    since: 2023,
  },
  {
    initials: 'CP',
    name: 'Chaturvedi, Pallav',
    role: 'Finance AI Lead',
    region: 'japan',
    portfolios: ['Finance', 'Tech Strategy'],
    assetCount: 5,
    since: 2024,
  },
  {
    initials: 'LW',
    name: 'Wei, Lin',
    role: 'Computer Use Champion',
    region: 'china',
    portfolios: ['SAP', 'Process Automation'],
    assetCount: 9,
    since: 2024,
  },
  {
    initials: 'MZ',
    name: 'Zhang, Mei',
    role: 'Data Management Lead',
    region: 'china',
    portfolios: ['Data Management'],
    assetCount: 7,
    since: 2023,
  },
  {
    initials: 'HM',
    name: 'Morgan, Harriet',
    role: 'UK Asset Champion',
    region: 'united-kingdom',
    portfolios: ['Compliance & Risk', 'Process Automation'],
    assetCount: 11,
    since: 2023,
  },
  {
    initials: 'RG',
    name: 'Global, Rohan',
    role: 'Global Asset Network Lead',
    region: 'global',
    portfolios: ['Tech Strategy', 'Emerging Tech'],
    assetCount: 18,
    since: 2022,
  },
];

export const getChampionRegionCount = (
  region: ChampionRegionFilter,
  champions: IAssetChampion[] = assetChampions,
): number => (
  region === 'all'
    ? champions.length
    : champions.filter((champion) => champion.region === region).length
);
