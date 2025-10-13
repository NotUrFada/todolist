import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
    todoList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    queryString,
    setQueryString,
    addTodo,
    completeTodo,
    updateTodo,
    clearError,
    errorContainerClassName,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const itemsPerPage = 15;

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

    const totalPages = Math.ceil(todoList.length / itemsPerPage);

    const currentTodos = todoList.slice(
        indexOfFirstTodo, 
        indexOfFirstTodo + itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setSearchParams({ page: (currentPage - 1).toString() });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSearchParams({ page: (currentPage + 1).toString() });
        }
    };

    useEffect(() => {
        if (totalPages > 0) {
            if (
                isNaN(currentPage) || 
                currentPage < 1 || 
                currentPage > totalPages
            ) {
                navigate('/');
            }
        }
    }, [currentPage, totalPages, navigate]);

    return (
        <>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
            <TodoList
                todoList={currentTodos}
                isLoading={isLoading}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
            />
            
            {/* Pagination  */}
            <div className="paginationControls" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                margin: '20px 0'
            }}>
                <button 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <hr />
            <TodosViewForm
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sortField={sortField}
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
            />
            {errorMessage && (
                <div className={errorContainerClassName}>
                    <hr />
                    <p role="alert">Error: {errorMessage}</p>
                    <button onClick={clearError}>Dismiss</button>
                </div>
            )}
        </>
    );
}

export default TodosPage;
