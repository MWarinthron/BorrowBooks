import React from "react";

const Input = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-2 rounded-lg w-full"
    />
  );
};

export default Input;