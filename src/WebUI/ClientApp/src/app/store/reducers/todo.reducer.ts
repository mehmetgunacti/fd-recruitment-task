import { Action, createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { PriorityLevelDto, TodoListDto } from 'src/app/web-api-client';
import { todoActions } from '../actions/todo.actions';
import { todo_initialState, TodoModuleState } from '../states/todo.state';

const reducer = createReducer(

	todo_initialState,
	on(todoActions.getListsSuccess, (state, { vm }): TodoModuleState => {

		const lists: TodoListDto[] = vm.lists ?? [];
		const priorityLevels: PriorityLevelDto[] = vm.priorityLevels ?? [];
		const newState: Partial<TodoModuleState> = {
			entities: lists.reduce((acc, cur) => { acc[cur.id] = cur; return acc; }, {}),
			priorityLevels,
			selectedListId: lists[0]?.id ?? null,
			searchTerm: null,
			loading: false,
		};
		return { ...state, ...newState };

	}),
	on(todoActions.search, (state, { searchTerm }): TodoModuleState => ({ ...state, searchTerm })),
	on(todoActions.selectList, (state, { id }): TodoModuleState => ({ ...state, selectedListId: id })),

	// List create
	on(todoActions.openListCreateForm, (state): TodoModuleState => ({ ...state, listCreateFormVisible: true })),
	on(todoActions.closeListCreateForm, (state): TodoModuleState => ({ ...state, listCreateFormVisible: false })),

	on(todoActions.addListSuccess, (state, { dto }): TodoModuleState => {

		return produce(

			state,
			draft => {

				draft.entities[dto.id] = dto;
				draft.listCreateFormVisible = false;

			}

		);

	}),
	on(todoActions.addListFailure, (state, { error }): TodoModuleState => ({ ...state, listCreateFormError: error })),

	// List update
	on(todoActions.openListUpdateForm, (state): TodoModuleState => ({ ...state, listUpdateFormVisible: true })),
	on(todoActions.closeListUpdateForm, (state): TodoModuleState => ({ ...state, listUpdateFormVisible: false })),

	on(todoActions.updateListSuccess, (state, { id, title }): TodoModuleState => {

		return produce(

			state,
			draft => {

				const e = draft.entities[id];
				if (e)
					draft.entities[id] = { ...e, title };
				draft.listUpdateFormVisible = false;

			}

		);

	}),
	on(todoActions.updateListFailure, (state, { error }): TodoModuleState => ({ ...state, listUpdateFormError: error })),

);

export function todoReducer(state: TodoModuleState | undefined, action: Action): TodoModuleState {
	return reducer(state, action);
}
