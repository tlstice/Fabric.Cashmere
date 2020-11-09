import {Component} from '@angular/core';

@Component({
    selector: 'hc-button-toggle-example',
    templateUrl: 'button-toggle-example.component.html',
    styleUrls: ['button-toggle-example.component.scss']
})
export class ButtonToggleExampleComponent {
    multiGroup = [
        {value: 'Asthma', checked: false},
        {value: 'Allergies', checked: false},
        {value: 'Diabetes', checked: true},
        {value: 'Epilepsy', checked: true}
    ];
}
