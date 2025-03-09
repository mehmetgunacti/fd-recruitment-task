import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements ControlValueAccessor {

  tags = new Set<string>();

  @Input() suggestions: string[] = [];

  @Output() tagInput: EventEmitter<string | null> = new EventEmitter<string | null>();

  private onChange = (tags: string[]) => { };
  private onTouched = () => { };

  writeValue(tags: string[] | null): void {
    this.tags = new Set(tags ?? []);
  }

  registerOnChange(fn: (tags: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if you need to handle disabled state
  }

  onInput(event: Event): void {

    const target = event.target as HTMLInputElement;
    const inputValue = target.value;

    // if user presses space or clicks on a suggestion
    // note: all suggestions end with a ' '
    if (inputValue.endsWith(' ')) {

      const t = target.value.trim();
      this.tags.add(t);
      target.value = '';
      this.onChange(Array.from(this.tags));
      this.onTouched();

    } else
      // else emit entered value to receive tag suggestions
      this.tagInput.emit(inputValue);

  }

  addTag(event: KeyboardEvent): void {

    if (event.key === 'Enter') {

      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const t = target.value.trim();
      this.tags.add(t);
      target.value = '';
      this.onChange(Array.from(this.tags));
      this.onTouched();

    }

  }

  removeTag(tag: string): void {

    this.tags.delete(tag);
    this.onChange(Array.from(this.tags));
    this.onTouched();

  }

}
