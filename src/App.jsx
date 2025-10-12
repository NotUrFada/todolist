import "./App.css";
import TodoForm from "./features/TodoForm";
import TodoList from "./features/TodoList/TodoList";
import { useEffect, useState } from "react";

const AIRTABLE_URL = `https://api.airtable.com/v0/${
  import.meta.env.VITE_BASE_ID
}/${import.meta.env.VITE_TABLE_NAME}`;
const AIRTABLE_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_PAT}`,
  "Content-Type": "application/json",
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch(AIRTABLE_URL, {
          method: "GET",
          headers: AIRTABLE_HEADERS,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        const todos = data.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (newTodo) => {
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

    try {
      setIsSaving(true);
      const resp = await fetch(AIRTABLE_URL, {
        method: "POST",
        headers: AIRTABLE_HEADERS,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Failed to save todo: ${resp.statusText}`);
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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

    try {
      setIsSaving(true);
      const resp = await fetch(AIRTABLE_URL, {
        method: "PATCH",
        headers: AIRTABLE_HEADERS,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Failed to update todo: ${resp.statusText}`);
      }

      const updatedList = todoList.map((todo) =>
        todo.id === editedTodo.id ? editedTodo : todo
      );
      setTodoList(updatedList);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedList = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedList);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const editedTodo = todoList.find((todo) => todo.id === id);
    const originalTodo = { ...editedTodo };
    const updatedTodo = { ...editedTodo, isCompleted: true };

    const payload = {
      records: [
        {
          id: updatedTodo.id,
          fields: {
            title: updatedTodo.title,
            isCompleted: updatedTodo.isCompleted,
          },
        },
      ],
    };

    setTodoList(todoList.map((todo) => (todo.id === id ? updatedTodo : todo)));

    try {
      setIsSaving(true);
      const resp = await fetch(AIRTABLE_URL, {
        method: "PATCH",
        headers: AIRTABLE_HEADERS,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Failed to update todo: ${resp.statusText}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      {errorMessage && (
        <div>
          <hr />
          <p style={{ color: "red" }}>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
