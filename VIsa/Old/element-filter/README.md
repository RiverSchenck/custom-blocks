# Element Filter Block

A Frontify custom content block that provides filtering functionality for Visa card elements by region and product. The block includes both user-facing filter UI and admin configuration interface.

## Features

- **Filter UI**: Dropdown selectors for region and product filtering
- **Admin Configuration**: Accordion interface for configuring element instances
- **Browser Storage Communication**: Uses localStorage to communicate filter state between blocks on the same page
- **Supabase Integration**: Stores element configurations and relationships in a Supabase database

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the migration script from `supabase/migrations/001_initial_schema.sql`
   - This will create the necessary tables and seed initial data
4. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Development

Run the development server:

```bash
npm run serve
```

### 5. Deployment

Deploy the block to Frontify:

```bash
npm run deploy
```

## Database Schema

The block uses the following Supabase tables:

- **regions**: Reference data for available regions
- **products**: Reference data for available products (Credit, Debit, Prepaid, Combination)
- **element_instances**: Stores element configurations (name, identifier, description, block_id, page_url)
- **element_region_products**: Junction table linking elements to applicable region/product combinations

## Usage

### Admin Mode (Edit Mode)

When editing a page in Frontify, the block displays an admin interface where you can:

1. Configure element details:
   - Element Name (e.g., "CVV")
   - Identifier (e.g., "cvv-element")
   - Description

2. Select applicable regions and products:
   - Expand region accordions
   - Check products within each region that this element applies to
   - Save the configuration

The configuration is automatically saved to Supabase with the current page URL and block ID.

### View Mode

When viewing a page, the block displays filter dropdowns:

- **Region Filter**: Select a region to filter by
- **Product Filter**: Select a product to filter by

Filter selections are stored in browser localStorage and broadcast to other blocks on the same page via custom events and storage events.

## Browser Storage

The block uses `localStorage` with the key `visa-element-filter` to store filter state:

```typescript
{
  region: string | null,
  product: string | null
}
```

Other blocks on the page can listen to filter changes by subscribing to storage events or the custom `visa-filter-changed` event.

## Block Settings

The block stores the following settings in Frontify:

- `element_name`: The configured element name
- `identifier`: The configured identifier
- `description`: The configured description

These are synced with the Supabase database when saved.

## Development Notes

- The block automatically detects edit/view mode using `appBridge.context('isEditing').get()`
- Block ID is retrieved using `appBridge.context('blockId').get()`
- Page URL is captured using `window.location.href`
- All API calls to Supabase are handled in `src/api.ts`
- Browser storage utilities are in `src/storage.ts`
