// src/features/TodoForm.jsx
import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    const title = workingTodoTitle.trim();
    if (!title) return;

    // App.addTodo expects an object { title, isCompleted }
    onAddTodo({ title, isCompleted: false });

    setWorkingTodoTitle("");
    // optional: re-focus input after submit
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={inputRef}
        value={workingTodoTitle}
      />
      <button
        type="submit"
        disabled={isSaving || workingTodoTitle.trim() === ""}
      >
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
