import { Component, EventEmitter, Input, Output, HostListener, Directive, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';

@Directive({
    selector: '[preview-title]',
    standalone: true
})
export class PreviewTitleDirective { }

@Directive({
    selector: '[preview-footer]',
    standalone: true
})
export class PreviewFooterDirective { }

@Directive({
    selector: '[preview-alert]',
    standalone: true
})
export class PreviewAlertDirective { }

@Directive({
    selector: '[preview-header-actions]',
    standalone: true
})
export class PreviewHeaderActionsDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[preview-controls]',
    standalone: true
})
export class PreviewControlsDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Component({
    selector: 'app-preview-layout',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, DragDropModule, MatMenuModule],
    templateUrl: './preview-layout.component.html',
    styleUrls: ['./preview-layout.component.scss']
})
export class PreviewLayoutComponent {
    @Input() hasPrevious: boolean = false;
    @Input() hasNext: boolean = false;
    @Input() isLoading: boolean = false;
    @Input() navigationLocked: boolean = false;
    @Input() closeLocked: boolean = false;

    @Output() close = new EventEmitter<void>();
    @Output() previous = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    @ContentChild(PreviewTitleDirective) titleContent?: PreviewTitleDirective;
    @ContentChild(PreviewHeaderActionsDirective) headerActionsContent?: PreviewHeaderActionsDirective;
    @ContentChild(PreviewAlertDirective) alertContent?: PreviewAlertDirective;
    @ContentChild(PreviewFooterDirective) footerContent?: PreviewFooterDirective;

    @HostListener('document:keydown.escape')
    onEscape() {
        if (!this.closeLocked) {
            this.close.emit();
        }
    }

    @HostListener('document:keydown.arrowleft')
    onLeftArrow() {
        if (this.hasPrevious && !this.isLoading && !this.navigationLocked) {
            this.previous.emit();
        }
    }

    @HostListener('document:keydown.arrowright')
    onRightArrow() {
        if (this.hasNext && !this.isLoading && !this.navigationLocked) {
            this.next.emit();
        }
    }

    onBackdropClick(event: MouseEvent) {
        if (this.closeLocked) return;

        if ((event.target as HTMLElement).classList.contains('preview-backdrop')) {
            this.close.emit();
        }
    }
}
