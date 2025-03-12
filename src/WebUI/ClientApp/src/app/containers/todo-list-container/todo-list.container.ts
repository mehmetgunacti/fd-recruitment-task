import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddTodoItemComponent } from 'src/app/components/add-todo-item/add-todo-item.component';
import { DeleteListComponent } from 'src/app/components/delete-list/delete-list.component';
import { TagsComponent } from 'src/app/components/tags/tags.component';
import { TodoItemComponent } from 'src/app/components/todo-item/todo-item.component';
import { ItemDetailsFormComponent } from 'src/app/forms/item-details-form/item-details-form.component';
import { ListUpdateFormComponent } from 'src/app/forms/list-update-form/list-update-form.component';
import { todoActions } from 'src/app/store/actions/todo.actions';
import { selTodo_itemDetailFormVisible, selTodo_listDeleteFormVisible, selTodo_listTitles, selTodo_listUpdateFormVisible, selTodo_priorityLevels, selTodo_selectedItem, selTodo_selectedList, selTodo_tagStatsList } from 'src/app/store/selectors/todo.selectors';
import { TodoItemDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-list-container',
  imports: [FormsModule, ReactiveFormsModule, ListUpdateFormComponent, TodoItemComponent, AddTodoItemComponent, DeleteListComponent, TagsComponent, ItemDetailsFormComponent],
  templateUrl: './todo-list.container.html',
  styleUrl: './todo-list.container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListContainer {

  private store: Store = inject(Store);
  private modalService = inject(BsModalService);

  protected selectedList = this.store.selectSignal(selTodo_selectedList);
  protected tagStatsList = this.store.selectSignal(selTodo_tagStatsList);

  protected selectedListItems = computed(() => this.selectedList().items ?? []);
  protected selectedItem = this.store.selectSignal(selTodo_selectedItem);
  protected listTitles = this.store.selectSignal(selTodo_listTitles);
  protected priorityLevels = this.store.selectSignal(selTodo_priorityLevels);

  protected tagSuggestions = signal<string[]>([]);

  // list update form modal
  protected listUpdateFormTemplateRef = viewChild.required<TemplateRef<{}>>('listOptionsModalTemplate');
  protected listUpdateFormVisible = this.store.selectSignal(selTodo_listUpdateFormVisible);
  protected listUpdateFormModalRef: BsModalRef | null;

  // list delete form modal
  protected listDeleteFormTemplateRef = viewChild.required<TemplateRef<{}>>('listDeleteModalTemplate');
  protected listDeleteFormVisible = this.store.selectSignal(selTodo_listDeleteFormVisible);
  protected listDeleteFormModalRef: BsModalRef | null;

  // item detail form modal
  protected itemDetailFormTemplateRef = viewChild.required<TemplateRef<{}>>('itemDetailsModalTemplate');
  protected itemDetailFormVisible = this.store.selectSignal(selTodo_itemDetailFormVisible);
  protected itemDetailFormModalRef: BsModalRef | null;

  constructor() {

    // show / hide List Update Form
    effect(() => {

      const visible = this.listUpdateFormVisible();
      if (visible)
        this.listUpdateFormModalRef = this.modalService.show(this.listUpdateFormTemplateRef());
      else {
        this.listUpdateFormModalRef?.hide();
        this.listUpdateFormModalRef = null;
      }

    });

    // show / hide List Delete Form
    effect(() => {

      const visible = this.listDeleteFormVisible();
      if (visible)
        this.listDeleteFormModalRef = this.modalService.show(this.listDeleteFormTemplateRef());
      else {
        this.listDeleteFormModalRef?.hide();
        this.listDeleteFormModalRef = null;
      }

    });

    // show / hide Item Detail Form
    effect(() => {

      const visible = this.itemDetailFormVisible();
      if (visible)
        this.itemDetailFormModalRef = this.modalService.show(this.itemDetailFormTemplateRef());
      else {
        this.itemDetailFormModalRef?.hide();
        this.itemDetailFormModalRef = null;
      }

    });

  }

  protected onItemAdd(title: string): void {
    this.store.dispatch(todoActions.addItem({ listId: this.selectedList().id, title }));
  }

  protected onUpdateList(id: number, title: string): void {
    this.store.dispatch(todoActions.updateList({ id, title }));
  }

  protected onOpenListUpdateForm(): void {
    this.store.dispatch(todoActions.openListUpdateForm());
  }

  protected onCloseListUpdateForm(): void {
    this.store.dispatch(todoActions.closeListUpdateForm());
  }

  protected onDeleteList(): void {
    this.store.dispatch(todoActions.openListDeleteForm());
  }


  protected onItemTitleChanged({ id, newTitle }: { id: number, newTitle: string }): void {
    
  }

  protected onOpenItemDetailForm(id: number): void {
    this.store.dispatch(todoActions.openItemDetailForm({ id }));
  }

  // update dto
  protected onItemDetailUpdate(dto: TodoItemDto): void {
    this.store.dispatch(todoActions.updateItemDetail({ dto }));
  }

  // updates only title & done
  protected onItemUpdate(dto: TodoItemDto): void {
    this.store.dispatch(todoActions.updateItem({ dto }));
  }

  protected onItemDetailCancel(): void {
    this.store.dispatch(todoActions.closeItemDetailForm());
  }

  protected onItemDetailDelete(): void {
    console.log('item detail delete...');
  }

  protected onItemDetailTagInput(tag: string | null): void {

    this.tagSuggestions.update(tags => {

      if (!tag)
        return [];
      return this.tagStatsList()
        .map(stat => stat.tag)
        .filter(t => t.startsWith(tag));

    });

  }

  protected onDeleteListConfirmed(): void {
    this.store.dispatch(todoActions.deleteList({ id: this.selectedList().id }));
  }
  protected onDeleteListRejected(): void {
    this.store.dispatch(todoActions.closeListDeleteForm());
  }

  protected onTagSelected(tag: string): void {
    console.log('tag selected', tag);
  }

}
