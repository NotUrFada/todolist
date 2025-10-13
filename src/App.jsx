import styles from './App.module.css';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback, useReducer} from 'react';
import { reducer, actions as todoActions, initialState } from './reducers/todos.reducer.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import TodosPage from './pages/TodosPage.jsx'; 
// IMPORT NEW PAGE COMPONENTS
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';


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
  }, [sortField, sortDirection, queryString, encodeUrl, token]);

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

    } finally{
      dispatch({ type: todoActions.endRequest });
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
  const clearError = () => dispatch({ type: todoActions.clearError });

  const todosPageElement = (
    <TodosPage 
  
        todoList={todoState.todoList}
        isLoading={todoState.isLoading}
        errorMessage= {todoState.errorMessage}
        isSaving={todoState.isSaving}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
        addTodo={addTodo}
        completeTodo={completeTodo}
        updateTodo={updateTodo}
        clearError={clearError}
        errorContainerClassName={styles.ErrorContainer}
    />
    );


  return (
    <BrowserRouter>
      <div className={styles.App}>
        {/*Navigation*/}
        <header>
          <nav>
            <Link to="/">Home</Link> | <Link to="/about">About</Link>
          </nav>
        </header>

        {/* ROUTES  */}
        <Routes>
          {/* TodoListPage */}
          <Route path="/" element={todosPageElement} />

          {/* replacing the old h1 */}
          <Route path="/about" element={<About />} /> 

          {/* ith the NotFound component */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  
  );
}

export default App;