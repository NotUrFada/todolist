import React from 'react';
import styled from 'styled-components';
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px; /* Add small amount of padding on the items */
    padding: 20px;
    border: 1px solid #ddd;
    width: 100%;
    max-width: 600px;
`;

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const TodosViewForm = ({ sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString }) => {
  const preventRefresh = (e) => {
    e.preventDefault();
  };
  
  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <label htmlFor="search">Search todos:</label>
        <input 
          id="search"
          type="text" 
          value={queryString} 
          onChange={(e) => setQueryString(e.target.value)} 
        />
        <button type="button" onClick={() => setQueryString('')}>Clear</button>
      </StyledDiv>
      <StyledDiv>
        <label htmlFor="sortField">Sort by</label>
        <select 
          id="sortField" 
          value={sortField} 
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </StyledDiv>
     <br/>
      <StyledDiv>
        <label htmlFor="sortDirection">Direction</label>
        <select 
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </StyledDiv>
    </StyledForm>
  );
};

export default TodosViewForm;