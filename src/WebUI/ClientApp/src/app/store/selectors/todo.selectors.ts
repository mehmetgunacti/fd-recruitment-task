import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListTitle } from 'src/app/components/list-titles/list-titles.component';
import { TagStat } from 'src/app/components/most-used-tags/most-used-tags.component';
import { TodoModuleState } from '../states/todo.state';

const selTodo_ModuleState = createFeatureSelector<TodoModuleState>('todo');

export const selTodo_lists = createSelector(

    selTodo_ModuleState,
    state => state.lists

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