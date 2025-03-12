import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddTodoItemComponent } from 'src/app/components/add-todo-item/add-todo-item.component';
import { DeleteListComponent } from 'src/app/components/delete-list/delete-list.component';
import { TagsComponent } from 'src/app/components/tags/tags.component';
import { TodoItemComponent } from 'src/app/components/todo-item/todo-item.component';
import { ItemDetailsFormComponent } from 'src/app/forms/item-details-form/item-details-form.component';
import { ListUpdateFormComponent } from 'src/app/forms/list-update-form/list-update-form.component';
import { todoActions } from 'src/app/store/actions/todo.actions';
import { selTodo_itemDetailFormVisible, selTodo_listDeleteFormVisible, selTodo_lists, selTodo_listTitles, selTodo_listUpdateFormVisible, selTodo_priorityLevels, selTodo_selectedItem, selTodo_selectedList, selTodo_tagStatsList } from 'src/app/store/selectors/todo.selectors';
import { CreateTodoItemCommand, TodoItemDto, TodoItemsClient, TodoListsClient, UpdateTodoListCommand } from 'src/app/web-api-client';

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

  protected selectedList = this.store.selectSignal(selTodo_selectedList); // <-- empty?
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

  protected onItemStateChanged({ id, newState }: { id: number, newState: boolean }): void {
    console.log(id, newState, 'stateChange');
  }

  protected onItemTitleChanged({ id, newTitle }: { id: number, newTitle: string }): void {
    console.log(id, newTitle, 'titleChange');
  }

  protected onOpenItemDetailForm(id: number): void {
    this.store.dispatch(todoActions.openItemDetailForm({ id }));
  }

  protected onItemDetailUpdate(dto: TodoItemDto): void {
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













  // updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
  //   const isNewItem = item.id === 0;

  //   if (!item.title.trim()) {
  //     // this.deleteItem(item);
  //     return;
  //   }

  //   if (item.id === 0) {
  //     this.itemsClient
  //       .create({
  //         ...item, listId: this.selectedList().id
  //       } as CreateTodoItemCommand)
  //       .subscribe(
  //         result => {
  //           item.id = result;
  //         },
  //         error => console.error(error)
  //       );
  //   } else {
  //     this.itemsClient.update(item.id, item).subscribe(
  //       () => console.log('Update succeeded.'),
  //       error => console.error(error)
  //     );
  //   }

  //   // this.selectedItem = null;

  //   if (isNewItem && pressedEnter) {
  //     setTimeout(() => this.addItem(), 250);
  //   }
  // }






  updateItemDetails(): void {

    // const item = new UpdateTodoItemDetailCommand(this.itemDetailsFormGroup.value);
    // this.itemsClient.updateItemDetails(this.selectedItem().id, item).subscribe(
    //   () => {
    //     if (this.selectedItem().listId !== item.listId) {
    //       this.selectedList().items = this.selectedList().items.filter(
    //         i => i.id !== this.selectedItem().id
    //       );
    //       const listIndex = this.lists().findIndex(
    //         l => l.id === item.listId
    //       );
    //       this.selectedItem().listId = item.listId;
    //       this.lists[listIndex].items.push(this.selectedItem());
    //     }
    //     this.selectedItem().priority = item.priority;
    //     this.selectedItem().note = item.note;
    //     this.selectedItem().bgColour = item.bgColour;
    //     this.selectedItem().tagList = item.tagList;
    //     // this.selectedListAllTags = reduceTags(this.selectedList().items);
    //     this.itemDetailsModalRef.hide();
    //     this.itemDetailsFormGroup.reset();
    //   },
    //   error => console.error(error)
    // );

  }

  // deleteItem(id: number, countDown?: boolean) { //item: TodoItemDto, countDown?: boolean) {
  //   const item = {} as TodoItemDto;
  //   if (countDown) {
  //     if (this.deleting) {
  //       // this.stopDeleteCountDown();
  //       return;
  //     }
  //     this.deleteCountDown = 3;
  //     this.deleting = true;
  //     this.deleteCountDownInterval = setInterval(() => {
  //       if (this.deleting && --this.deleteCountDown <= 0) {
  //         // this.deleteItem(item, false);
  //       }
  //     }, 1000);
  //     return;
  //   }
  //   this.deleting = false;
  //   if (this.itemDetailsModalRef) {
  //     this.itemDetailsModalRef.hide();
  //   }

  //   if (item.id === 0) {
  //     //const itemIndex = this.selectedList().items.indexOf(this.selectedItem());
  //     //this.selectedList().items.splice(itemIndex, 1);
  //   } else {
  //     this.itemsClient.delete(item.id).subscribe(
  //       () => (this.selectedList().items = this.selectedList().items.filter(t => t.id !== item.id)),
  //       error => console.error(error)
  //     );
  //   }
  //   // this.selectedListAllTags = reduceTags(this.selectedList().items);
  //   // this.itemDetailsFormGroup.reset();
  // }

}
