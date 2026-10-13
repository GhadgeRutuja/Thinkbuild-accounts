# ThinkBuild Accounts - Design System Specification

## 1. Design Philosophy

ThinkBuild Accounts is engineered for enterprise financial clarity, speed, and cognitive calm. Accounting and financial operations require intense focus, rapid verification of figures, and zero visual friction.

- **Simple & Minimalist**: Every element serves an operational purpose. If a border, icon, or label does not assist in reading or entering financial data, it is eliminated.
- **Calm & Restrained**: Visual noise is drastically reduced. We avoid loud backgrounds, saturated banners, or distracting embellishments.
- **Lots of Whitespace**: High information density is balanced by deliberate whitespace, creating distinct visual hierarchies and effortless scanning.
- **Content First**: Numbers, ledger codes, transaction details, and statuses take absolute priority over decorative interface elements.
- **Light Mode Only**: The interface is strictly optimized for high-contrast, daytime enterprise accounting environments. Dark mode is intentionally omitted to preserve precise tabular readability and print/export consistency.

---

## 2. Colour Palette

The palette is restrained, professional, and accessible. Neutral slate tones provide structure, while blue accents indicate interaction. Semantic colors are strictly reserved for state indicators and financial deltas.

| Token Name | Hex Code | Swatch | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/14/FFFFFF/FFFFFF.png) | Base modal, card, and popover background |
| **App Canvas** | `#F8FAFC` | ![#F8FAFC](https://via.placeholder.com/14/F8FAFC/F8FAFC.png) | Overall application backdrop behind cards and tables |
| **Surface** | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/14/FFFFFF/FFFFFF.png) | Table surfaces, input containers, panels |
| **Border** | `#E5E7EB` | ![#E5E7EB](https://via.placeholder.com/14/E5E7EB/E5E7EB.png) | Standard 1px divider for table cells, sidebars, cards |
| **Text Primary** | `#111827` | ![#111827](https://via.placeholder.com/14/111827/111827.png) | Headings, primary numeric values, table text, input text |
| **Text Muted** | `#6B7280` | ![#6B7280](https://via.placeholder.com/14/6B7280/6B7280.png) | Secondary labels, table column headers, helper text, timestamps |
| **Accent** | `#2563EB` | ![#2563EB](https://via.placeholder.com/14/2563EB/2563EB.png) | Primary interactive buttons, links, active tab underlines |
| **Accent Hover** | `#1D4ED8` | ![#1D4ED8](https://via.placeholder.com/14/1D4ED8/1D4ED8.png) | Hover state for accent buttons and links |
| **Accent Tint** | `#EFF4FF` | ![#EFF4FF](https://via.placeholder.com/14/EFF4FF/EFF4FF.png) | Active sidebar selection background, selected row highlight |
| **Success** | `#15803D` | ![#15803D](https://via.placeholder.com/14/15803D/15803D.png) | Balanced entries, credit balances, paid invoices, approved status |
| **Warning** | `#B45309` | ![#B45309](https://via.placeholder.com/14/B45309/B45309.png) | Pending approvals, draft vouchers, non-critical reconciliations |
| **Danger** | `#B91C1C` | ![#B91C1C](https://via.placeholder.com/14/B91C1C/B91C1C.png) | Debit balances, ledger discrepancies, rejected items, error alerts |

---

## 3. Typography

- **Primary Typeface**: `Inter`, with a robust system font fallback (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`).
- **Tabular Figures Requirement**: All monetary figures, ledger codes, dates, quantities, and balances **must** utilize tabular figures (`font-variant-numeric: tabular-nums;`) to guarantee identical character widths and precise vertical column alignment.

### Type Scale

| Size Token | Font Size | Line Height | Weight | Typical Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-28` | 28px (`1.75rem`) | 36px | 600 (Semi-bold) | Page titles, primary KPI summary figures |
| `text-20` | 20px (`1.25rem`) | 28px | 600 (Semi-bold) | Section headers, modal sheet headers |
| `text-16` | 16px (`1.00rem`) | 24px | 500 / 600 | Card titles, prominent form group headings |
| `text-14` | 14px (`0.875rem`)| 20px | 400 / 500 | Default body text, primary table cells, form inputs, buttons |
| `text-13` | 13px (`0.8125rem`)| 18px | 400 / 500 | Sidebar menu items, dropdown options, sub-row entries |
| `text-12` | 12px (`0.75rem`) | 16px | 500 / 600 | Table column headers (uppercase), badges, helper text, breadcrumbs |

### Font Weights
- `400` (Regular): Standard body copy, descriptions, standard data table values.
- `500` (Medium): Interactive links, form labels, buttons, navigation items.
- `600` (Semi-bold): Column headers, financial totals, card titles, section headings.

---

## 4. Spacing System

ThinkBuild Accounts adheres to a strict **4px baseline grid**. All paddings, margins, gaps, and component dimensions must map to multiples of 4px.

| Spacing Token | Pixels | Rem Equivalent | Primary Applications |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25rem | Micro offsets, badge internal padding, tight icon-to-text gap |
| `space-2` | 8px | 0.50rem | Compact button padding, input internal padding Y, item gaps |
| `space-3` | 12px | 0.75rem | Standard input padding X, badge horizontal padding, cell padding Y |
| `space-4` | 16px | 1.00rem | Standard card internal padding, table cell padding X, button padding X |
| `space-5` | 20px | 1.25rem | Section spacing inside cards, modal body padding |
| `space-6` | 24px | 1.50rem | Card-to-card grid gap, form section divider spacing |
| `space-8` | 32px | 2.00rem | Page content margins, header-to-content separation |
| `space-10`| 40px | 2.50rem | Major layout block division |
| `space-12`| 48px | 3.00rem | Large dashboard widget separation |

---

## 5. Border Radius

Border radiuses are kept intentionally subtle to maintain an architectural, enterprise aesthetic.

| Radius Token | Value | Target Components |
| :--- | :--- | :--- |
| `radius-input` | 6px (`0.375rem`) | Text inputs, dropdown select triggers, action buttons, filter chips |
| `radius-card`  | 8px (`0.500rem`) | Content cards, data table wrappers, modal windows, flyout dialogs |
| `radius-badge` | 4px (`0.250rem`) | Status indicator tags, ledger status pills |

---

## 6. Borders, Shadows & Visual Restraint

- **1px Crisp Borders**: Interface separation relies on crisp `1px solid #E5E7EB` borders rather than drop shadows.
- **Restricted Shadows**: Box shadows are strictly forbidden on cards, tables, inputs, sidebars, or headers. Shadows are permitted **ONLY** on elevated floating overlays:
  - Modals: `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);`
  - Dropdowns / Context Menus: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);`
- **Zero Gradients**: No background gradients, radial shading, or gradient borders are permitted anywhere in the system.
- **No Decorative Illustrations**: All graphical illustrations, cartoon avatars, and decorative graphics are prohibited.
- **No Coloured Sidebars**: The navigation sidebar remains pure white with a 1px border.

---

## 7. Component Specifications

### Sidebar Navigation
- **Background**: Solid `#FFFFFF`
- **Border**: Right border `1px solid #E5E7EB`
- **Width**:
  - Expanded: `240px`
  - Collapsed: `64px`
- **Navigation Items**:
  - Height: `38px`
  - Margin: `2px 8px`
  - Text color: `#6B7280` (Medium 500, 13px)
  - Hover state: Background `#F8FAFC`, text `#111827`
  - Active state: Background `#EFF4FF` (Accent Tint), text `#2563EB`, left indicator bar `3px solid #2563EB` (or border-radius 6px)

### Data Table Rows & Ledger Cells
- **Row Height**: Exactly `44px` across all standard ledger and inventory tables.
- **Alignment**:
  - Descriptions, names, IDs: Left-aligned
  - Dates, statuses: Left-aligned or Centered
  - Numeric figures (debits, credits, balances, quantities): **Right-aligned** with `tabular-nums`
- **Table Headers**:
  - Font Size: `12px`
  - Text Transform: `uppercase`
  - Letter Spacing: `0.05em`
  - Text Color: `#6B7280`
  - Background: `#F8FAFC`
  - Border: Bottom `1px solid #E5E7EB`
- **Hover State**: Table rows highlight with `#F8FAFC` on mouse hover.

### Icons
- **Icon Set**: Lucide Icons (`lucide-angular`)
- **Stroke Width**: Exactly `1.5px`
- **Default Size**: `18px` by `18px`
- **Color**: Inherits text color (`currentColor`), typically `#6B7280` for inactive states and `#2563EB` for active states.

### Animation & Transitions
- **Timing**: Uniform duration of `120ms`
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Scope**: Applied strictly to button hover states, row highlights, dropdown fades, and sidebar collapse transitions. No bouncy or delayed transitions.

---

## 8. CSS Custom Properties (:root)

Include the following variables in the global application stylesheet (`src/styles.scss` or `styles.css`):

```css
:root {
  /* ==========================================================================
     Colour Palette
     ========================================================================== */
  --tb-bg: #FFFFFF;
  --tb-canvas: #F8FAFC;
  --tb-surface: #FFFFFF;
  --tb-border: #E5E7EB;

  --tb-text-primary: #111827;
  --tb-text-muted: #6B7280;

  --tb-accent: #2563EB;
  --tb-accent-hover: #1D4ED8;
  --tb-accent-tint: #EFF4FF;

  --tb-success: #15803D;
  --tb-warning: #B45309;
  --tb-danger: #B91C1C;

  /* ==========================================================================
     Typography
     ========================================================================== */
  --tb-font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  --tb-text-12: 12px;
  --tb-text-13: 13px;
  --tb-text-14: 14px;
  --tb-text-16: 16px;
  --tb-text-20: 20px;
  --tb-text-28: 28px;

  --tb-font-regular: 400;
  --tb-font-medium: 500;
  --tb-font-semibold: 600;

  /* ==========================================================================
     Spacing (4px baseline grid)
     ========================================================================== */
  --tb-space-1: 4px;
  --tb-space-2: 8px;
  --tb-space-3: 12px;
  --tb-space-4: 16px;
  --tb-space-5: 20px;
  --tb-space-6: 24px;
  --tb-space-8: 32px;
  --tb-space-10: 40px;
  --tb-space-12: 48px;

  /* ==========================================================================
     Border Radius
     ========================================================================== */
  --tb-radius-input: 6px;
  --tb-radius-card: 8px;
  --tb-radius-badge: 4px;

  /* ==========================================================================
     Component Dimensions
     ========================================================================== */
  --tb-sidebar-expanded-width: 240px;
  --tb-sidebar-collapsed-width: 64px;
  --tb-table-row-height: 44px;
  --tb-icon-size: 18px;
  --tb-icon-stroke: 1.5px;

  /* ==========================================================================
     Shadows (Permitted ONLY on floating dialogs and dropdowns)
     ========================================================================== */
  --tb-shadow-dropdown: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --tb-shadow-modal: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);

  /* ==========================================================================
     Transitions
     ========================================================================== */
  --tb-transition-duration: 120ms;
  --tb-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --tb-transition-default: 120ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tabular figures utility for monetary and numeric display */
.tb-tabular-nums,
table td.tb-num,
.tb-amount {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
```
