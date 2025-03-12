import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TagStat } from 'src/app/components/most-used-tags/most-used-tags.component';
import { ListTitle } from 'src/app/models/list-title.model';
import { TodoItemDto } from 'src/app/web-api-client';
import { TodoModuleState } from '../states/todo.state';

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

export const selTodo_selectedItemId = createSelector(

    selTodo_ModuleState,
    state => state.selectedItemId

);

export const selTodo_loading = createSelector(

    selTodo_ModuleState,
    state => state.loading

);

export const selTodo_selectedList = createSelector(

    selTodo_lists,
    selTodo_selectedListId,
    (lists, selectedListId) => lists.find(list => list.id === selectedListId) ?? null

);

export const selTodo_selectedItem = createSelector(

    selTodo_selectedList,
    selTodo_selectedItemId,
    (list, selectedItemId) => selectedItemId ? list.items?.find(item => item.id === selectedItemId) ?? null : null

);

export const selTodo_listTitles = createSelector(

    selTodo_lists,
    lists => lists.map((dto): ListTitle => ({

        id: dto.id,
        name: dto.title,
        count: dto.items.filter(t => !t.done).length

    }))

);

export const selTodo_tagStatsList = createSelector(

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
                .map(tag => ({ tag, count: result[tag] }));
        return tagStatList;

    }

);

export const selTodo_searchTerm = createSelector(

    selTodo_ModuleState,
    state => state.searchTerm

);

export const selTodo_listCreateFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.listCreateFormVisible

);

export const selTodo_listUpdateFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.listUpdateFormVisible

);

export const selTodo_listDeleteFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.listDeleteFormVisible

);

export const selTodo_itemDetailFormVisible = createSelector(

    selTodo_ModuleState,
    state => state.itemDetailFormVisible

);