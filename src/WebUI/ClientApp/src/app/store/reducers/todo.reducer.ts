import { Action, createReducer, on } from '@ngrx/store';
import { PriorityLevelDto, TodoListDto } from 'src/app/web-api-client';
import { todoActions } from '../actions/todo.actions';
import { todo_initialState, TodoModuleState } from '../states/todo.state';

const reducer = createReducer(

	todo_initialState,
	on(todoActions.initLists, (state, { vm }): TodoModuleState => {

		const lists: TodoListDto[] = vm.lists ?? [];
		const priorityLevels: PriorityLevelDto[] = vm.priorityLevels ?? [];
		const newState: TodoModuleState = {
			lists,
			priorityLevels,
			selectedListId: lists[0]?.id ?? null,
			searchTerm: null,
			loading: false
		};
		return { ...state, ...newState };

	}),
	on(todoActions.search, (state, { searchTerm }): TodoModuleState => ({ ...state, searchTerm })),

);

export function todoReducer(state: TodoModuleState | undefined, action: Action): TodoModuleState {
	return reducer(state, action);
}
