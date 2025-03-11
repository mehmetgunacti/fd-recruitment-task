import { PriorityLevelDto, TodoListDto } from "../../web-api-client";

export interface TodoModuleState {

    lists: TodoListDto[];
    priorityLevels: PriorityLevelDto[];
    selectedListId: number | null;
    searchTerm: string | null;

    loading: boolean;

}

export const todo_initialState: TodoModuleState = {

    lists: [],
    priorityLevels: [],
    selectedListId: null,
    searchTerm: null,
    loading: true

};