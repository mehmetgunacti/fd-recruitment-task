import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { SetFocusDirective } from 'src/app/directives/set-focus.directive';

@Component({
  selector: 'app-add-todo-item',
  imports: [SetFocusDirective],
  templateUrl: './add-todo-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'd-flex align-items-center'
  }
})
export class AddTodoItemComponent {

  protected isEdit = signal<boolean>(false);

  // Output
  add = output<string>();

  protected edit(): void {
    this.isEdit.set(true);
  }

  protected onSave(title: string): void {

    const content = title.trim();
    if (content)
      this.add.emit(title);
    this.isEdit.set(false);

  }

  protected onEnterKey(event: Event) {

    const target = event.target as HTMLElement;
    const content = target.innerHTML;
    this.onSave(content);

  }

  protected onBlur(title: string): void {

    if (!title.trim())
      this.isEdit.set(false);

  }

  protected onCancel(): void {
    this.isEdit.set(false);
  }

}
