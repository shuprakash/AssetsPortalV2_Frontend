# Migration Guide: Standalone Frontend to SPFx

This guide explains how to move the current dummy/frontend project into the original SPFx project.

| Item | Standalone Frontend | Original SPFx |
|---|---|---|
| Project path | `C:\Projects\AssetsPortalV2_Frontend` | `C:\Projects\AssetsPortalV2` |
| React | 17.0.1 | 17.0.1 |
| MUI | 5.15.14 | 5.15.14 |
| TypeScript | ~4.7.4 | ~4.7.4 |
| Local data | `db.json` / mock services | SharePoint lists through SPFI/PnPjs |
| Local server | Vite | SPFx Gulp workbench |

## Migration Principle

Copy the UI, models, helper logic, and current mock integration files into SPFx, then update the integration layer to use SPFI/PnPjs.

The standalone project is the visual and interaction source of truth. The SPFx project is the hosting and SharePoint integration source of truth.

## Copy Rules

Legend:

| Action | Meaning |
|---|---|
| Direct copy | Copy as-is unless SPFx build reveals an import path issue |
| Copy and adapt | Copy the file, then update SharePoint/SPFx-specific parts |
| Reference only | Copy only as a mapping/reference aid, not as runtime code |
| Do not copy | Keep the SPFx version |

## Files to Copy Directly

These files are pure frontend code and should move cleanly to `C:\Projects\AssetsPortalV2\src`.

| Frontend file/folder | SPFx destination | Action |
|---|---|---|
| `src/models/IAsset.ts` | `src/models/IAsset.ts` | Direct copy |
| `src/models/IDashboardMetrics.ts` | `src/models/IDashboardMetrics.ts` | Direct copy |
| `src/models/ISearchResult.ts` | `src/models/ISearchResult.ts` | Direct copy |
| `src/theme/etpTheme.ts` | `src/theme/etpTheme.ts` | Direct copy |
| `src/data/assetChampions.ts` | `src/data/assetChampions.ts` | Direct copy |
| `src/constants/dashboard.ts` | `src/constants/dashboard.ts` | Direct copy |
| `src/utils/formatters.ts` | `src/utils/formatters.ts` | Direct copy |
| `src/utils/assetHelpers.ts` | `src/utils/assetHelpers.ts` | Direct copy |
| `src/utils/assetSelectors.ts` | `src/utils/assetSelectors.ts` | Direct copy |
| `src/hooks/useDebounce.ts` | `src/hooks/useDebounce.ts` | Direct copy |
| `src/components/Assets/*` | `src/components/Assets/*` | Direct copy |
| `src/components/Backgrounds/*` | `src/components/Backgrounds/*` | Direct copy |
| `src/components/Cards/*` | `src/components/Cards/*` | Direct copy |
| `src/components/Inputs/*` | `src/components/Inputs/*` | Direct copy |
| `src/components/Layout/NavigationBar.tsx` | `src/components/Layout/NavigationBar.tsx` | Direct copy |
| `src/features/search/SearchPage.tsx` | `src/features/search/SearchPage.tsx` | Direct copy |
| `src/features/dashboard/HomeComponent.tsx` | `src/features/dashboard/HomeComponent.tsx` | Direct copy |
| `src/features/dashboard/AssetFilterComponent.tsx` | `src/features/dashboard/AssetFilterComponent.tsx` | Direct copy |
| `src/features/dashboard/AssetChampionCmp.tsx` | `src/features/dashboard/AssetChampionCmp.tsx` | Direct copy |
| `src/features/assetDetails/AssetDetails.tsx` | See Asset Details section | Direct copy or adapt to existing webpart |

## Files to Copy and Adapt

These files should be copied because they show the current expected frontend contract, but they must be updated to use SPFx/SPFI/PnPjs instead of JSON Server.

| Frontend file | SPFx destination | Action |
|---|---|---|
| `src/constants/config.ts` | `src/constants/config.ts` | Copy and remove or ignore `MOCK_API_BASE_URL` |
| `src/context/AppContext.tsx` | `src/context/AppContext.tsx` | Copy and adapt to expose SPFx `context` and `sp` |
| `src/services/SearchService.ts` | `src/services/SearchService.ts` | Copy and adapt to PnP/SPFI |
| `src/services/SharePointService.ts` | `src/services/SharePointService.ts` | Copy and adapt to PnP/SPFI |
| `src/hooks/useSearch.ts` | `src/hooks/useSearch.ts` | Copy and adapt to consume SPFx app context/SPFI |
| `src/repositories/AssetRepository.ts` | `src/repositories/AssetRepository.ts` | Copy and adapt if `SharePointService` constructor changes |
| `src/features/dashboard/Dashboard.tsx` | `src/features/dashboard/Dashboard.tsx` | Copy and adapt data wiring if needed |

## Reference-Only Files

| Frontend file | SPFx destination | Action |
|---|---|---|
| `db.json` | Recommended: `docs/reference/db.json` or project root | Reference only |

`db.json` should be copied because it documents the current dummy data shape and can guide field mapping to SharePoint list columns. It should not be used by the SPFx runtime.

## Files Not to Copy

These are Vite/local-app files and should not be migrated to SPFx.

| File | Reason |
|---|---|
| `package.json` | SPFx has its own package/dependency setup |
| `package-lock.json` | SPFx has its own lockfile |
| `tsconfig.json` | SPFx has its own TypeScript config |
| `vite.config.ts` | Vite-only |
| `vite-env.d.ts` | Vite-only |
| `index.html` | Vite-only entry point |
| `src/App.tsx` | Dummy app shell/page switcher |
| `src/index.tsx` | Vite entry point |
| `.vite-dev.*.log` | Local dev logs |
| `dist/` | Vite build output |
| `node_modules/` | Reinstall/resolve through SPFx project |

