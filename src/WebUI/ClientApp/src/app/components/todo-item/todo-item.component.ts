import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TodoItemDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {

  // Input
  item = input.required<TodoItemDto>();

  // Output
  update = output<TodoItemDto>();
  edit = output<number>();

  private isProgrammaticBlur = false;

  protected onStateChange(newState: boolean): void {
    this.update.emit(TodoItemDto.fromJS({ ...this.item(), done: newState }));
  }

  protected onEnterKey(event: Event) {

    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    event.preventDefault();

    // notify onBlur()
    this.isProgrammaticBlur = true;
    target.blur();

    this.onTitleUpdate(content);

  }

  protected onBlur(event: FocusEvent): void {

    if (this.isProgrammaticBlur) {
      this.isProgrammaticBlur = false;
      return;
    }

    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    this.onTitleUpdate(content);

  }

  private onTitleUpdate(title: string): void {

    const newTitle = title.trim();
    if (newTitle !== this.item().title?.trim())
      this.update.emit(TodoItemDto.fromJS({ ...this.item(), title: newTitle }));

  }

  protected onEdit(): void {
    this.edit.emit(this.item().id);
  }

}
