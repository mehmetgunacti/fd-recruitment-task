import { PriorityLevelDto, TodoListDto } from "../../web-api-client";

export interface TodoModuleState {

    entities: Record<number, TodoListDto>,
    priorityLevels: PriorityLevelDto[];
    selectedListId: number | null;
    selectedItemId: number | null;
    searchTerm: string | null;

    loading: boolean;

    listCreateFormVisible: boolean;
    listUpdateFormVisible: boolean;
    listDeleteFormVisible: boolean;
    itemDetailFormVisible: boolean;

    error: string | null;

}

export const todo_initialState: TodoModuleState = {

    entities: {},
    priorityLevels: [],
    selectedListId: null,
    selectedItemId: null,
    searchTerm: null,
    loading: true,

    listCreateFormVisible: false,
    listUpdateFormVisible: false,
    listDeleteFormVisible: false,
    itemDetailFormVisible: false,

    error: null

};

