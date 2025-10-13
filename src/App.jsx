import styles from './App.module.css';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useState, useEffect, useCallback} from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField]=useState("createdTime")
  const [sortDirection, setSortDirection]=useState("desc")
  const [queryString, setQueryString]=useState('')
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
      setIsLoading(true);
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
        const fetched = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(fetched);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString, encodeUrl]);

  //Add Todo
  async function addTodo(title) {
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
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
      const { records } = await resp.json();
      const saved = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!saved.isCompleted) saved.isCompleted = false;
      setTodoList([...todoList, saved]);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save todo');
    } finally {
      setIsSaving(false);
    }
  }

  
  async function completeTodo(id) {
    const original = todoList.find((t) => t.id === id);
    const optimistic = todoList.map((t) =>
      t.id === id ? { ...t, isCompleted: true } : t
    );
    setTodoList(optimistic);

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
      console.error(err);
      setErrorMessage(
        (err.message || 'Failed to complete todo') + '. Reverting todo...'
      );
      const reverted = todoList.map((t) => (t.id === id ? original : t));
      setTodoList(reverted);
    }
  }

  async function updateTodo(editedTodo) {
    const original = todoList.find((t) => t.id === editedTodo.id);
    const optimistic = todoList.map((t) =>
      t.id === editedTodo.id ? { ...editedTodo } : t
    );
    setTodoList(optimistic);

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
      console.error(err);
      setErrorMessage(
        (err.message || 'Failed to update todo') + '. Reverting todo...'
      );
      const reverted = todoList.map((t) =>
        t.id === editedTodo.id ? original : t
      );
      setTodoList(reverted);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.App}>
      <h1>My Todo App</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        isLoading={isLoading}
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
      {errorMessage && (
        <div className={styles.ErrorContainer}>
          <hr />
          <p role="alert">Error: {errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;