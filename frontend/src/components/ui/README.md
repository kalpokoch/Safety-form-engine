# UI Components Library

This directory contains reusable UI components used throughout the Safety Form Engine application. All components follow a consistent design system and support TypeScript for type safety.

## Components

### Button
Versatile button component with multiple variants and sizes.

**Variants:**
- `primary` - Main action buttons (indigo)
- `secondary` - Secondary actions (card background with border)
- `success` - Positive actions (green)
- `error` - Destructive actions (red)
- `outline` - Outlined buttons
- `ghost` - Minimal buttons with hover effect

**Sizes:** `sm`, `md` (default), `lg`

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `icon` - Lucide icon component
- `iconPosition` - Icon placement ('left' | 'right')
- `fullWidth` - Make button take full width
- `loading` - Show loading spinner

**Example:**
```tsx
<Button variant="primary" icon={Save} loading={isLoading}>
  Save Form
</Button>
```

### Card
Container component with consistent styling and variants.

**Variants:**
- `default` - Standard shadow
- `elevated` - Enhanced shadow
- `bordered` - Double border with light shadow
- `interactive` - Hover effects

**Props:**
- `variant` - Card style variant
- `hoverable` - Add hover effect
- `clickable` - Add cursor pointer and hover border

**Sub-components:**
- `CardHeader` - Header section with optional icon
- `CardBody` - Main content area
- `CardFooter` - Footer section

**Example:**
```tsx
<Card variant="interactive" clickable>
  <CardHeader 
    icon={Settings} 
    title="Form Builder"
    description="Create custom forms"
  />
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>
```

### Alert
Message display component for success, error, warning, and info states.

**Variants:** `success`, `error`, `warning`, `info`

**Props:**
- `variant` - Alert type
- `title` - Optional title
- `message` - Alert message
- `icon` - Show/hide icon (default: true)

**Example:**
```tsx
<Alert variant="success" message="Form saved successfully!" />
<Alert variant="error" title="Error" message="Failed to save" />
```

### Input
Text input field with label, validation states, and icons.

**Props:**
- `label` - Input label
- `error` - Error message
- `helperText` - Helper text
- `showSuccess` - Show success state
- `leftIcon` - Icon on the left
- `rightIcon` - Icon on the right

**Example:**
```tsx
<Input 
  label="Form Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  showSuccess={!!title}
  required
/>
```

### Select
Dropdown select with consistent styling.

**Props:**
- `label` - Select label
- `error` - Error message
- `helperText` - Helper text
- `showSuccess` - Show success state

**Example:**
```tsx
<Select 
  label="Branch"
  value={branch}
  onChange={(e) => setBranch(e.target.value)}
  required
>
  <option value="">Select...</option>
  <option value="1">Branch 1</option>
</Select>
```

### Textarea
Multi-line text input with consistent styling.

**Props:**
- `label` - Textarea label
- `error` - Error message
- `helperText` - Helper text
- `showSuccess` - Show success state

**Example:**
```tsx
<Textarea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={3}
/>
```

### PageHeader
Consistent page header with icon, title, description, and optional actions.

**Props:**
- `icon` - Lucide icon component (required)
- `iconColor` - Icon color class
- `title` - Page title (required)
- `description` - Page description
- `actions` - Optional action buttons

**Example:**
```tsx
<PageHeader
  icon={Settings}
  iconColor="text-input-focus"
  title="Form Builder"
  description="Create custom safety forms"
  actions={<Button>New Form</Button>}
/>
```

## Design Tokens

All components use the following design tokens from the Tailwind config:

**Colors:**
- `dark-bg` - Main background
- `dark-card` - Card background
- `dark-border` - Border color
- `dark-text-primary` - Primary text
- `dark-text-secondary` - Secondary text
- `dark-text-muted` - Muted text
- `input-focus` - Focus/primary color (indigo)
- `input-success` - Success color (green)
- `input-error` - Error color (red)

**Spacing:**
- Consistent padding: `p-6` for cards
- Gap between elements: `gap-2` to `gap-4`
- Margin bottom: `mb-4` to `mb-8`

**Borders:**
- Border radius: `rounded-lg`
- Border width: `border`
- Shadow: `shadow-lg`, `shadow-xl`

## Best Practices

1. **Always use these components** instead of creating custom styled elements
2. **Import from the index**: `import { Button, Card } from '../components/ui'`
3. **Keep variants limited** to maintain consistency
4. **Use TypeScript** props for type safety
5. **Extend carefully** - add new variants only when necessary

## Adding New Components

When adding a new component:

1. Create it in this directory
2. Follow the existing naming conventions
3. Export it from `index.ts`
4. Document it in this README
5. Use the same color tokens and spacing system
6. Add TypeScript types for all props
7. Use `React.forwardRef` for DOM elements
