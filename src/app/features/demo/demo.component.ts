import { Component, Inject, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewLayoutComponent } from '../../shared/components/preview-layout/preview-layout.component';
import { PreviewService, PreviewItem } from '../../core/services/preview.service';

@Component({
    selector: 'app-demo',
    standalone: true,
    imports: [CommonModule, PreviewLayoutComponent],
    template: `
    <div class="demo-container">
      <div class="intro">
        <h2>Asset Gallery</h2>
        <p>Click on any asset to open the preview. Use arrow keys or on-screen buttons to navigate.</p>
        <p class="stats">Loaded {{ itemList.length }} items. (Pagination implementation simulates fetching more)</p>
      </div>

      <div class="grid">
        <div 
          class="card" 
          *ngFor="let item of itemList; let i = index"
          (click)="openPreview(i)">
          <div class="card-thumbnail" [ngClass]="item.type">
            <!-- Mock Thumbnail content -->
            <span *ngIf="item.type === 'image'">🖼️</span>
            <span *ngIf="item.type === 'pdf'">📄</span>
            <span *ngIf="item.type === 'document'">📝</span>
          </div>
          <div class="card-info">
            <h3>{{ item.title }}</h3>
            <span>{{ item.type }}</span>
          </div>
        </div>
      </div>

      <!-- Preview Overlay -->
      <app-preview-layout
        *ngIf="previewService.isOpen()"
        [title]="previewService.currentItem()?.title || ''"
        [metadata]="previewService.currentItem()?.metadata || null"
        [hasPrevious]="previewService.hasPrevious()"
        [hasNext]="true" 
        [isLoading]="previewService.isLoading()"
        (close)="previewService.close()"
        (previous)="previewService.previous()"
        (next)="onNext()">
        
        <!-- Projected Content based on type -->
        <div class="preview-content" *ngIf="previewService.currentItem() as item">
          <div *ngIf="item.type === 'image'" class="visual-preview image-preview">
             <img [src]="item.url" [alt]="item.title" style="max-width: 100%; max-height: 60vh; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
             <p style="margin-top: 1rem; color: #666;">Note: Using placeholder images for demo</p>
          </div>

          <div *ngIf="item.type === 'pdf'" class="visual-preview pdf-preview">
            <div class="pdf-placeholder">
              <span>PDF Content Placeholder</span>
              <p>{{ item.title }}</p>
            </div>
          </div>

          <div *ngIf="item.type === 'document'" class="visual-preview doc-preview">
            <div class="doc-placeholder">
              <span>Document Content Placeholder</span>
              <p>Lore ipsum dolor sit amet for {{ item.title }}</p>
            </div>
          </div>
        </div>

      </app-preview-layout>
    </div>
  `,
    styles: [`
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .intro {
      margin-bottom: 2rem;
      text-align: center;
      
      h2 { color: #333; margin-bottom: 0.5rem; }
      p { color: #666; }
      .stats { font-size: 0.9rem; color: #888; font-style: italic; }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid #f0f0f0;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
      }
    }

    .card-thumbnail {
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background-color: #f8f9fa;
      
      &.image { background-color: #e3f2fd; color: #2196f3; }
      &.pdf { background-color: #ffebee; color: #f44336; }
      &.document { background-color: #e8f5e9; color: #4caf50; }
    }

    .card-info {
      padding: 1rem;
      
      h3 { margin: 0 0 0.25rem 0; font-size: 1rem; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      span { font-size: 0.8rem; color: #999; text-transform: uppercase; font-weight: 600; }
    }

    .visual-preview {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .pdf-preview .pdf-placeholder, .doc-preview .doc-placeholder {
      width: 100%;
      height: 60vh;
      background: #f1f1f1;
      border: 2px dashed #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #888;
      font-weight: 500;
      border-radius: 4px;
    }
  `]
})
export class DemoComponent {
    previewService = inject(PreviewService);

    // Local list of items (this would come from an API usually)
    itemList: PreviewItem[] = [];

    constructor() {
        this.generateMockItems(20);
    }

    generateMockItems(count: number, startIndex: number = 0) {
        const types: ('image' | 'pdf' | 'document')[] = ['image', 'pdf', 'document'];
        const formattedItems: PreviewItem[] = Array.from({ length: count }).map((_, i) => {
            const idx = startIndex + i + 1;
            const type = types[idx % 3];
            return {
                id: idx,
                title: `Asset #${idx} - ${type.toUpperCase()}`,
                type: type,
                url: `https://picsum.photos/seed/${idx}/800/600`, // works for images, ignored for others in template
                metadata: {
                    'Created By': 'John Doe',
                    'Date': new Date().toLocaleDateString(),
                    'File Size': `${Math.floor(Math.random() * 5000) + 500} KB`,
                    'Status': 'Approved'
                }
            };
        });

        if (startIndex === 0) {
            this.itemList = formattedItems;
        } else {
            this.itemList = [...this.itemList, ...formattedItems];
        }

        // Sync with service if needed, but usually we just pass the full list when opening
        // or perform incremental updates.
    }

    openPreview(index: number) {
        this.previewService.open(this.itemList, index);
    }

    async onNext() {
        const currentIndex = this.previewService.currentIndex();
        const totalItems = this.previewService.items().length;

        // Check if we are near the end to simulate pagination
        if (currentIndex >= totalItems - 2) {
            console.log('Near end, loading more items...');
            this.previewService.setLoading(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Generate more items
            const currentCount = this.itemList.length;
            this.generateMockItems(10, currentCount);

            // Update the service with the new list
            // Note: In a real app we might just append to the service
            this.previewService.appendItems(this.itemList.slice(currentCount));

            this.previewService.setLoading(false);
        }

        // Proceed to next
        this.previewService.next();
    }
}
