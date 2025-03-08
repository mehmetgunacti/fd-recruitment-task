import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColourPickerComponent),
      multi: true
    }
  ]
})
export class ColourPickerComponent implements ControlValueAccessor {
  colour: string = '';

  private onChange = (colour: string) => { };
  private onTouched = () => { };

  writeValue(colour: string): void {
    this.colour = colour;
  }

  registerOnChange(fn: (colour: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if you need to handle disabled state
  }

  opencolourPicker(event: any): void {
    const colour = event.target.value;
    this.colour = colour;
    this.onChange(colour);
    this.onTouched();
  }

  clearcolour(): void {
    this.colour = '';
    this.onChange('');
    this.onTouched();
  }
}
