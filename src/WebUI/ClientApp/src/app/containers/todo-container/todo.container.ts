import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ColourPickerComponent } from 'src/app/components/colour-picker/colour-picker.component';
import { ListTitlesComponent } from 'src/app/components/list-titles/list-titles.component';
import { MostUsedTagsComponent } from 'src/app/components/most-used-tags/most-used-tags.component';
import { SearchBoxComponent } from 'src/app/components/search-box/search-box.component';
import { TagInputComponent } from 'src/app/components/tag-input/tag-input.component';
import { todoActions } from 'src/app/store/actions/todo.actions';
import { selTodo_lists, selTodo_listTitles, selTodo_loading, selTodo_mostUsedTags } from 'src/app/store/selectors/todo.selectors';
import { CreateTodoItemCommand, CreateTodoListCommand, PriorityLevelDto, TodoItemDto, TodoItemsClient, TodoListDto, TodoListsClient, UpdateTodoItemDetailCommand, UpdateTodoListCommand } from 'src/app/web-api-client';

function reduceTags(items?: TodoItemDto[]): string[] {

  if (!items)
    return [];

  const uniqueTags = new Set<string>(
    items
      .map(item => item.tagList || [])
      .reduce((acc, cur) => acc.concat(cur), [])
  );

  return Array.from(uniqueTags);

}
function filterItems(tag: string, items?: TodoItemDto[]): TodoItemDto[] {

  return items?.filter(item => item.tagList?.includes(tag)) ?? [];

}

