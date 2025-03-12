import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoContainer } from 'src/app/containers/todo-container/todo.container';

@Component({
  selector: 'app-todo-page',
  template: '<app-todo-container/>',
  imports: [TodoContainer],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoPage { }
