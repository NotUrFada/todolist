function TodoForm() {
  return (
    <form>
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" id="todoTitle" placeholder="Add a new todo" />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
