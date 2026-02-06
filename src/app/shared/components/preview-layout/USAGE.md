# Preview Layout Component

The `PreviewLayoutComponent` is a flexible, responsive modal wrapper designed for previewing assets (images, PDFs, documents) with immersive/chromeless capabilities.

## Features

- **Responsive Design**: Full-screen on mobile, optimized overlay on desktop.
- **Chromeless Mode**: Automatically switches to a floating, draggable toolbar when no title is provided.
- **Draggable Controls**: The floating toolbar can be moved by the user to avoid obscuring content.
- **Notification System**: Built-in slot for alert banners that overlap content without shifting layout.
- **Custom Actions**: Support for injecting custom controls (buttons, menus) into the header.

## Dependencies

Ensure your project has the following Angular Material & CDK modules installed:

```bash
npm install @angular/material @angular/cdk
```

## Basic Usage

Import the component and its directives in your standalone component or module:

```typescript
import { 
  PreviewLayoutComponent, 
  PreviewTitleDirective, 
  PreviewHeaderActionsDirective, 
  PreviewAlertDirective, 
  PreviewFooterDirective 
} from './shared/components/preview-layout/preview-layout.component';

@Component({
  imports: [PreviewLayoutComponent, ...],
  // ...
})
```

### 1. Standard Layout (Fixed Header)

Use the `preview-title` directive to render a standard fixed header bar.

```html
<app-preview-layout 
  *ngIf="isOpen"
  (close)="closePreview()"
  [hasPrevious]="hasPrev"
  [hasNext]="hasNext"
  (previous)="goPrev()"
  (next)="goNext()">

  <!-- 1. Title: Triggers Standard Header Mode -->
  <h2 preview-title>My Document Title</h2>

  <!-- 2. Main Content -->
  <img src="..." />

</app-preview-layout>
```

### 2. Chromeless Layout (Floating Toolbar)

Omit the `preview-title` directive. The component typically renders a **floating, draggable pill** in the top-right corner containing your actions and the close button.

```html
<app-preview-layout ...>
  <!-- NO preview-title element here -->

  <!-- Content takes up full space -->
  <div class="full-screen-image">...</div>

  <ng-template preview-header-actions>
     <!-- Custom actions appear in the floating pill -->
     <button mat-icon-button><mat-icon>share</mat-icon></button>
  </ng-template>
</app-preview-layout>
```

## Advanced Features

### Header Actions
Use `<ng-template preview-header-actions>` to inject custom buttons (like Share, Download, Info) into the header (or floating pill).

```html
<ng-template preview-header-actions>
  <button mat-icon-button (click)="download()"><mat-icon>download</mat-icon></button>
  <button mat-icon-button (click)="info()"><mat-icon>info</mat-icon></button>
</ng-template>
```

### Notifications / Alerts
Use `preview-alert` to show a dismissal banner or status message. This overlays the content at the top.

```html
<div preview-alert *ngIf="hasError">
  <span>⚠️ Unable to load high-res image</span>
</div>
```

### Footer
Use `preview-footer` to pin metadata or controls to the bottom.

```html
<div preview-footer>
  <span>Page 1 of 5</span>
</div>
```

## API Reference

### Inputs
| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isLoading` | `boolean` | `false` | Shows a loading spinner overlay. |
| `hasPrevious` | `boolean` | `false` | Enables the left navigation zone/arrow. |
| `hasNext` | `boolean` | `false` | Enables the right navigation zone/arrow. |
| `navigationLocked` | `boolean` | `false` | Disables navigation interactions. |
| `closeLocked` | `boolean` | `false` | Disables the close button (useful during async ops). |

### Outputs
| Output | Description |
|--------|-------------|
| `(close)` | Emitted when the user clicks the close button or backdrop. |
| `(previous)` | Emitted when the user triggers "Previous" (click or arrow key). |
| `(next)` | Emitted when the user triggers "Next" (click or arrow key). |

### Directives
- `[preview-title]`: Content for the fixed header title. Presence determines Layout Mode.
- `[preview-header-actions]`: **(Must be an ng-template)** Content for custom action buttons.
- `[preview-alert]`: Content for the notification banner.
- `[preview-footer]`: Content for the footer area.
