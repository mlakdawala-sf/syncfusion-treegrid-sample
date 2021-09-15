import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterContentChecked,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { SymbolBox } from './enums';

interface symbolBoxEvent {
  checked: boolean;
}

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckBoxComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  /**
   * Inputs
   ** Removed Inputs **
   * id - not in use
   * value - not in use
   * color - not in use
   * textHeight - not in use
   * textColor - not in use
   * triggerCheckbox - not in use
   * fontSize - not in use
   * styleName - not in use
   */
  @Input() data = false;
  @Input() set disabled(condition: boolean) {
    this._disabled = condition ? true : false;
    const action = condition ? 'disable' : 'enable';
    if (this.control) {
      this.control[action]();
    }
  } // Whether the element is disabled. Default value is false
  @Input() label = '';
  @Input() checked = false; // whether the checkbox is checked
  @Input() required = false; // Whether the element is required. Default value is false.
  @Input() theme: ThemePalette = 'primary'; //values can be primary, accent, warn

  @Input() isIconEnable = false; // whether icon is enabled or given icon name render or not.
  @Input() set placeHolder(label: string) {
    this.label = label;
  }
  get placeHolder(): string {
    return this.label;
  }
  @Input() control: FormControl; // the form control
  @Input() formGroup: FormGroup; // the form group
  @Input() formControlKey: string; // the form control key
  @Input() textPosition: 'before' | 'after' = 'after'; // indicates text(placeholder) position whether before or after

  @Input() iconType = ''; //  the icontype
  @Input() iconName = ''; //  the icon name
  @Input() iconSize = ''; //  size of icon
  @Input() iconPath = ''; //  the path of icon
  @Input() iconColor = ''; // the color of icon
  @Input() fontSet = ''; //  the fontset of icon
  @Input() indeterminate: boolean;

  @Input() styleName = 'default'; // not in use
  @Input() value: any; // not in use
  @Input() color = ''; // not in use

  @Input() showRequiredMarker = false; //to show required marker (i.e. * symbol)
  @Input() showPlaceHolder = true;
  @Input('symbol-type') symbolType: SymbolBox;
  @Input() description = '';
  /**
   * Outputs
   */
  @Output() dataChange = new EventEmitter(); // emitted on change in data
  @Output() onchange = new EventEmitter();

  symbolBoxEnum = SymbolBox;

  /**
   *
   */
  private ValidatorsArray: any = [];
  private _disabled = false;

  get disabled() {
    return this._disabled;
  }

  ngOnInit() {
    // this.id = this.common.generateRandomString();
    this.ValidatorsArray = [];
    // if (this.required) this.ValidatorsArray.push(Validators.required);

    if (this.transform(this.control)) {
      if (this.transform(this.control.validator)) {
        this.ValidatorsArray.push(this.control.validator);
      }
      this.control.setValidators(this.ValidatorsArray);
    } else {
      this.control = new FormControl('', this.ValidatorsArray);
    }
    if (
      this.transform(this.formGroup) &&
      this.transform(this.formControlKey)
    ) {
      this.formGroup.addControl(this.formControlKey, this.control);
    }

    if (this.disabled) {
      this.control.disable();
    }
  }

  ngAfterContentChecked(): void {
    // if (this.hasValue.transform(this.control)) {
    //   this.disabled ? this.control.disable() : this.control.enable();
    // }
  }

  change(ev: any): void {
    this.dataChange.emit(this.data);
  }

  toggleCheckbox(ev: MatCheckboxChange): void {
    this.onchange.emit(ev);
  }

  ngOnDestroy(): void {
    if (
      this.transform(this.formGroup) &&
      this.transform(this.formControlKey)
    ) {
      this.formGroup.removeControl(this.formControlKey);
    }
  }

  toggleSymbolBox(ev: symbolBoxEvent) {
    if (!this.disabled) {
      this.onchange.emit(ev);
    }
  }

  transform(value: any): any {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    /* This was evaluating dateObject as false*/
    if (value instanceof Date) {
      return true;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length >= 1;
    }
    return value !== null && value !== undefined && value !== '';
  }
}
