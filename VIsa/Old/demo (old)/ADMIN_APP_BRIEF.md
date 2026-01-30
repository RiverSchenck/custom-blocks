# Visa Product Element Rule Model - Admin Application Brief

## Context

This is a separate admin/management application for the **Visa Product Element Rule Model** system. The Frontify block (in a different project) will be read-only for displaying rules. This admin app handles all CRUD operations and relationship management.

## Project Overview

The system models Visa product guidance where:
- **Products** (e.g., card types) are composed of reusable **Elements** (e.g., CVV, card number, logo placement)
- Each **Element** is governed by **Rules** that define how it should be used or presented
- **Rules** apply globally by default but may have **Rule Exceptions** that vary by region or product
- All evaluations occur within an explicit context of **Region** and **Product**

## Database Schema

The Supabase database is already set up with the following structure:

### Core Tables
- `regions` - Geographic/regulatory contexts
- `products` - Visa product offerings
- `elements` - Reusable components
- `rules` - Default guidance for elements (belongs to a specific element)
- `rule_exceptions` - Conditional replacements for rules

### Junction Tables
- `region_products` - Products valid in regions (empty = all regions)
- `product_elements` - Products composed of elements (many-to-many, elements can be shared)
- `element_regions` - Element applicability to regions (empty = global)
- `element_products` - Element applicability to products (empty = global)
- `rule_exception_regions` - Exception applicability to regions (empty = all regions)
- `rule_exception_products` - Exception applicability to products (empty = all products)

### Key Relationships
- **Rules belong to a specific element** (one-to-many: element → rules)
- **Elements can be shared across multiple products** (many-to-many via product_elements)
- **Rule exceptions belong to a specific rule** and can apply to specific regions/products

## Requirements

### Technology Stack
- **Frontend Framework**: React with TypeScript
- **UI Library**: Ant Design (antd)
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks (or Zustand if needed)
- **Styling**: Ant Design components + CSS as needed

### Supabase Connection
- **Project URL**: `https://vpohzqeehkwiwzmegaqn.supabase.co`
- **Anon Key**: Available in the main project's `.env` file
- **Database Types**: TypeScript types are generated in `types/database.types.ts` in the main project

### Application Structure

The admin app should have a **sidebar navigation** with the following pages:

#### 1. Regions Page
- List all regions in a table (name, identifier, description)
- Create/Edit/Delete regions
- Simple CRUD operations

#### 2. Products Page
- List all products in a table (name, identifier, element count, description)
- Create/Edit/Delete products
- **Manage Relationships**:
  - Link products to elements (which elements compose the product)
  - Link products to regions (which regions the product is valid in)
  - Show element count for each product

#### 3. Elements Page
- List all elements in a table (name, identifier, product count, description)
- Create/Edit/Delete elements
- **Manage Relationships**:
  - Link elements to regions (applicability)
  - Link elements to products (applicability)
  - Show which products use each element (read-only view)
  - Show product count for each element

#### 4. Rules Page
- List all rules in a table showing:
  - Rule name, identifier code, legacy rule ID
  - **Element name/identifier** (required - rules belong to elements)
  - Description preview
- Create/Edit/Delete rules
- **Element selection is required** when creating/editing rules
- **Manage Rule Exceptions**:
  - List exceptions for each rule
  - Create/Edit/Delete rule exceptions
  - Link exceptions to regions/products
  - Rule exceptions have their own description (rich text)

### Key Features

1. **Relationship Management**
   - Use Ant Design Select (multi-select) or Transfer components
   - Empty selections = global applicability (per business logic)
   - Clear UI indicators for relationship status

2. **Form Validation**
   - Required fields: name, identifier (unique, alphanumeric + underscores)
   - Element selection required for rules
   - Ant Design Form validation

3. **Data Display**
   - Ant Design Tables with pagination
   - Show relationship counts (e.g., "5 elements", "3 products")
   - Loading states and error handling
   - Success/error messages using Ant Design Message component

4. **UI/UX**
   - Sidebar navigation (Ant Design Layout + Menu)
   - Modal forms for create/edit
   - Confirmation dialogs for delete operations
   - Responsive design
   - Clean, professional interface

### File Structure Recommendation

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # Type helpers
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx
│   │   └── Sidebar.tsx
│   ├── Regions/
│   │   ├── RegionsPage.tsx
│   │   ├── RegionForm.tsx
│   │   └── RegionsTable.tsx
│   ├── Products/
│   │   ├── ProductsPage.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductsTable.tsx
│   │   └── ProductRelations.tsx
│   ├── Elements/
│   │   ├── ElementsPage.tsx
│   │   ├── ElementForm.tsx
│   │   ├── ElementsTable.tsx
│   │   └── ElementRelations.tsx
│   ├── Rules/
│   │   ├── RulesPage.tsx
│   │   ├── RuleForm.tsx
│   │   ├── RulesTable.tsx
│   │   └── RuleExceptions.tsx
│   └── shared/
│       ├── EntitySelector.tsx
│       └── RichTextEditor.tsx
├── hooks/
│   ├── useRegions.ts
│   ├── useProducts.ts
│   ├── useElements.ts
│   ├── useRules.ts
│   ├── useRuleExceptions.ts
│   └── useRelations.ts
└── App.tsx
```

### Important Business Rules

1. **Rules require an element**: Cannot create a rule without selecting an element
2. **Elements can be shared**: An element can be used in multiple products
3. **Empty relationships = global**: 
   - Empty region_products = product valid in all regions
   - Empty element_regions = element applicable to all regions
   - Empty rule_exception_regions = exception applies to all regions
4. **Rule exceptions replace rules**: When a rule exception matches (region + product), it completely replaces the base rule description

### Database Functions Available

The database includes helper functions:
- `evaluate_element_rules(region_id, product_id, element_id)` - Returns effective rules for evaluation
- `get_product_elements(region_id, product_id)` - Returns elements for a product
- Various validation functions

These are primarily for the read-only Frontify block, but may be useful for testing/validation in the admin app.

### Environment Setup

1. Create a new React + TypeScript project
2. Install dependencies:
   - `antd` - UI library
   - `@supabase/supabase-js` - Database client
   - `react`, `react-dom` - React framework
3. Set up environment variables:
   - `VITE_SUPABASE_URL` (or similar based on build tool)
   - `VITE_SUPABASE_ANON_KEY`
4. Copy/generate TypeScript types from the database schema

### Design Principles

- **Modular components**: Keep files focused and under 150 lines
- **Reusable hooks**: Data fetching and mutations in custom hooks
- **Consistent patterns**: Follow same structure for each entity type
- **User feedback**: Clear success/error messages
- **Loading states**: Show spinners during async operations
- **Confirmation dialogs**: Prevent accidental deletions

### Success Criteria

The admin app should allow users to:
1. ✅ Create, read, update, and delete all entity types
2. ✅ Manage all relationships between entities
3. ✅ See relationship counts and status
4. ✅ Understand which elements are shared across products
5. ✅ Create rules for specific elements
6. ✅ Manage rule exceptions with region/product targeting
7. ✅ Have a clear, intuitive interface for all operations

## Reference

The main project (Frontify block) has already implemented:
- Database schema and migrations
- TypeScript types
- Supabase client setup
- Component structure patterns (can be referenced but not copied directly)

Use this as a reference for patterns, but build the admin app as a standalone application.
