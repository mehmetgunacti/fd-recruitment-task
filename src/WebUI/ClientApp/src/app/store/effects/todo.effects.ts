import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { CreateTodoListCommand, TodoListDto, TodoListsClient, UpdateTodoListCommand } from 'src/app/web-api-client';
import { todoActions } from '../actions/todo.actions';

@Injectable()
export class TodoEffects {

    private actions$: Actions = inject(Actions);
    private listsClient = inject(TodoListsClient);

    getLists$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.getLists),
            switchMap(

                () => this.listsClient.get().pipe(

                    map(vm => todoActions.getListsSuccess({ vm })),
                    catchError((error) => of(todoActions.getListsFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

    addList$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.addList),
            exhaustMap(

                ({ title }) => this.listsClient.create(new CreateTodoListCommand({ title })).pipe(

                    map(id => todoActions.addListSuccess({
                        dto: new TodoListDto({ id, title, items: [] })
                    })),
                    catchError((error) => of(todoActions.addListFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

    updateList$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.updateList),
            exhaustMap(

                ({ id, title }) => this.listsClient.update(id, new UpdateTodoListCommand({ id, title })).pipe(

                    map(() => todoActions.updateListSuccess({ id, title })),
                    catchError((error) => of(todoActions.updateListFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

}
