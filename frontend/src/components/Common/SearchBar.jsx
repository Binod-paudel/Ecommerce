import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Make sure to import your actions
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productsSlice.js"; 

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle search input visibility
  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // Prevent empty searches

    // Dispatch Redux actions to update state and fetch filtered products
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));

    // Navigate to the filtered search page
    navigate(`/collections/all?search=${encodeURIComponent(searchTerm)}`);

    // Close the search input
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        // Search Input Form
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg w-full focus:outline-none placeholder:text-gray-700"
            />

            {/* Submit search icon */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-black"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>

          {/* Close search input button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        // Search button (closed state)
        <button onClick={handleSearchToggle} className="text-gray-800 hover:text-black">
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
