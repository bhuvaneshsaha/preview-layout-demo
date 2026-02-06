import { Injectable, signal, computed } from '@angular/core';

export interface PreviewItem {
    id: string | number;
    title: string;
    type: 'image' | 'pdf' | 'document';
    url: string; // url to content or thumbnail
    metadata?: Record<string, any>;
}

@Injectable({
    providedIn: 'root'
})
export class PreviewService {
    // State
    private _items = signal<PreviewItem[]>([]);
    private _currentIndex = signal<number>(-1);
    private _isOpen = signal<boolean>(false);
    private _isLoading = signal<boolean>(false);

    // Selectors
    items = this._items.asReadonly();
    currentIndex = this._currentIndex.asReadonly();
    isOpen = this._isOpen.asReadonly();
    isLoading = this._isLoading.asReadonly();

    currentItem = computed(() => {
        const idx = this._currentIndex();
        const items = this._items();
        if (idx >= 0 && idx < items.length) {
            return items[idx];
        }
        return null;
    });

    hasPrevious = computed(() => this._currentIndex() > 0);
    hasNext = computed(() => {
        // If we are at the end, we might want to allow "next" to trigger loading more
        // For now, simpler logic: check if next index exists in current Set
        // Real logic for pagination: if distinct next item exists OR we can fetch more
        return this._currentIndex() < this._items().length - 1;
    });

    // Actions
    open(items: PreviewItem[], startIndex: number = 0) {
        this._items.set(items);
        this._currentIndex.set(startIndex);
        this._isOpen.set(true);
    }

    close() {
        this._isOpen.set(false);
        this._currentIndex.set(-1);
    }

    setLoading(loading: boolean) {
        this._isLoading.set(loading);
    }

    next() {
        if (this._currentIndex() < this._items().length - 1) {
            this._currentIndex.update(i => i + 1);
        }
    }

    previous() {
        if (this._currentIndex() > 0) {
            this._currentIndex.update(i => i - 1);
        }
    }

    // Helper to append more items (for pagination)
    appendItems(newItems: PreviewItem[]) {
        this._items.update(current => [...current, ...newItems]);
    }
}
