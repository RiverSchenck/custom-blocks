# Using Shared Regions/Products Data in Other Blocks

The `element-filter` block automatically shares regions and products data with other blocks on the same page. This allows other blocks to access this data without making API calls.

## Quick Start

Import the utility functions in your block:

```typescript
import { getSharedRegionsProducts, subscribeToRegionsProducts } from './shared-data';
```

## Method 1: One-time Read

If you just need to read the data once when your component mounts:

```typescript
import { type FC, useEffect, useState } from 'react';
import { getSharedRegionsProducts, type SharedRegionsProducts } from './shared-data';

export const MyBlock: FC = () => {
    const [data, setData] = useState<SharedRegionsProducts | null>(null);

    useEffect(() => {
        const regionsProducts = getSharedRegionsProducts();
        setData(regionsProducts);
    }, []);

    if (!data) {
        return <div>Waiting for regions/products data...</div>;
    }

    return (
        <div>
            <h3>Available Regions: {data.regions.length}</h3>
            <h3>Available Products: {data.products.length}</h3>
            {/* Use data.regions and data.products */}
        </div>
    );
};
```

## Method 2: Subscribe to Updates (Recommended)

If you want to automatically receive updates when the data changes:

```typescript
import { type FC, useEffect, useState } from 'react';
import { subscribeToRegionsProducts, type SharedRegionsProducts } from './shared-data';

export const MyBlock: FC = () => {
    const [data, setData] = useState<SharedRegionsProducts | null>(null);

    useEffect(() => {
        // Subscribe to updates - returns cleanup function
        const cleanup = subscribeToRegionsProducts((regionsProducts) => {
            setData(regionsProducts);
        });

        // Cleanup subscription on unmount
        return cleanup;
    }, []);

    if (!data) {
        return <div>Waiting for regions/products data...</div>;
    }

    return (
        <div>
            <h3>Regions: {data.regions.map(r => r.name).join(', ')}</h3>
            <h3>Products: {data.products.map(p => p.name).join(', ')}</h3>
        </div>
    );
};
```

## Method 3: React Hook (Custom)

You can create a custom React hook for cleaner usage:

```typescript
import { useEffect, useState } from 'react';
import { subscribeToRegionsProducts, type SharedRegionsProducts } from './shared-data';

export const useSharedRegionsProducts = () => {
    const [data, setData] = useState<SharedRegionsProducts | null>(null);

    useEffect(() => {
        const cleanup = subscribeToRegionsProducts((regionsProducts) => {
            setData(regionsProducts);
        });
        return cleanup;
    }, []);

    return data;
};

// Usage in component:
export const MyBlock: FC = () => {
    const data = useSharedRegionsProducts();

    if (!data) {
        return <div>Loading...</div>;
    }

    // Use data.regions and data.products
};
```

## Data Structure

```typescript
type SharedRegionsProducts = {
    regions: Array<{
        id: string;
        name: string;
    }>;
    products: Array<{
        id: string;
        name: string;
        category: string; // 'Credit', 'Debit', 'Prepaid', or 'Combination'
    }>;
};
```

## Notes

- The data is shared via `localStorage` and custom events
- Data is automatically updated when the element-filter block saves or loads regions/products
- If no data is available yet, the functions return `null`
- The subscription method will call your callback immediately with current data (if available), then on every update
