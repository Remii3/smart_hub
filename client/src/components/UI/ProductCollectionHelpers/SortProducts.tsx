import React, { ChangeEvent, useState } from 'react';

function SortProducts() {
  const [sortOption, setSortOption] = useState('');
  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <>
      <label htmlFor="SortBy" className="sr-only">
        SortBy
      </label>

      <select
        id="SortBy"
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
    </>
  );
}

export default SortProducts;
