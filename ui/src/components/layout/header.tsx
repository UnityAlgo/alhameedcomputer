"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useRef, FormEvent, KeyboardEvent, useEffect } from "react";
import {
  FileUser,
  Heart,
  House,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  MessageSquareHeart,
  Package,
  Search,
  ShoppingCart,
  UserRound,
  UserRoundCog,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { API_URL } from "@/api";
import useAuthStore from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";


const Brand = () => {
  return <Link href="/" className="flex items-center gap-2 ">
    <img alt="UnityStore" className="h-12 w-12" src="/logo.png" />
    <div className="font-bold">UnityStore</div>
  </Link>
}
export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isActive, setIsActive] = useState(false);


  return (
    <header className="border">
      <div className="md:flex md:items-center md:justify-between max-w-6xl py-2 mx-auto px-2 md:px-4 grid grid-cols-2 gap-2">
        <Brand />
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsActive(!isActive)}
            className="mt-1.5"
          >
            <Menu className="h-7 w-7" />
          </button  >

        </div>

        {isActive && (
          <div className="absolute top-0 left-0 bg-white rounded-md shadow-md w-60 h-full z-50">
            <div className="flex justify-between gap-2 px-2 pt-2 pb-4 border-b border-accent items-center">
              <Link href="/" className="">
                <img alt="Al Hameed Computers" className="w-28 object-contain" src="/m-logo.png" />
              </Link>
              <button>
                <X size={22} onClick={() => setIsActive(false)} />
              </button>
            </div>
            {/* 
              <ul className="text-sm">
                {isAuthenticated && user ? (
                  <>
                    <div className="my-4 px-2">
                      <h2 className="text-base font-semibold">
                        Hello, {user.full_name || user.username}
                      </h2>
                    </div>
                    <h4 className="font-bold px-2 py-2 border-t border-accent">Settings</h4>
                    <li>
                      <Link href="/profile" className="flex gap-2 px-4 py-2 hover:bg-gray-100">
                        <UserRoundCog className="h-4.5 w-4.5" />
                        Your Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/orders" className="flex gap-2 px-4 py-2 hover:bg-gray-100">
                        <Package className="h-4.5 w-4.5" />
                        Your Orders
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/orders" className="flex gap-2 px-4 py-2 hover:bg-gray-100">
                        <MessageSquareHeart className="h-4.5 w-4.5" />
                        Your Reviews
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/orders" className="flex gap-2 px-4 py-2 hover:bg-gray-100">
                        <MapPin className="h-4.5 w-4.5" />
                        Address Book
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/orders" className="flex gap-2 px-4 py-2 hover:bg-gray-100">
                        <Heart className="h-4.5 w-4.5" />
                        Wishlist
                      </Link>
                    </li>

                  </>
                ) : null
                }
                <li className="border-t border-accent">
                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-700 items-center flex gap-2 cursor-pointer outline-none disabled:opacity-50"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <div className="px-2 py-4">
                        <h2 className="text-base font-semibold">
                          Welcome to Al Hameed Computers!
                        </h2>
                      </div>

                      <Link href="/" className="flex gap-2 px-4 py-2 border-t border-accent">
                        <House className="h-4.5 w-4.5" />
                        Back To Home
                      </Link>
                      <Link href="/register" className="flex gap-2 px-4 py-2">
                        <FileUser className="h-4.5 w-4.5" />
                        Register
                      </Link>
                      <Link href="/login" className="flex gap-2 px-4 py-2">
                        <LogIn className="h-4.5 w-4.5" />
                        Log In
                      </Link>
                    </>
                  )}
                </li>
              </ul> */}


          </div>
        )}

        <div className="col-span-2 order-3 md:order-none" >
          <Searchbar />
        </div>


        <div className="flex items-center justify-end gap-4 grid-rows-1 col-span-1">

          <Link href="/cart" className="flex flex-col gap-1 items-center" >
            <ShoppingCart className="size-5" />
            <div className="text-xs">Cart</div>
          </Link>

          <Link href="" className="flex flex-col gap-1 items-center" >
            <UserRound className="size-5" />
            <div className="text-xs">Login</div>
          </Link>

          {/* {isAuthenticated && user ? (
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
            } */}
        </div>

      </div>
    </header>
  );
};



const useSuggestionsQuery = (query: string, open: boolean) => {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      const res = await axios.get(API_URL + "api/products/suggestions?query=" + encodeURIComponent(query))
      return res.data
    },
    enabled: Boolean(open)
  })
}

const Searchbar = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("query") || "");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce<string>(query, 500);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestionQuery = useSuggestionsQuery(debouncedValue, isOpen);

  useEffect(() => {
    if (suggestionQuery.isSuccess && suggestionQuery.data) {
      const { suggestions } = suggestionQuery.data;
      setSuggestions(suggestions);
    }
  }, [suggestionQuery.data, suggestionQuery.isSuccess])

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
    // if (query.trim() && suggestions.length > 0) {
    setIsOpen(true);
    // }
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


  return (
    <form
      className="flex items-center justify-between bg-accent  border border-accent rounded-md py-2 md:pl-3 pr-4 text-sm w-full md:w-2xl relative shrink-0 "
      onSubmit={handleSearch}
    >
      {/* <Select >
        <SelectTrigger className="w-[120px] text-left text-sm border-none focus-within:ring-0 ring-0 bg-accent p-0">
          <SelectValue placeholder="All Products" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__empty">All Products</SelectItem>
          <SelectItem value="1">Gaming Headphones</SelectItem>
          <SelectItem value="2">Gaming Headphones</SelectItem>
        </SelectContent>
      </Select> */}

      <div className="flex-1">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="outline-none border-none text-sm px-2 w-full text-accent-foreground placeholder:text-accent-foreground"
          autoComplete="off"
        />

        {isOpen && (
          <div
            ref={dropdownRef}
            className="bg-card shadow-sm border rounded-md mt-4 z-50 absolute left-0 right-0  w-full min-w-full "
          >

            <div className="md:max-h-72 overflow-y-auto">
              {suggestionQuery.isLoading ? (
                <div className="flex items-center justify-center py-4 text-accent-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm">Loading suggestions...</span>
                </div>
              )
                : !suggestionQuery.isLoading && !suggestionQuery.isError && suggestions.length === 0 && query.trim() ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No suggestions found
                  </div>

                ) : suggestionQuery.isSuccess && suggestions.length > 0 ? (
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
                ) : <div className="px-3 py-2 text-sm text-accent-foreground text-center">
                  No suggestions found
                </div>}
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