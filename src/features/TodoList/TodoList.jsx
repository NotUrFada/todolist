{
  /*extract from TodoList.jsx*/
}

import TodoListItem from "../../TodoListItem";

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  isLoading,
  errorMessage,
}) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <div>
      {isLoading && <p>Todo list Loading...</p>}
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
