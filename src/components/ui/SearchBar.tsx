'use client';
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (term: string) => void;
    onFavoritesToggle: () => void;
}

function SearchBar({ onSearch, onFavoritesToggle }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchHovered, setIsSearchHovered] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (searchTerm.trim()) {
            onSearch(searchTerm);
            setSearchTerm('');
        }
    }

    function handleMouseEnter() {
        setIsSearchHovered(true);
    }

    function handleMouseLeave() {
        setIsSearchHovered(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value);
    }

    let searchIconSrc = "./icons/search.png";
    if (isSearchHovered) {
        searchIconSrc = "./icons/hoveredsearch-icon.png";
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-1">
            <input
                className="bg-white text-black w-[85%] px-6 py-2.5 rounded-md"
                type="text"
                placeholder="Search location..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button
                type="submit"
                className="bg-white rounded-md px-3 py-2 transition-colors duration-200 cursor-pointer hover:bg-gray-400 active:bg-white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    className="w-[20px]"
                    src={searchIconSrc}
                    alt="Search Icon"
                />
            </button>
            <button
                type="button"
                className="bg-white rounded-md px-3 py-2 transition-colors duration-200 cursor-pointer hover:bg-gray-400 active:bg-white"
                onClick={onFavoritesToggle}
            >
                <img
                    className="w-[20px]"
                    src="./icons/star.png"
                    alt="Favorites Icon"
                />
            </button>
        </form>
    );
}

export default SearchBar;