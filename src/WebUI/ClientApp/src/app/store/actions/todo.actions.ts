import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TodoListDto, TodosVm } from 'src/app/web-api-client';

export const todoActions = createActionGroup({

    source: 'Todo',
    events: {

        selectList      : props<{ id: number }>(),
        search          : props<{ searchTerm: string | null }>(),

        // List Create Form
        openListCreateForm : emptyProps(),
        closeListCreateForm: emptyProps(),

        // List Update Form
        openListUpdateForm : emptyProps(),
        closeListUpdateForm: emptyProps(),

        // List Delete Form
        openListDeleteForm : emptyProps(),
        closeListDeleteForm: emptyProps(),

        getLists        : emptyProps(),
        getListsSuccess : props<{ vm: TodosVm }>(),
        getListsFailure : props<{ error: string }>(),

        // create list dto
        addList         : props<{ title: string }>(),
        addListSuccess  : props<{ dto: TodoListDto }>(),
        addListFailure  : props<{ error: string }>(),

        // update list dto
        updateList         : props<{ id: number, title: string }>(),
        updateListSuccess  : props<{ id: number, title: string }>(),
        updateListFailure  : props<{ error: string }>(),

        // delete list dto
        deleteList         : props<{ id: number }>(),
        deleteListSuccess  : props<{ id: number }>(),
        deleteListFailure  : props<{ error: string }>(),

        // add item dto
        addItem         : props<{ listId: number, title: string }>(),
        addItemSuccess  : props<{ listId: number, id: number, title: string }>(),
        addItemFailure  : props<{ error: string }>(),

    }

});