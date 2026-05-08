'use client';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchRecipes } from '@/lib/api';
import { Recipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface SearchBarProps {
  onSearchResults: (results: Recipe[]) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const debouncedQuery = useDebounce(query, 500);

  // Search the actual API
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length > 0) {
        setIsLoading(true);
        try {
          const results = await searchRecipes(debouncedQuery);
          setSuggestions(results.slice(0, 5));
          onSearchResults(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          onSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        onSearchResults([]);
        setShowSuggestions(false);
      }
    };

    performSearch();
  }, [debouncedQuery, onSearchResults]);

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    onSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="🔍 Search ANY recipe... (Biryani, Karahi, Nihari, Pizza, Cake, Key Lime Pie)"
          className="w-full px-6 py-4 pl-14 pr-12 text-lg rounded-full border-2 border-pak-orange/30 focus:border-pak-orange focus:outline-none shadow-lg bg-white dark:bg-pak-dark text-pak-dark dark:text-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pak-orange" size={24} />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pak-orange"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-pak-dark rounded-xl shadow-xl p-4 z-50">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pak-orange"></div>
            <span className="text-pak-dark dark:text-white">Searching recipes... 🍳</span>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-pak-dark rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {suggestions.map((recipe) => (
            <Link
              key={recipe.idMeal}
              href={`/recipe/${recipe.idMeal}`}
              onClick={() => setShowSuggestions(false)}
            >
              <div className="flex items-center gap-3 p-3 hover:bg-pak-orange/10 transition-colors cursor-pointer">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-pak-dark dark:text-white">{recipe.strMeal}</p>
                  <p className="text-sm text-gray-500">{recipe.strCategory || 'Recipe'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {query && !isLoading && suggestions.length === 0 && debouncedQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-pak-dark rounded-xl shadow-xl p-4 z-50 text-center">
          <p className="text-pak-dark dark:text-white">😢 No recipes found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-1">Try: Biryani, Karahi, Nihari, Chicken, Pizza, Cake</p>
        </div>
      )}
    </div>
  );
}