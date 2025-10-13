import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from 'styled-components';
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 600px;
    margin-bottom: 16px;
`;

const StyledButton = styled.button`
    font-style: $props => props.disabled ? 'italic' : nomal'};
    `;
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
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleRef} 
                value={workingTodoTitle} 
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                
            />

            <StyledButton type="submit" disabled={workingTodoTitle.trim() === ""}>Add Todo</StyledButton>
        </StyledForm>
    );
}

export default TodoForm;
