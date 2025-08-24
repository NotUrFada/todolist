import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import { useRef } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setworkingTodoTitle] = useState("");
  const inputRef = useRef();

  function handleAddTodo(event) {
    onAddTodo(workingTodoTitle);
    setworkingTodoTitle("");
    event.preventDefault();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        onChange={(event) => setworkingTodoTitle(event.target.value)}
        ref={inputRef}
        value={workingTodoTitle}
      />
      <button type="submit" disabled={workingTodoTitle === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
