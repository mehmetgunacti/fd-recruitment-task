import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ColourPickerComponent } from 'src/app/components/colour-picker/colour-picker.component';
import { CountdownButtonComponent } from 'src/app/components/countdown-button/countdown-button.component';
import { TagInputComponent } from 'src/app/components/tag-input/tag-input.component';
import { ListTitle } from 'src/app/models/list-title.model';
import { PriorityLevelDto, TodoItemDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-item-details-form',
  imports: [ReactiveFormsModule, TagInputComponent, CountdownButtonComponent, ColourPickerComponent],
  templateUrl: './item-details-form.component.html',
  styleUrl: './item-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsFormComponent implements OnDestroy {

  // Input
  item = input.required<TodoItemDto>();
  priorityLevels = input.required<PriorityLevelDto[]>();
  listTitles = input.required<ListTitle[]>();
  tagSuggestions = input.required<string[]>();

  // Output
  update = output<TodoItemDto>();
  cancel = output<void>();
  delete = output<number>();
  tagInput = output<string | null>();

  constructor() {

    effect(() => {

      const { id, listId, priority, note, bgColour, tagList } = this.item();
      this.fg.patchValue({
        id, listId, priority, note, bgColour, tagList
      });

    });

  }

  private fb = inject(FormBuilder);

  protected fg = this.fb.group({

    id: [null],
    listId: [null],
    priority: [0],
    note: [''],
    bgColour: [null],
    tagList: [['']]

  });

  ngOnDestroy(): void {
    this.onCancel();
  }

  onUpdate(): void {
    this.update.emit(TodoItemDto.fromJS({ ...this.item(), ...this.fg.value }));
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onDelete(): void {
    this.delete.emit(2);
  }

  onTagInput(tag: string): void {
    this.tagInput.emit(tag);
  }

}
