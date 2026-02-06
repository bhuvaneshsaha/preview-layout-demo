import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-preview-layout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './preview-layout.component.html',
    styleUrls: ['./preview-layout.component.scss']
})
export class PreviewLayoutComponent {
    @Input() hasPrevious: boolean = false;
    @Input() hasNext: boolean = false;
    @Input() isLoading: boolean = false;

    @Output() close = new EventEmitter<void>();
    @Output() previous = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    @HostListener('document:keydown.escape')
    onEscape() {
        this.close.emit();
    }

    @HostListener('document:keydown.arrowleft')
    onLeftArrow() {
        if (this.hasPrevious && !this.isLoading) {
            this.previous.emit();
        }
    }

    @HostListener('document:keydown.arrowright')
    onRightArrow() {
        if (this.hasNext && !this.isLoading) {
            this.next.emit();
        }
    }

    onBackdropClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('preview-backdrop')) {
            this.close.emit();
        }
    }
}
