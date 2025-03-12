import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "./states/app.state";
import { todoReducer } from "./reducers/todo.reducer";
import { environment } from "src/environments/environment";
import { TodoEffects } from "./effects/todo.effects";

export const effectList = [

    TodoEffects

];

export const reducerList: ActionReducerMap<AppState> = {

    todo: todoReducer

}

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {

    return function (state, action) {

        console.groupCollapsed('Incoming Action: %c' + action.type, 'color:rgb(104, 94, 243); font-weight: bold;');
        console.log('%cAction', 'color: #00bfa5; font-weight: bold;', action);
        console.log('%cState Before', 'color: #ff5722; font-weight: bold;');
        console.table(state);

        const nextState = reducer(state, action);

        console.log('%cState After', 'color: #4caf50; font-weight: bold;');
        console.table(nextState);
        console.groupEnd();

        return nextState;

    };

}

export const metaReducers: MetaReducer<AppState>[] = []; //  environment.production ? [] : [debug];