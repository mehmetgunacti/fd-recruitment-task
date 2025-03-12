import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, output, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoListDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-list-update-form',
  imports: [ReactiveFormsModule],
  templateUrl: './list-update-form.component.html',
  styleUrl: './list-update-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListUpdateFormComponent implements OnDestroy {

  // Input
  dto = input.required<TodoListDto>();
  error = input<string | null>();

  // Output
  update = output<string>();
  delete = output<void>();
  cancel = output<void>();

  protected fc = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);

  constructor() {

    effect(() => {

			untracked(() => this.fc.setValue(this.dto().title, { emitEvent: false }));

		});

  }

  ngOnDestroy(): void {

    this.onCancel();

  }

  onUpdate(): void {

    if (this.fc.valid)
      this.update.emit(this.fc.value);

  }

  onDelete(): void {

    this.delete.emit();

  }

  onCancel(): void {

    this.cancel.emit();

  }

}
