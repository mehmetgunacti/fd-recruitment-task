import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListTitle } from 'src/app/components/list-titles/list-titles.component';
import { TagStat } from 'src/app/components/most-used-tags/most-used-tags.component';
import { TodoModuleState } from '../states/todo.state';
import { TodoItemDto } from 'src/app/web-api-client';

const selTodo_ModuleState = createFeatureSelector<TodoModuleState>('todo');

export const selTodo_lists = createSelector(

    selTodo_ModuleState,
    state => Object.values(state.entities)

);

export const selTodo_priorityLevels = createSelector(

    selTodo_ModuleState,
    state => state.priorityLevels

);

export const selTodo_selectedListId = createSelector(

    selTodo_ModuleState,
    state => state.selectedListId

);

export const selTodo_loading = createSelector(

    selTodo_ModuleState,
    state => state.loading

);

export const selTodo_selectedList = createSelector(

    selTodo_lists,
    selTodo_selectedListId,
    (lists, selectedListId) => lists.find(list => list.id === selectedListId)

);

export const selTodo_listTitles = createSelector(

    selTodo_lists,
    selTodo_selectedListId,
    (lists, selectedListId) => {

        const titles: ListTitle[] = lists.map(dto => ({

            id: dto.id,
            name: dto.title,
            count: dto.items.filter(t => !t.done).length,
            selected: dto.id === selectedListId

        }));
        return titles;

    }

);

export const selTodo_mostUsedTags = createSelector(

    selTodo_lists,
    lists => {

        const result: Record<string, number> = {};
        lists.forEach(list => {

            if (!list.items)
                return;

            list.items.forEach(item => {

                if (!item.tagList)
                    return;

                item.tagList.forEach(tag => {
                    result[tag] = (result[tag] || 0) + 1;
                });

            });

        });
        const tagStatList: TagStat[] =
            Object
                .keys(result)
                .map(tag => ({ tag, count: result[tag] }))
                .filter(stat => stat.count > 1);
        return tagStatList;

    }

);

export const selTodo_searchTerm = createSelector(

    selTodo_ModuleState,
    state => state.searchTerm

);

export const selTodo_selectedListAllTags = createSelector(

    selTodo_selectedList,
    list => {

        if (!list.items)
            return [];

        const uniqueTags = new Set<string>(
            list.items
                .map(item => item.tagList || [])
                .reduce((acc, cur) => acc.concat(cur), [])
        );

        return Array.from(uniqueTags);

    }

);

export const selTodo_listCreateFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.listCreateFormVisible

);

export const selTodo_listUpdateFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.listUpdateFormVisible

);

function search(val: string): void {

    this.selectedTag = null;
    const term = val.trim().toLowerCase();
    if (term.length === 0)
        this.selectedItems = this.selectedList?.items ?? [];
    else
        this.selectedItems = this.selectedList?.items?.filter(item => (item.title ?? '').toLowerCase().indexOf(term) >= 0) ?? [];

}

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