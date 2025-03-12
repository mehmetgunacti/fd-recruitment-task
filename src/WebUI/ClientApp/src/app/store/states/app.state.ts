import { todo_initialState, TodoModuleState } from "./todo.state";

export interface AppState {

    todo: TodoModuleState

}

export const initialAppState: AppState = {

    todo: todo_initialState

}

