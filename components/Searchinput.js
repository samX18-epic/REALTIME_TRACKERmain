// components/SearchInput.js
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import styles from '../styles/Searchinput.module.css';

const provider = new OpenStreetMapProvider();

// Debounce utility function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchInput = ({ onSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length > 2) {
        const results = await provider.search({ query: searchQuery });
        setRecommendations(results);
      } else {
        setRecommendations([]);
      }
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    // Call the debounced function whenever the query changes
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setRecommendations([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelection = (result) => {
    setQuery(result.label);
    setRecommendations([]);
    onSelect(result);
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className={styles.input}
      />
      {recommendations.length > 0 && (
        <ul
          ref={dropdownRef}
          className={styles.dropdown}
        >
          {recommendations.map((result, index) => (
            <li
              key={index}
              onClick={() => handleSelection(result)}
              className={styles.dropdownItem}
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;