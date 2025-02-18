import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, Renderer2, ViewEncapsulation} from '@angular/core';
import {parseBooleanAttribute} from '../util';

export const supportedStyles = ['primary', 'primary-alt', 'destructive', 'neutral', 'secondary', 'minimal', 'link', 'link-inline', 'pagination'];
const supportedColors = ['blue', 'green', 'purple', 'red', 'orange', 'ruby-red', 'deep-red', 'red-orange', 'magenta', 'pink', 'light-pink', 'azure', 'teal', 'dark-green', 'brown', 'purple-gray', 'yellow', 'yellow-orange', 'tan'];
const supportedSizes = ['sm', 'md', 'lg'];

export function validateStyleInput(style: string, component: string): void {
    if (supportedStyles.indexOf(style) < 0 && supportedColors.indexOf(style) < 0) {
        throw Error('Unsupported buttonStyle attribute value on ' + component + ': ' + style);
    }
}

export function validateSizeInput(size: string, component: string): void {
    if (supportedSizes.indexOf(size) < 0) {
        throw Error('Unsupported size attribute value on ' + component + ': ' + size);
    }
}

const buttonAttributes = ['hc-icon-button', 'hc-button'];

/** Cashmere styled button */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[hc-button], button[hc-icon-button]',
    template: '<ng-content></ng-content>',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
    private _disabled = false;
    private _style: string;
    private _size: string;

    /** Sets style of button. Choose from: `'primary' | 'primary-alt' | 'destructive' |
     * 'neutral' | 'secondary' | 'minimal' | link' | 'link-inline'`. If needed, colors from
     * the primary or secondary palette may be used as well (e.g. 'pink', 'red-orange', etc) */
    @Input()
    get buttonStyle(): string {
        return this._style;
    }

    set buttonStyle(btnStyle: string) {
        validateStyleInput(btnStyle, 'ButtonComponent');
        if ( supportedStyles.indexOf(btnStyle) < 0 ) {
            btnStyle = "button-" + btnStyle;
        }
        this.setHostClass(this._style, btnStyle);
        this._style = btnStyle;
    }

    /** Sets size of button. Choose from: `'sm' | 'md' | 'lg' |`. *Defaults to `md`.* */
    @Input()
    get size(): string {
        return this._size;
    }

    set size(size: string) {
        validateSizeInput(size, 'ButtonComponent');
        this.setHostClass(this._size, size);
        this._size = size;
    }

    /** Whether the control is disabled. */
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(isDisabled: boolean) {
        this._disabled = parseBooleanAttribute(isDisabled);
    }

    @HostBinding('attr.disabled')
    get _disabledAttr(): string | null {
        return this.disabled ? "disabled" : null;
    }

    constructor(public elementRef: ElementRef, private renderer: Renderer2) {
        this.buttonStyle = 'primary';
        this.size = 'md';

        for (const attr of buttonAttributes) {
            if (elementRef.nativeElement.hasAttribute(attr)) {
                renderer.addClass(elementRef.nativeElement, attr);
            }
        }
    }

    /** Used to give focus to the button */
    focus(): void {
        this.elementRef.nativeElement.focus();
    }

    private setHostClass(previous: string, current) {
        if (previous !== current) {
            if (previous) {
                this.renderer.removeClass(this.elementRef.nativeElement, this._hcClassify(previous));
            }
            this.renderer.addClass(this.elementRef.nativeElement, this._hcClassify(current));
        }
    }

    private _hcClassify(style: string): string {
        return `hc-${style}`;
    }
}
