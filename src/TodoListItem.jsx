import { useEffect, useState } from "react";
import TextInputWithLabel from "./shared/TextInputWithLabel";
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title); 

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo]);

    const handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    };

    const handleCancel = () => {
        setWorkingTitle(todo.title); 
        setIsEditing(false); 
    };

    const handleUpdate = (event) => {
        event.preventDefault(); 
        if (!isEditing) return; 
        onUpdateTodo({ ...todo, title: workingTitle }); 
        setIsEditing(false); 
    };

    return (
        <li className={styles.item}>
            {isEditing ? (
                <form onSubmit={handleUpdate}> 
                    <TextInputWithLabel
                        value={workingTitle}
                        onChange={handleEdit} 
                    />
                    <button type="button" onClick={handleCancel}>Cancel</button> 
                    <button type="button" onClick={handleUpdate}>Update</button> 
                    <button type="submit">Save</button> 
                </form>
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                    <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                </>
            )}
        </li>
    );
}

export default TodoListItem;