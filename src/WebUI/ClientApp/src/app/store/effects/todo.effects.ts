import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { CreateTodoItemCommand, CreateTodoListCommand, TodoItemsClient, TodoListDto, TodoListsClient, UpdateTodoListCommand } from 'src/app/web-api-client';
import { todoActions } from '../actions/todo.actions';

@Injectable()
export class TodoEffects {

    private actions$: Actions = inject(Actions);
    private listsClient = inject(TodoListsClient);
    private itemsClient = inject(TodoItemsClient);

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

                ({ title }) => this.listsClient.create(CreateTodoListCommand.fromJS({ title })).pipe(

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

                ({ id, title }) => this.listsClient.update(id, UpdateTodoListCommand.fromJS({ id, title })).pipe(

                    map(() => todoActions.updateListSuccess({ id, title })),
                    catchError((error) => of(todoActions.updateListFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

    deleteList$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.deleteList),
            exhaustMap(

                ({ id }) => this.listsClient.delete(id).pipe(

                    map(() => todoActions.deleteListSuccess({ id })),
                    catchError((error) => of(todoActions.deleteListFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

    addItem$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.addItem),
            exhaustMap(

                ({ listId, title }) => this.itemsClient.create(CreateTodoItemCommand.fromJS({ listId, title })).pipe(

                    map(id => todoActions.addItemSuccess({ listId, id, title })),
                    catchError((error) => of(todoActions.addItemFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

    updateItem$ = createEffect(

        () => this.actions$.pipe(

            ofType(todoActions.updateItem),
            exhaustMap(

                ({ dto }) => this.itemsClient.updateItemDetails(dto.id, dto).pipe(

                    map(() => todoActions.updateItemSuccess({dto})),
                    catchError((error) => of(todoActions.updateItemFailure({ error: JSON.parse(error.response) })))

                )
            ),

        )

    );

}
