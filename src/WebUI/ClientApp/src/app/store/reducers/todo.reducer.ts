import { Action, createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { PriorityLevelDto, TodoItemDto, TodoListDto } from 'src/app/web-api-client';
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

	// List update
	on(todoActions.openListUpdateForm, (state): TodoModuleState => ({ ...state, listUpdateFormVisible: true })),
	on(todoActions.closeListUpdateForm, (state): TodoModuleState => ({ ...state, listUpdateFormVisible: false })),

	// List delete
	on(todoActions.openListDeleteForm, (state): TodoModuleState => ({ ...state, listDeleteFormVisible: true, listUpdateFormVisible: false })),
	on(todoActions.closeListDeleteForm, (state): TodoModuleState => ({ ...state, listDeleteFormVisible: false })),

	// Item Detail
	on(todoActions.openItemDetailForm, (state, { id }): TodoModuleState => ({ ...state, selectedItemId: id, itemDetailFormVisible: true })),
	on(todoActions.closeItemDetailForm, (state): TodoModuleState => ({ ...state, selectedItemId: null, itemDetailFormVisible: false })),

	on(todoActions.addListSuccess, (state, { dto }): TodoModuleState => {

		return produce(

			state,
			draft => {

				draft.entities[dto.id] = dto;
				draft.listCreateFormVisible = false;

			}

		);

	}),
	on(todoActions.addListFailure, (state, { error }): TodoModuleState => ({ ...state, error })),

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
	on(todoActions.updateListFailure, (state, { error }): TodoModuleState => ({ ...state, error })),

	on(todoActions.deleteListSuccess, (state, { id }): TodoModuleState => {

		return produce(

			state,
			draft => {

				delete draft.entities[id];
				draft.selectedListId = null;
				draft.listDeleteFormVisible = false;

			}

		);

	}),
	on(todoActions.deleteListFailure, (state, { error }): TodoModuleState => ({ ...state, error })),

	on(todoActions.addItemSuccess, (state, { listId, id, title }): TodoModuleState => {

		return produce(

			state,
			draft => {

				const listDto: TodoListDto = draft.entities[listId];
				const items: TodoItemDto[] = listDto.items ?? [];
				draft.entities[listId] = TodoListDto.fromJS({
					...listDto,
					items: [...items, TodoItemDto.fromJS({ listId, id, title, priority: 0, tagList: [] })]
				});

			}

		);

	}),
	on(todoActions.addItemFailure, (state, { error }): TodoModuleState => ({ ...state, error })),

	on(todoActions.updateItemSuccess, (state, { dto }): TodoModuleState => {

		return produce(

			state,
			draft => {

				const listId = dto.listId;
				const listDto: TodoListDto = draft.entities[listId];
				const items: TodoItemDto[] = listDto.items ?? [];

				if (items.length) {

					const curItems = items.filter(item => item.id !== dto.id);
					draft.entities[listId] = TodoListDto.fromJS({
						...listDto,
						items: [...curItems, dto]
					});

				} else
					draft.entities[listId] = TodoListDto.fromJS({
						...listDto,
						items: [dto]
					});
				draft.itemDetailFormVisible = false;

			}

		);

	}),
	on(todoActions.updateItemFailure, (state, { error }): TodoModuleState => ({ ...state, error })),


);

export function todoReducer(state: TodoModuleState | undefined, action: Action): TodoModuleState {
	return reducer(state, action);
}
