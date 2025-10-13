import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";


function TodoForm({ onAddTodo }) {
    const todoTitleRef = useRef(null);
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
     
    function handleAddTodo(event) {
        event.preventDefault();
        const newTodoTitle = workingTodoTitle;
        onAddTodo(newTodoTitle);
        setWorkingTodoTitle(""); 
        todoTitleRef.current.focus();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleRef} 
                value={workingTodoTitle} 
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                
            />

            <button type="submit" disabled={workingTodoTitle.trim() === ""}>Add Todo</button>
        </form>
    );
}

export default TodoForm;
