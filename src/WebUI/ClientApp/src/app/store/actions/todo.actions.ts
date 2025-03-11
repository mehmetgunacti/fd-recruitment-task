import { createActionGroup, props } from '@ngrx/store';
import { TodosVm } from 'src/app/web-api-client';

export const todoActions = createActionGroup({

    source: 'Todo',
    events: {

        initLists   : props<{ vm: TodosVm }>(),
        selectList  : props<{ id: number }>(),
        search      : props<{ searchTerm: string | null }>(),

    }

});