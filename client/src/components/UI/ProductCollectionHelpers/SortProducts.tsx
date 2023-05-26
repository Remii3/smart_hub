import React, { ChangeEvent, useState } from 'react';

function SortProducts() {
  const [sortOption, setSortOption] = useState('');
  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <label>
        <span className="sr-only">SortBy</span>
        <select
          value={sortOption}
          onChange={(e) => sortOptionChangeHandler(e)}
          className="h-10 rounded border-gray-300 text-sm"
        >
          <option>Sort By</option>
          <option value="Title, DESC">Title, DESC</option>
          <option value="Title, ASC">Title, ASC</option>
          <option value="Price, DESC">Price, DESC</option>
          <option value="Price, ASC">Price, ASC</option>
        </select>
      </label>
    </div>
  );
}

export default SortProducts;
