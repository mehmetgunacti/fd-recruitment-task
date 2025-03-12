import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TagInputComponent } from 'src/app/components/tag-input/tag-input.component';
import { ListUpdateFormComponent } from 'src/app/forms/list-update-form/list-update-form.component';
import { todoActions } from 'src/app/store/actions/todo.actions';
import { selTodo_lists, selTodo_listUpdateFormVisible, selTodo_priorityLevels, selTodo_selectedList, selTodo_selectedListAllTags } from 'src/app/store/selectors/todo.selectors';
import { CreateTodoItemCommand, TodoItemDto, TodoItemsClient, TodoListsClient, UpdateTodoItemDetailCommand, UpdateTodoListCommand } from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-list-container',
  imports: [FormsModule, ReactiveFormsModule, TagInputComponent, ListUpdateFormComponent, JsonPipe],
  templateUrl: './todo-list.container.html',
  styleUrl: './todo-list.container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListContainer {

  private store: Store = inject(Store);
  private modalService = inject(BsModalService);

  protected selectedList = this.store.selectSignal(selTodo_selectedList); // <-- empty?
  protected selectedListAllTags = this.store.selectSignal(selTodo_selectedListAllTags);

  protected selectedItems = computed(() => this.selectedList().items ?? []);
  protected selectedItem = computed(() => this.selectedItems()[0]);

  protected selectedTag = signal<string | null>(null);

  // list update form modal
  protected listUpdateFormTemplateRef = viewChild.required<TemplateRef<{}>>('listOptionsModalTemplate');
  protected listUpdateFormVisible = this.store.selectSignal(selTodo_listUpdateFormVisible);
  protected listUpdateFormModalRef: BsModalRef | null;

  constructor() {

    effect(() => {

      // show / hide list update form
      const visible = this.listUpdateFormVisible();
      if (visible)
        this.listUpdateFormModalRef = this.modalService.show(this.listUpdateFormTemplateRef());
      else {
        this.listUpdateFormModalRef?.hide();
        this.listUpdateFormModalRef = null;
      }

    });

  }

  onUpdateList(id: number, title: string): void {

    this.store.dispatch(todoActions.updateList({ id, title }));

  }

  onOpenListUpdateForm(): void {

    this.store.dispatch(todoActions.openListUpdateForm());

  }

  onCloseListUpdateForm(): void {

    this.store.dispatch(todoActions.closeListUpdateForm());

  }


  private fb = inject(UntypedFormBuilder);
  private itemsClient = inject(TodoItemsClient);
  private listsClient = inject(TodoListsClient);



  // ------------------
  listOptionsModalRef: BsModalRef;
  itemDetailsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  listOptionsEditor: any = {};
  itemDetailsFormGroup = this.fb.group({
    id: [null],
    listId: [null],
    priority: [''],
    note: [''],
    bgColour: [null],
    tagList: [[]]
  });
  lists = this.store.selectSignal(selTodo_lists);
  priorityLevels = this.store.selectSignal(selTodo_priorityLevels);
  tagSuggestions = [];
  deleting = false;
  deleteCountDown = 3;
  deleteCountDownInterval: any;
  // ------------------

  showListOptionsModal(a: any): void { }

  selectTag(tag: string): void {

    this.selectedTag.set(tag);

  }

  updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
    const isNewItem = item.id === 0;

    if (!item.title.trim()) {
      this.deleteItem(item);
      return;
    }

    if (item.id === 0) {
      this.itemsClient
        .create({
          ...item, listId: this.selectedList().id
        } as CreateTodoItemCommand)
        .subscribe(
          result => {
            item.id = result;
          },
          error => console.error(error)
        );
    } else {
      this.itemsClient.update(item.id, item).subscribe(
        () => console.log('Update succeeded.'),
        error => console.error(error)
      );
    }

    this.selectedItem = null;

    if (isNewItem && pressedEnter) {
      setTimeout(() => this.addItem(), 250);
    }
  }

  editItem(item: TodoItemDto, inputId: string): void {
    // this.selectedItem = item;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  showItemDetailsModal(template: TemplateRef<any>, item: TodoItemDto): void {

    // this.selectedItem = item;
    this.itemDetailsFormGroup.reset();
    this.itemDetailsFormGroup.patchValue(this.selectedItem);

    this.itemDetailsModalRef = this.modalService.show(template);
    this.itemDetailsModalRef.onHidden.subscribe(() => {
      // this.stopDeleteCountDown();
    });

  }

  addItem() {
    const item = {
      id: 0,
      listId: this.selectedList().id,
      priority: this.priorityLevels[0].value,
      title: '',
      done: false
    } as TodoItemDto;

    this.selectedList().items.push(item);
    const index = this.selectedList().items.length - 1;
    this.editItem(item, 'itemTitle' + index);
  }

  updateListOptions() {
    const list = this.listOptionsEditor as UpdateTodoListCommand;
    this.listsClient.update(this.selectedList().id, list).subscribe(
      () => {
        (this.selectedList().title = this.listOptionsEditor.title),
          this.listOptionsModalRef.hide();
        this.listOptionsEditor = {};
      },
      error => console.error(error)
    );
  }

  confirmDeleteList(template: TemplateRef<any>) {
    this.listOptionsModalRef.hide();
    this.deleteListModalRef = this.modalService.show(template);
  }

  onTagInput(tag: string) {
    this.tagSuggestions = this.selectedListAllTags().filter(t => t.startsWith(tag));
  }

  updateItemDetails(): void {

    const item = new UpdateTodoItemDetailCommand(this.itemDetailsFormGroup.value);
    this.itemsClient.updateItemDetails(this.selectedItem().id, item).subscribe(
      () => {
        if (this.selectedItem().listId !== item.listId) {
          this.selectedList().items = this.selectedList().items.filter(
            i => i.id !== this.selectedItem().id
          );
          const listIndex = this.lists().findIndex(
            l => l.id === item.listId
          );
          this.selectedItem().listId = item.listId;
          this.lists[listIndex].items.push(this.selectedItem());
        }
        this.selectedItem().priority = item.priority;
        this.selectedItem().note = item.note;
        this.selectedItem().bgColour = item.bgColour;
        this.selectedItem().tagList = item.tagList;
        // this.selectedListAllTags = reduceTags(this.selectedList().items);
        this.itemDetailsModalRef.hide();
        this.itemDetailsFormGroup.reset();
      },
      error => console.error(error)
    );

  }

  deleteItem(item: TodoItemDto, countDown?: boolean) {
    if (countDown) {
      if (this.deleting) {
        // this.stopDeleteCountDown();
        return;
      }
      this.deleteCountDown = 3;
      this.deleting = true;
      this.deleteCountDownInterval = setInterval(() => {
        if (this.deleting && --this.deleteCountDown <= 0) {
          this.deleteItem(item, false);
        }
      }, 1000);
      return;
    }
    this.deleting = false;
    if (this.itemDetailsModalRef) {
      this.itemDetailsModalRef.hide();
    }

    if (item.id === 0) {
      const itemIndex = this.selectedList().items.indexOf(this.selectedItem());
      this.selectedList().items.splice(itemIndex, 1);
    } else {
      this.itemsClient.delete(item.id).subscribe(
        () => (this.selectedList().items = this.selectedList().items.filter(t => t.id !== item.id)),
        error => console.error(error)
      );
    }
    // this.selectedListAllTags = reduceTags(this.selectedList().items);
    this.itemDetailsFormGroup.reset();
  }

  deleteListConfirmed(): void {
    this.listsClient.delete(this.selectedList().id).subscribe(
      () => {
        this.deleteListModalRef.hide();
        // this.lists = this.lists.filter(t => t.id !== this.selectedList.id);
        this.selectedList = this.lists.length ? this.lists[0] : null;
      },
      error => console.error(error)
    );
  }

}
