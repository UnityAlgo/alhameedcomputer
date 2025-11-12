"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useRef, FormEvent, KeyboardEvent, useEffect } from "react";
import {
  Loader2,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { API_URL } from "@/api";
import useAuthStore from "@/features/auth";


export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isActive, setIsActive] = useState(false);


  return (
    <>
      <header className="shadow-sm">
        <div className="md:flex md:items-center md:justify-between max-w-6xl mx-auto px-2 md:px-4  grid grid-cols-2 gap-2">
          <Link href="/" className="hidden md:block">
            <img alt="Al Hameed Computers" className="h-24 w-24 object-cover" src="/logo.png" />
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsActive(!isActive)}
              className=""
            >
              <Menu className="h-7 w-7" />
            </button  >
            <Link href="/">
              <img alt="Al Hameed Computers" className="w-36 h-auto" src="/m-logo.png" />
            </Link>
          </div>
          {isActive && (
            <div className="absolute bg-white w-60 h-full z-60">
              <div>

              </div>
              <ul>
                <li className="flex items-center gap-2 px-4">
                  <UserRound className="size-5" />
                  <Link href="/profile" className="hover:bg-gray-100">
                    Your Profile
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="col-span-2 order-3 md:order-none" >
            <Searchbar />
          </div>

          <div className="flex items-center justify-end gap-4 grid-rows-1 col-span-1">
            <Link href="/cart" >
              <ShoppingCart className="size-5" />
            </Link>

            {isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <UserRound className="size-5" />
                    <div className="hidden md:block text-sm">{user.username}</div>
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
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-700 items-center flex gap-2 cursor-pointer outline-none disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </li>

                  </ul>
                </PopoverContent>
              </Popover>
            ) :
              <Link href="/login" className="text-sm">Sign In</Link>
            }
          </div>

        </div>
      </header>
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
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);


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
      className="flex items-center justify-between border border-accent rounded-md md:rounded-full py-2 md:pl-3 pr-4 text-sm w-full md:w-2xl relative shrink-0 "
      onSubmit={handleSearch}
    >
      <div className="flex-1">
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
            className="bg-white shadow-lg border border-accent rounded-md mt-4 z-50 absolute left-0 right-0  w-full min-w-full "
          >

            <div className="md:max-h-72 overflow-y-auto">
              {/* <div className="px-3 py-2 text-sm text-gray-500">
                No suggestions found
              </div> */}

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