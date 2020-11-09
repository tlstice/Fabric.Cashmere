import { AfterContentInit, Component, ContentChildren, HostBinding, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { parseBooleanAttribute } from '../util';
import { ButtonToggleComponent } from './button-toggle.component';

const supportedStyles = ['primary', 'primary-alt', 'destructive', 'neutral', 'secondary'];
const supportedColors = ['blue', 'green', 'purple', 'red', 'orange', 'ruby-red', 'deep-red', 'red-orange', 'magenta', 'pink', 'light-pink', 'azure', 'teal', 'dark-green', 'brown', 'purple-gray', 'yellow', 'yellow-orange', 'tan'];
const supportedSizes = ['sm', 'md', 'lg'];

export function validateStyleInput(style: string) {
    if (supportedStyles.indexOf(style) < 0 && supportedColors.indexOf(style) < 0) {
        throw Error('Unsupported buttonStyle attribute value on ButtonToggleGroupComponent: ' + style);
    }
}

export function validateSizeInput(size: string) {
    if (supportedSizes.indexOf(size) < 0) {
        throw Error('Unsupported size attribute value on ButtonToggleGroupComponent: ' + size);
    }
}

/** `hc-button-toggle-group` components are on/off toggles with the appearance of a `hc-button`.
 * These toggle groups may be configured to behave as single-select (like radio buttons), or multi-select (like checkboxes). */
@Component({
    selector: 'hc-button-toggle-group',
    templateUrl: './button-toggle-group.component.html',
    styleUrls: ['./button-toggle.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ButtonToggleGroupComponent implements AfterContentInit, OnDestroy {
    private _disabled = false;
    private _style: string = 'secondary';
    private _size: string = 'md';
    private _multiple: boolean = false;
    private unsubscribe$ = new Subject<void>();

    @HostBinding('class.hc-button-toggle-group') _hostClass = true;

    @ContentChildren(ButtonToggleComponent)
    _buttons: QueryList<ButtonToggleComponent>;

    /** Sets style of toggle. Choose from: `'primary' | 'primary-alt' | 'destructive' | 'neutral' | 'secondary'`.
    * If needed, colors from the primary or secondary palette may be used as well (e.g. 'pink', 'red-orange', etc) */
    @Input()
    get buttonStyle(): string {
        return this._style;
    }
    set buttonStyle(val: string) {
        validateStyleInput(val);
        if ( supportedStyles.indexOf(val) < 0 ) {
            val = "button-" + val;
        }
        this._style = val;
        this._updateButtonStyle();
    }

    /** Sets size of toggle. Choose from: `'sm' | 'md' | 'lg' |`. *Defaults to `md`.* */
    @Input()
    get size(): string {
        return this._size;
    }

    set size(size: string) {
        validateSizeInput(size);
        this._size = size;
        this._updateButtonStyle();
    }

    /** Whether multiple button toggles can be selected. *Defaults to `false`.* */
    @Input()
    get multiple(): boolean {
        return this._multiple;
    }
    set multiple(val) {
        this._multiple = parseBooleanAttribute(val);
    }

    _updateButtonStyle() {
        if ( this._buttons ) {
            this._buttons.forEach((button: ButtonToggleComponent) => {
                const checkedClass = button.checked ? 'hc-toggle-checked' : '';
                button._hostClass = 'hc-button-toggle hc-' + this._style + ' ' + 'hc-' + this._size + ' ' + checkedClass;
            });
        }
    }

    _updateValue( targetButton: ButtonToggleComponent ) {
        if ( !this.multiple ) {
            this._buttons.forEach((button: ButtonToggleComponent) => {
                if ( button !== targetButton ) {
                    button._checked = false;
                }
            });
        }
        this._updateButtonStyle();
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this._updateButtonStyle();
        });

        if ( this._buttons ) {
            this._buttons.forEach((button: ButtonToggleComponent) => {
                button._toggleClick.pipe(takeUntil(this.unsubscribe$)).subscribe(
                    (target: ButtonToggleComponent) => this._updateValue( target ));
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
