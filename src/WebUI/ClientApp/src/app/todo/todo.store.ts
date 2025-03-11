import { computed, InjectionToken, Signal } from '@angular/core';
import { patchState, SignalState, signalState } from '@ngrx/signals';
import { PriorityLevelDto, TodoItemDto, TodoListDto, TodosVm } from '../web-api-client';
import { TagStat } from './most-used-tags/most-used-tags.component';
import { ListTitle } from './list-titles/list-titles.component';

interface TodoState {

    lists: TodoListDto[];
    priorityLevels: PriorityLevelDto[];
    selectedListId: number | null;
    searchTerm: string | null;

    loading: boolean;

}

export interface TodoStore {

    lists: Signal<TodoListDto[]>;
    priorityLevels: Signal<PriorityLevelDto[]>;

    selectedList: Signal<TodoListDto | null>;

    listTitles: Signal<ListTitle[]>;
    mostUsedTags: Signal<TagStat[]>;

    loading: Signal<boolean>;

    initState(vm: TodosVm): void;
    selectList(id: number | null): void;

}

export class TodoStoreImpl implements TodoStore {

    private state: SignalState<TodoState> = signalState<TodoState>({

        lists: [],
        priorityLevels: [],
        selectedListId: null,
        searchTerm: null,
        loading: true

    });

    lists = computed(() => this.state().lists); // add search
    priorityLevels = this.state.priorityLevels;
    loading = this.state.loading;
    selectedList = computed(() => this.lists().find(list => list.id === this.state.selectedListId()));

    listTitles = computed(() => {

        const selectedListId = this.state.selectedListId();
        const titles: ListTitle[] = this.lists().map(dto => ({

            id: dto.id,
            name: dto.title,
            count: dto.items.filter(t => !t.done).length,
            selected: dto.id === selectedListId

        }));
        return titles;

    });

    mostUsedTags = computed(() => {

        const result: Record<string, number> = {};
        const lists = this.lists();

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

    });

    initState(vm: TodosVm): void {

        const lists: TodoListDto[] = vm.lists ?? [];
        const priorityLevels: PriorityLevelDto[] = vm.priorityLevels ?? [];
        const newState: TodoState = {
            lists,
            priorityLevels,
            selectedListId: lists[0]?.id ?? null,
            searchTerm: null,
            loading: false
        };
        patchState(this.state, newState);

    }

    selectList(id: number | null): void {

        patchState(this.state, { selectedListId: id });

    }

}

export const TODO_STORE = new InjectionToken<TodoStoreImpl>('TODO_STORE');