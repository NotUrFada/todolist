const initialState = {
  todoList: [],
  isLoading: false,       
  isSaving: false,        
  errorMessage: '',       
  
};
const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};


function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };

    case actions.loadTodos:
      const fetchedTodos = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });

      return {
        ...state,
        todoList: fetchedTodos,
        isLoading: false,
      };
    
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
        errorMessage: '',
      };

    case actions.addTodo:
      const savedRecord = action.records[0];
      const savedTodo = {
        id: savedRecord.id,
        ...savedRecord.fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };

    case actions.endRequest:
        return {
            ...state,
            isLoading: false,
            isSaving: false,
        };
    
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };
    
    case actions.completeTodo:
      const updatedTodos = state.todoList.map((t) =>
        t.id === action.id ? { ...t, isCompleted: true } : t
      );
      return {
        ...state,
        todoList: updatedTodos,
      };
      
    case actions.revertTodo:
    case actions.updateTodo:
        const updatedTodosForEdit = state.todoList.map((t) =>
            t.id === action.editedTodo.id ? { ...action.editedTodo } : t
        );

        const updatedState = {
            ...state,
            todoList: updatedTodosForEdit,
        };

        if (action.error) {
            updatedState.errorMessage = action.error.message;
        }
        
        return updatedState;

    case actions.clearError:
        return {
            ...state,
            errorMessage: '',
        };
      
    default:
      return state;
  }
}

export { initialState, actions, reducer };