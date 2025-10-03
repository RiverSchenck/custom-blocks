import { useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Button, TextInput } from '@frontify/fondue-components';
import { FilterableMultiSelect } from '@frontify/fondue';
import { useEffect, useMemo, useState, type FC } from 'react';
import { AssetCard } from './AssetCard';
import type { Settings } from './settings';

const GRAPHQL_ENDPOINT = 'https://demo.frontify.com/graphql';
const BEARER_TOKEN = 'Q2ydJqV3zbDxV4YNbdJ26uSJLKhkTKoPvz34xBhz';
const LIBRARY_ID = 'eyJpZGVudGlmaWVyIjoxNDY0NiwidHlwZSI6InByb2plY3QifQ==';

const SEARCH_QUERY = `
query SearchAssetsInLibrary($id: ID!, $query: AssetQueryInput) {
  library(id: $id) {
    assets(query: $query, page: 1, limit: 100) {
      items {
        id
        __typename
        title
        ... on Image { previewUrl }
        ... on Video { previewUrl }
        ... on Document { previewUrl }
        ... on Audio { previewUrl }
        customMetadata {
          property { id name }
          ... on CustomMetadataValue { value }
        }
      }
    }
  }
}
`;

type CustomMetaRow = {
    property?: { id?: string; name?: string };
    // value can be a string or an array depending on metadata type
    value?: unknown;
  };

type AssetItem = {
id: string;
__typename: string;
title?: string | null;
previewUrl?: string | null;
customMetadata?: CustomMetaRow[] | null;
// derived:
skus?: string[];
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
  const [blockSettings] = useBlockSettings<Settings>(appBridge);
  const skuPropertyId = blockSettings?.skuPropertyId;
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [skuInput, setSkuInput] = useState('');
  const [skuList, setSkuList] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (skuList.length > 0 && skuPropertyId) {
      searchAssets();
    } else {
      setAssets([]);
      setSelectedIds(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skuList, skuPropertyId]);

  const extractSkus = (rows?: CustomMetaRow[] | null): string[] => {
    if (!rows || rows.length === 0) return [];
    const raw = rows
      .filter((r) => r?.property?.id === skuPropertyId)
      .flatMap((r) => {
        const v = (r as any).value;
        if (Array.isArray(v)) return v;                  // already array-like
        if (typeof v === 'string') return [v];           // single string
        return [];                                       // unsupported type
      });

    // Split strings that contain multiple SKUs and normalize
    const split = raw.flatMap((s) =>
      String(s)
        .split(/[\s,;|]+/) // spaces, commas, semicolons, pipes
        .map((x) => x.trim())
        .filter(Boolean)
    );

    return Array.from(new Set(split)); // de-dupe
  };

  const searchAssets = async () => {
    setLoading(true);
    setSelectedIds(new Set()); // reset selection on new fetch

    const orConditions = skuList.map((sku) => ({
      type: 'CUSTOM_METADATA_VALUE',
      customMetadataPropertyId: skuPropertyId,
      operator: 'IS',
      value: sku,
    }));

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: {
          id: LIBRARY_ID,
          query: {
            filter: { orConditions },
          },
        },
      }),
    });

    const json = await res.json();
    const itemsRaw: AssetItem[] = json?.data?.library?.assets?.items || [];

    // --- NEW: attach skus (and keep previewUrl as-is)
    const items: AssetItem[] = itemsRaw.map((a) => ({
      ...a,
      skus: extractSkus(a.customMetadata),
    }));

    setAssets(items);
    setLoading(false);
  };

  const allIds = useMemo(() => new Set(assets.map((a) => a.id)), [assets]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(allIds));
  const clearAll = () => setSelectedIds(new Set());

  // Optional: immediate CSV export (you can hide this until “later”)
  const exportCsv = () => {
    const selected = assets.filter((a) => selectedIds.has(a.id));
    const headers = ['id', 'title', 'type', 'previewUrl', 'skus'];
    const rows = selected.map((a) => [
      a.id,
      (a.title ?? '').replace(/"/g, '""'),
      a.__typename,
      (a.previewUrl ?? '').replace(/"/g, '""'),
      (a.skus ?? []).join('|').replace(/"/g, '""'),
    ]);
    const csv =
      [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assets_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

if (!skuPropertyId) {
    return (
      <div style={{ padding: 16 }}>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 16,
            background: '#fafafa',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Setup required</div>
          <div style={{ color: '#555', marginBottom: 8 }}>
            Open <strong>Block Settings</strong> and choose the metadata field that contains your SKUs.
          </div>
          <div style={{ color: '#777', fontSize: 12 }}>
            (This block won’t run searches until a field is selected.)
          </div>
        </div>
      </div>
    );
  }

  // --- Normal UI once configured
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      {/* SKU entry */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            type="text"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Enter SKUs (comma or space separated)…"
          />
        </div>
        <Button
          variant="loud"
          emphasis="default"
          onPress={() => {
            const parsed = skuInput
              .split(/[\s,]+/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
            setSkuList(Array.from(new Set([...skuList, ...parsed])));
            setSkuInput('');
          }}
        >
          Add SKUs
        </Button>
      </div>

      {/* Active SKUs filter chips */}
      {skuList.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <FilterableMultiSelect
            label="Filter SKUs"
            items={skuList.map((sku) => ({ value: sku }))}
            activeItemKeys={skuList}
            placeholder="Selected SKUs"
            onSelectionChange={(keys) => {
              const stringKeys = keys.filter((k): k is string => typeof k === 'string');
              setSkuList(stringKeys);
              if (skuPropertyId) searchAssets();
            }}
          />
        </div>
      )}

      {/* Selection toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onPress={selectAll}  disabled={assets.length === 0}>
            Select all ({assets.length})
          </Button>
          <Button onPress={clearAll} disabled={selectedIds.size === 0}>
            Clear
          </Button>
        </div>
        <div>
          <Button onPress={exportCsv} variant="loud" disabled={selectedIds.size === 0}>
            Export CSV ({selectedIds.size})
          </Button>
        </div>
      </div>

      {loading && <p>Loading…</p>}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            id={asset.id}
            title={asset.title ?? 'Untitled'}
            previewUrl={asset.previewUrl ?? undefined}
            selected={selectedIds.has(asset.id)}
            onToggle={() => toggleSelect(asset.id)}
            skus={asset.skus ?? []}
          />
        ))}
      </div>
    </div>
  );
};