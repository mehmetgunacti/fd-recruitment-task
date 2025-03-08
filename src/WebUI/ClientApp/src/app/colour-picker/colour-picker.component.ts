import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColourPickerComponent),
      multi: true
    }
  ]
})
export class ColourPickerComponent implements ControlValueAccessor {

  DEFAULT_COLOURS: string[] = ['#87cefa', '#90ee90', '#ffb6c1', '#ffa07a', '#e6e6fa', '#ffe4e1', '#afeeee', '#e6e5b0'];

  colour: string | null = null;

  private onChange = (colour: string) => { };
  private onTouched = () => { };

  writeValue(colour: string | null): void {
    this.colour = colour;
  }

  registerOnChange(fn: (colour: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if you need to handle disabled state
  }

  selectColour(selected: string | null): void {
    // de-select on same colour click
    const colour = selected === this.colour ? null : selected;
    this.colour = colour;
    this.onChange(colour);
    this.onTouched();
  }

  clearColour(): void {
    this.colour = null;
    this.onChange(null);
    this.onTouched();
  }
}
