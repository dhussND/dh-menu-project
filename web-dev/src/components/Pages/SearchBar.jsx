import React from 'react';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    />
  );
};

export default SearchBar;