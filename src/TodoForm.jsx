import { useRef } from "react";
function TodoForm([{ onAddTodo }]) {
  const todoTitleInput = useRef("");
  todoTitleInput.current.focus();

  function handleAddTodo(event) {
    event.preventdefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = "";
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" id="todoTitle" name="title" ref={todoTitleInput} />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
