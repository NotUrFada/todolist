import React, { forwardRef } from "react";

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, labelText, value, onChange, ...rest },
  ref
) {
  return (
    <>
      <label htmlFor={elementId} style={{ marginRight: 8 }}>
        {labelText}
      </label>
      <input
        id={elementId}
        type="text"
        value={value}
        onChange={onChange}
        ref={ref}
        {...rest}
      />
    </>
  );
});

export default TextInputWithLabel;
