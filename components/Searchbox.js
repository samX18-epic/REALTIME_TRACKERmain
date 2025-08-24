// components/SearchBox.js
"use client";

import { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const SearchBox = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const results = await provider.search({ query });
      onSearchResults(results);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search for a location..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
    />
  );
};

export default SearchBox;