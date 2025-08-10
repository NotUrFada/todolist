import { useState } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setworkingTodoTitle] = useState("");

  function handleAddTodo(event) {
    onAddTodo(workingTodoTitle);
    setworkingTodoTitle("");
    event.preventDefault();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(e) => setworkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