## SPFx Adaptation Notes

### 1. App Context

The frontend context is currently local/mock-oriented. In SPFx, update it to expose:

```ts
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';

export interface IAppContextValue {
  context: WebPartContext;
  sp: SPFI;
}
```

The SPFx webpart should create/provide `sp` and `context`; feature components should consume them through `useAppContext()`.

### 2. SharePoint Service

The frontend `SharePointService` currently reads from JSON Server. In SPFx, keep the service name and public methods where possible, but replace the implementation with SPFI/PnPjs.

Target shape:

```ts
import { SPFI } from '@pnp/sp';

export class SharePointService {
  constructor(private readonly sp: SPFI) {}

  public async getListItems(listTitle: string, select?: string[], top?: number): Promise<any[]> {
    let query = this.sp.web.lists.getByTitle(listTitle).items;

    if (select?.length) {
      query = query.select(...select);
    }

    if (top) {
      query = query.top(top);
    }

    return query();
  }
}
```

Adjust the exact PnP syntax to match the version installed in the SPFx project.

### 3. Search Service

Copy the frontend `SearchService.ts`, but replace `fetch()`/mock endpoints with SPFI list reads or SharePoint search APIs.

Keep the method signatures stable if possible, so `useSearch.ts` and `SearchPage.tsx` do not need UI changes.

### 4. Asset Repository

Current frontend repository:

```ts
const items = await this.service.getListItems('Assets');
return items as IAsset[];
```

In SPFx, this can stay nearly the same if `SharePointService` keeps `getListItems`. If SharePoint column names differ from `IAsset`, add a mapper here:

```ts
return items.map(mapSharePointItemToAsset);
```

This is the best place to decouple SharePoint column names from UI models.

### 5. Dashboard

The current `Dashboard.tsx` uses:

- `AssetRepository` for loading assets
- `assetSelectors.ts` for filtering/sorting
- `dashboard.ts` constants for limits

If `AssetRepository` needs `sp`, update `Dashboard` to read it from context:

```ts
const { sp } = useAppContext();
const assetRepository = React.useMemo(() => new AssetRepository(new SharePointService(sp)), [sp]);
```

Then use that repository inside the loading effect.

### 6. useSearch

Copy `useSearch.ts`, but update it to use the SPFx context:

```ts
const { sp } = useAppContext();
const service = React.useMemo(() => new SearchService(sp), [sp]);
```

Do not leave JSON Server URLs or `MOCK_API_BASE_URL` in the SPFx runtime path.

### 7. config.ts

Frontend:

```ts
MOCK_API_BASE_URL: 'http://localhost:3001'
```

SPFx:

Remove it if no longer referenced, or keep it only if clearly marked as local-only and unused by production services.

## Asset Details Placement

The frontend file exists at:

```text
src/features/assetDetails/AssetDetails.tsx
```

The original SPFx project may already have:

```text
src/webparts/assetDetails/components/AssetDetails.tsx
```

Recommended approach:

1. Keep the feature implementation in `src/features/assetDetails/AssetDetails.tsx`.
2. Let the SPFx webpart component wrap/render that feature component.
3. Pass SPFx-only props from the webpart wrapper, not from deep UI components.

This keeps the asset details UI reusable and avoids locking it to one webpart folder.

## Webpart Shell Files

Do not replace SPFx webpart shell files with frontend files. Keep these from the original SPFx project:

```text
src/webparts/assetsPortal/
src/webparts/dashboard/
src/webparts/assetDetails/
```

The webpart files should provide context, theme wrappers, and route into the migrated feature components.

## Recommended Migration Order

1. Copy `db.json` as reference-only data.
2. Copy models: `src/models/*`.
3. Copy theme: `src/theme/etpTheme.ts`.
4. Copy constants: `src/constants/*`, then remove or isolate `MOCK_API_BASE_URL`.
5. Copy utils: `src/utils/*`.
6. Copy data: `src/data/*`.
7. Copy reusable components: `src/components/*`.
8. Copy feature components: `src/features/*`.
9. Copy repositories: `src/repositories/*`.
10. Copy context/services/hooks and adapt them to SPFI/PnPjs.
11. Update SPFx webpart wrappers to provide `AppProvider`, theme, `sp`, and `context`.
12. Run the SPFx build.
13. Fix import paths and SPFx-specific type errors.
14. Validate with the copied `db.json` field mapping checklist.

## SharePoint Field Mapping Checklist

Use `db.json` to confirm every `IAsset` field has a SharePoint source or mapper fallback:

```text
id
title
description
category
portfolioKey
portfolioName
theme
assetType
badge
status
availability
rating
downloads
views
version
createdDate
modifiedDate
createdBy
owner
geography
tags
thumbnailUrl
heroImageUrl
dataResidency.required
dataResidency.location
capabilities
impact
files
videos
techStack
targetUsers
relatedAssetIds
```

If SharePoint stores arrays or nested objects as text, parse them in the repository or mapper, not inside UI components.

## Validation Checklist

After migration, verify:

- SPFx build succeeds.
- No runtime code calls `http://localhost:3001`.
- Search works against SharePoint data.
- Dashboard loads assets from SharePoint.
- Home page hero, shelves, and navigation work.
- Asset Champions page renders from `assetChampions.ts`.
- Asset Details opens from cards.
- Theme toggle still works if retained in SPFx.
- Navigation resets scroll position on menu changes.
- `db.json` is present only as a reference/mapping guide.

## Important Boundary

The UI should not know whether data came from JSON Server or SharePoint.

Preferred dependency direction:

```text
UI components
  -> feature components
  -> hooks/repositories
  -> services
  -> SPFI/PnPjs
```

Keep SharePoint column mapping in services/repositories, not inside components.
