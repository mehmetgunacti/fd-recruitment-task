import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-list-form',
  imports: [ReactiveFormsModule],
  templateUrl: './new-list-form.component.html',
  styleUrl: './new-list-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewListFormComponent implements OnDestroy {

  // Input
  error = input<string | null>();

  // Output
  add = output<string>();
  cancel = output<void>();

  protected fc = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);

  ngOnDestroy(): void {
    
    this.onCancel();

  }

  onAddList(): void {

    if (this.fc.valid)
      this.add.emit(this.fc.value);

  }

  onCancel(): void {

    this.cancel.emit();

  }

}
