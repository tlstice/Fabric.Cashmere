import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { parseBooleanAttribute } from '../util';

/** `hc-button-toggle` is the container component for each option within a `hc-button-toggle-group.
 * There are no constraints on the content it may contain (text, icons, images, etc).
 * */
@Component({
    selector: 'hc-button-toggle',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./button-toggle.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ButtonToggleComponent {
    _disabled = false;
    _checked = false;

    @HostBinding('class') _hostClass = 'hc-button-toggle';

    /** Event emitted when this specific toggle is changed */
    @Output()
    _toggleClick: EventEmitter<ButtonToggleComponent> = new EventEmitter();

    /** The value assigned to this particular toggle. Used by the group to get/set the value of the selected item(s). */
    @Input()
    value: string;

    /** Whether the toggle is currently selected. Updates the value of the group when set. *Defaults to `false`.* */
    @Input()
    get checked(): boolean {
        return this._checked;
    }
    set checked(isChecked) {
        this._checked = parseBooleanAttribute(isChecked);
        this._toggleClick.emit( this );
    }

    /** Whether the toggle is disabled. */
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(isDisabled) {
        this._disabled = parseBooleanAttribute(isDisabled);
    }

    @HostListener('click')
    _onClick() {
        this.checked = !this.checked;
    }
}
