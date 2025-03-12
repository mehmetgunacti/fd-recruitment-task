import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListTitlesComponent } from 'src/app/components/list-titles/list-titles.component';
import { MostUsedTagsComponent } from 'src/app/components/most-used-tags/most-used-tags.component';
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component';
import { NewListFormComponent } from 'src/app/forms/new-list-form/new-list-form.component';
import { todoActions } from 'src/app/store/actions/todo.actions';
import { selTodo_listCreateFormVisible, selTodo_lists, selTodo_listTitles, selTodo_loading, selTodo_selectedListId, selTodo_tagStatsList } from 'src/app/store/selectors/todo.selectors';
import { TodoListContainer } from '../todo-list-container/todo-list.container';

@Component({
  selector: 'app-todo-container',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SearchBoxComponent, MostUsedTagsComponent, ListTitlesComponent, TodoListContainer, NewListFormComponent],
  templateUrl: './todo.container.html',
  styleUrl: './todo.container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoContainer {

  private store: Store = inject(Store);
  private modalService = inject(BsModalService);

  protected loading = this.store.selectSignal(selTodo_loading);
  protected lists = this.store.selectSignal(selTodo_lists);
  protected listTitles = this.store.selectSignal(selTodo_listTitles);
  protected selectedListId = this.store.selectSignal(selTodo_selectedListId);
  protected tagStatsList = this.store.selectSignal(selTodo_tagStatsList);

  // list create form modal
  protected listCreateFormTemplateRef = viewChild.required<TemplateRef<{}>>('listCreateFormModalTemplate');
  protected listCreateFormFormVisible = this.store.selectSignal(selTodo_listCreateFormVisible);
  protected listCreateFormModalRef: BsModalRef | null;

  constructor() {

    effect(() => {

      // show / hide list create form
      const visible = this.listCreateFormFormVisible();
      if (visible)
        this.listCreateFormModalRef = this.modalService.show(this.listCreateFormTemplateRef());
      else {
        this.listCreateFormModalRef?.hide();
        this.listCreateFormModalRef = null;
      }

    });

  }

  ngOnInit(): void {

    this.store.dispatch(todoActions.getLists());

  }

  onSearch(searchTerm: string): void {

    this.store.dispatch(todoActions.search({ searchTerm }));

  }

  onSelectList(id: number): void {

    this.store.dispatch(todoActions.selectList({ id }));

  }

  onAddList(title: string): void {

    this.store.dispatch(todoActions.addList({ title }));

  }

  onOpenListCreateModal(): void {

    this.store.dispatch(todoActions.openListCreateForm());

  }

  onCloseListCreateForm(): void {

    this.store.dispatch(todoActions.closeListCreateForm());

  }

}