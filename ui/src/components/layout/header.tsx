"use client";

import Link from "next/link";
import { useState, useRef, FormEvent, KeyboardEvent, ReactEventHandler, useEffect } from "react";
import {
  Loader2,
  LogOut,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/index";
import { useCart } from "@/hooks/useCart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Brand } from "@/components";
import axios from "axios";
import { API_URL } from "@/api";

export const Header = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const { cart } = useCart();

  return (
    <>
      <header className="shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-2 md:px-4 py-4">
          <Link href="/" className="flex-shrink-0">
            <Brand />
          </Link>

          <div className="flex items-center gap-8">
            <Searchbar />

            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className=""
              >
                <ShoppingCart className="h-4 md:h-5 md:w-5 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {cart.length}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex gap-2 items-center">
                      <UserRound className="h-4 md:h-5 md:w-5 w-4" />
                      <div className="cursor-pointer text-sm">Hussain</div>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="w-40 bg-white border border-gray-200 rounded-md shadow-sm">
                    <ul className="text-sm text-gray-700">
                      <li>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                          My Orders
                        </Link>
                      </li>

                      <li className="border-t border-accent">
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 items-center flex gap-2 cursor-pointer outline-none">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </li>

                    </ul>
                  </PopoverContent>
                </Popover>
              ) : <Link href="/login" className="text-sm">Sign In</Link>}
            </div>

          </div>
        </div>

      </header >
    </>
  );
};

const Searchbar = () => {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from API
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL + `api/products/suggestions?query=${encodeURIComponent(searchQuery)}`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.data;
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300); // 300ms delay
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    router.push("/search?query=" + encodeURIComponent(query));
  };

  const handleSelect = (value: string) => {
    if (!value) return;

    setQuery(value);
    setIsOpen(false);
    router.push("/search?query=" + encodeURIComponent(value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const showDropdown = isOpen && (suggestions.length > 0 || isLoading || error);

  return (
    <form
      className="flex items-center justify-between border border-accent rounded-full py-2 pl-3 pr-4 text-sm w-48 sm:w-80 lg:w-2xl relative"
      onSubmit={handleSearch}
    >
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="outline-none border-none text-sm px-2 w-full bg-transparent"
          autoComplete="off"
        />

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="bg-white shadow-lg border border-accent rounded-md mt-2 z-50 absolute left-0 right-0 top-full"
          >
            <div className="max-h-60 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-4 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm">Loading suggestions...</span>
                </div>
              )}

              {error && !isLoading && (
                <div className="px-3 py-2 text-sm text-red-500">
                  Failed to load suggestions
                </div>
              )}

              {!isLoading && !error && suggestions.length === 0 && query.trim() && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No suggestions found
                </div>
              )}

              {!isLoading && !error && suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect(suggestion)}
                      className="whitespace-nowrap overflow-hidden text-ellipsis text-sm px-3 py-2 cursor-pointer hover:bg-slate-100 first:rounded-t-md last:rounded-b-md transition-colors"
                    >
                      {highlightMatch(suggestion, query)}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="shrink-0" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};