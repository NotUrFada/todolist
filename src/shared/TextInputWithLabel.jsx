import styled from 'styled-components';
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {
  return (
    <StyledDiv>
      <label htmlFor={elementId}>{label}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </StyledDiv>
  );
}

export default TextInputWithLabel