@Component({
  selector: 'app-todo-container',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe, TagInputComponent, SearchBoxComponent, ColourPickerComponent, MostUsedTagsComponent, ListTitlesComponent],
  templateUrl: './todo.container.html',
  styleUrl: './todo.container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoContainer {

  debug = false;
  deleting = false;
  deleteCountDown = 0;
  deleteCountDownInterval: any;
  priorityLevels: PriorityLevelDto[];

  selectedList: TodoListDto | null;
  selectedListAllTags: string[] = [];

  selectedItem: TodoItemDto;
  selectedItems: TodoItemDto[];

  mostUsedTagsMap: Record<string, number> = {};
  mostUsedTagsList: string[] = [];
  selectedTag: string | null = null;

  newListEditor: any = {};
  listOptionsEditor: any = {};
  newListModalRef: BsModalRef;
  listOptionsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  itemDetailsModalRef: BsModalRef;
  itemDetailsFormGroup = this.fb.group({
    id: [null],
    listId: [null],
    priority: [''],
    note: [''],
    bgColour: [null],
    tagList: [[]]
  });

  tagSuggestions = [];

  private store: Store = inject(Store);
  loading = this.store.selectSignal(selTodo_loading);
  lists = this.store.selectSignal(selTodo_lists);
  listTitles = this.store.selectSignal(selTodo_listTitles);
  mostUsedTags = this.store.selectSignal(selTodo_mostUsedTags);

  constructor(
    private listsClient: TodoListsClient,
    private itemsClient: TodoItemsClient,
    private modalService: BsModalService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.listsClient.get().subscribe({
      next: vm => {
        // this.lists = vm.lists;
        this.priorityLevels = vm.priorityLevels;
        this.selectList(this.lists[0]);
        this.store.dispatch(todoActions.initLists({ vm }));
      },
      error: error => console.error(error)
    });

  }

  onSearch(searchTerm: string): void {

    this.store.dispatch(todoActions.search({ searchTerm }));

  }

  onSelectList(id: number): void {

    this.store.dispatch(todoActions.selectList({ id }));

  }

  // Lists
  selectList(list?: TodoListDto): void {

    if (!!list) {

      this.selectedListAllTags = reduceTags(list.items);
      this.selectedList = list;
      this.selectedItems = list.items ?? [];
      this.selectedTag = null;

    } else
      this.selectedList = null;

  }

  remainingItems(list: TodoListDto): number {
    return list.items.filter(t => !t.done).length;
  }

  showNewListModal(template: TemplateRef<any>): void {
    this.newListModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  newListCancelled(): void {
    this.newListModalRef.hide();
    this.newListEditor = {};
  }

  addList(): void {
    const list = {
      id: 0,
      title: this.newListEditor.title,
      items: []
    } as TodoListDto;

    this.listsClient.create(list as CreateTodoListCommand).subscribe(
      result => {
        list.id = result;
        // this.lists.push(list);
        this.selectedList = list;
        this.newListModalRef.hide();
        this.newListEditor = {};
      },
      error => {
        const errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          this.newListEditor.error = errors.Title[0];
        }

        setTimeout(() => document.getElementById('title').focus(), 250);
      }
    );
  }

  showListOptionsModal(template: TemplateRef<any>) {
    this.listOptionsEditor = {
      id: this.selectedList.id,
      title: this.selectedList.title
    };

    this.listOptionsModalRef = this.modalService.show(template);
  }

  updateListOptions() {
    const list = this.listOptionsEditor as UpdateTodoListCommand;
    this.listsClient.update(this.selectedList.id, list).subscribe(
      () => {
        (this.selectedList.title = this.listOptionsEditor.title),
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

  deleteListConfirmed(): void {
    this.listsClient.delete(this.selectedList.id).subscribe(
      () => {
        this.deleteListModalRef.hide();
        // this.lists = this.lists.filter(t => t.id !== this.selectedList.id);
        this.selectedList = this.lists.length ? this.lists[0] : null;
      },
      error => console.error(error)
    );
  }

  // Items
  selectTag(tag: string): void { }

  search(val: string): void {

    this.selectedTag = null;
    const term = val.trim().toLowerCase();
    if (term.length === 0)
      this.selectedItems = this.selectedList?.items ?? [];
    else
      this.selectedItems = this.selectedList?.items?.filter(item => (item.title ?? '').toLowerCase().indexOf(term) >= 0) ?? [];

  }

  showItemDetailsModal(template: TemplateRef<any>, item: TodoItemDto): void {

    this.selectedItem = item;
    this.itemDetailsFormGroup.reset();
    this.itemDetailsFormGroup.patchValue(this.selectedItem);

    this.itemDetailsModalRef = this.modalService.show(template);
    this.itemDetailsModalRef.onHidden.subscribe(() => {
      this.stopDeleteCountDown();
    });

  }

  updateItemDetails(): void {

    const item = new UpdateTodoItemDetailCommand(this.itemDetailsFormGroup.value);
    this.itemsClient.updateItemDetails(this.selectedItem.id, item).subscribe(
      () => {
        if (this.selectedItem.listId !== item.listId) {
          this.selectedList.items = this.selectedList.items.filter(
            i => i.id !== this.selectedItem.id
          );
          const listIndex = this.lists().findIndex(
            l => l.id === item.listId
          );
          this.selectedItem.listId = item.listId;
          this.lists[listIndex].items.push(this.selectedItem);
        }
        this.selectedItem.priority = item.priority;
        this.selectedItem.note = item.note;
        this.selectedItem.bgColour = item.bgColour;
        this.selectedItem.tagList = item.tagList;
        this.selectedListAllTags = reduceTags(this.selectedList.items);
        this.itemDetailsModalRef.hide();
        this.itemDetailsFormGroup.reset();
      },
      error => console.error(error)
    );

  }

  addItem() {
    const item = {
      id: 0,
      listId: this.selectedList.id,
      priority: this.priorityLevels[0].value,
      title: '',
      done: false
    } as TodoItemDto;

    this.selectedList.items.push(item);
    const index = this.selectedList.items.length - 1;
    this.editItem(item, 'itemTitle' + index);
  }

  editItem(item: TodoItemDto, inputId: string): void {
    this.selectedItem = item;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
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
          ...item, listId: this.selectedList.id
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

  deleteItem(item: TodoItemDto, countDown?: boolean) {
    if (countDown) {
      if (this.deleting) {
        this.stopDeleteCountDown();
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
      const itemIndex = this.selectedList.items.indexOf(this.selectedItem);
      this.selectedList.items.splice(itemIndex, 1);
    } else {
      this.itemsClient.delete(item.id).subscribe(
        () => (this.selectedList.items = this.selectedList.items.filter(t => t.id !== item.id)),
        error => console.error(error)
      );
    }
    this.selectedListAllTags = reduceTags(this.selectedList.items);
    this.itemDetailsFormGroup.reset();
  }

  stopDeleteCountDown() {
    clearInterval(this.deleteCountDownInterval);
    this.deleteCountDown = 0;
    this.deleting = false;
  }

  onTagInput(tag: string) {
    this.tagSuggestions = this.selectedListAllTags.filter(t => t.startsWith(tag));
  }

}
