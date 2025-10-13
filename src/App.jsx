import styles from './App.module.css';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback, useReducer} from 'react';
import { reducer, actions as todoActions, initialState } from './reducers/todos.reducer.js';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField]=useState("createdTime")
  const [sortDirection, setSortDirection]=useState("desc")
  const [queryString, setQueryString]=useState('')
  const [todoState, dispatch] = useReducer(reducer, initialState);
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  
  const encodeUrl = useCallback(() => {
    let sortQuery = 'sort[0][field]=' + sortField + '&sort[0][direction]=' + sortDirection;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=${encodeURIComponent(`SEARCH("${queryString}", {title})`)}`;
    }
    return `${url}?${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, queryString, url]);


  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
        if (!resp.ok) {
          throw new Error(resp.statusText || `HTTP ${resp.status}`);
        }
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });

      } catch (err) {
        dispatch({ type: todoActions.setLoadError, error: err});

      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString, encodeUrl]);

  //Add Todo
  async function addTodo(title) {
    dispatch({ type: todoActions.startRequest });

    const newTodo = { title, isCompleted: false };

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records});

    } catch (err) {
      dispatch({ type: todoActions.setLoadError, error: err});

    }
  }

  
  async function completeTodo(id) {
    const originalTodo = todoState.todoList.find((t) => t.id === id);
    dispatch ({ type: todoActions.completeTodo, id});


    const payload = {
      records: [
        {
          id,
          fields: { isCompleted: true },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      dispatch({ type: todoActions.revertTodo,editedTodo: originalTodo, error: err,});

    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoState.todoList.find((t) => t.id === editedTodo.id);
    dispatch({ type: todoActions.updateTodo, editedTodo });


    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo, error: err,
      });
    }
  }

  return (
    <div className={styles.App}>
      <h1>My Todo App</h1>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        isLoading={todoState.isLoading}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      <hr />
      <TodosViewForm 
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {todoState.errorMessage && (
        <div className={styles.ErrorContainer}>
          <hr />
          <p role="alert">Error: {todoState.errorMessage}</p>

          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;