import { PriorityLevelDto, TodoListDto } from "../../web-api-client";

export interface TodoModuleState {

    entities: Record<number, TodoListDto>,
    priorityLevels: PriorityLevelDto[];
    selectedListId: number | null;
    searchTerm: string | null;

    loading: boolean;

    listCreateFormVisible: boolean;
    listCreateFormError: string | null;

    listUpdateFormVisible: boolean;
    listUpdateFormError: string | null;

    listDeleteFormVisible: boolean;
    listDeleteFormError: string | null;

    addItemError: string | null;

}

export const todo_initialState: TodoModuleState = {

    entities: {},
    priorityLevels: [],
    selectedListId: null,
    searchTerm: null,
    loading: true,

    listCreateFormVisible: false,
    listCreateFormError: null,

    listUpdateFormVisible: false,
    listUpdateFormError: null,

    listDeleteFormVisible: false,
    listDeleteFormError: null,

    addItemError: null

};

