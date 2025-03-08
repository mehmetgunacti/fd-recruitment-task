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

  openColourPicker(event: any): void {
    const colour = event.target.value;
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
