"use client";

import Link from "next/link";
import { useState, useEffect, useRef, FormEvent, KeyboardEvent, ReactEventHandler } from "react";
import {
  ChevronDown,
  LogOut,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/index";
import { useCart } from "@/hooks/useCart";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/_api/axiosClient";
import { Brand } from "@/components";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const { isAuthenticated, user, handleLogout } = useAuth();
  const { cart } = useCart();

  return (
    <>
      <header className="shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-2 md:px-4 py-4">
          <Link href="/" className="flex-shrink-0">
            <Brand />
            {/* <div className="h-15 md:h-20 flex items-center">
              <img
                src="/cover-logo.png"
                alt="Al Hameed Computers"
                className="h-full w-auto object-contain"
              />
            </div> */}
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {/* ✅ Updated Searchbar */}
            <Searchbar />

            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <Link
                href="/cart"
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors relative cursor-pointer"
              >
                <ShoppingCart className="h-4 md:h-5 md:w-5 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {cart.length}
                  </span>
                )}
              </Link>

              <div className="relative"
              // ref={dropdownRef}
              >
                <div className="flex gap-2 items-center">
                  <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors cursor-pointer">
                    <UserRound className="h-4 md:h-5 md:w-5 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hello</p>
                    <div
                      className="relative cursor-pointer"
                    // onClick={() =>
                    //   isAuthenticated
                    //     ? setDropdownOpen(!dropdownOpen)
                    //     : router.push("/login")
                    // }
                    >
                      {isAuthenticated && user ? (
                        <span className="text-sm font-medium text-gray-700 flex relative">
                          {user.username}
                          <div className="absolute right-[-15] top-1">
                            <ChevronDown className="h-3.5 w-3.5" />
                          </div>
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          Sign in
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {dropdownOpen && isAuthenticated && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="text-sm text-gray-700">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/reviews"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          My Reviews
                        </Link>
                      </li>
                      <li className="border-t border-accent">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 items-center flex gap-2 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex sm:hidden items-center gap-2">
              <button
                // onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <Link
                href="/cart"
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {cart.length}
                  </span>
                )}
              </Link>

              <button
                // onClick={() =>
                //   isAuthenticated
                //     ? setDropdownOpen(!dropdownOpen)
                //     : router.push("/login")
                // }
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <UserRound className="h-4 w-4" />
              </button>

              {dropdownOpen && isAuthenticated && (
                <div className="absolute right-2 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="text-sm text-gray-700">
                    <li>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/reviews"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Reviews
                      </Link>
                    </li>
                    <li className="border-t border-accent">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 items-center flex gap-2 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* {isSearchOpen && (
          <div className="sm:hidden border-t border-accent bg-white w-full">
            <div className="max-w-6xl mx-auto px-2 py-3">
              <MobileSearchbar />
            </div>
          </div>
        )} */}
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-25 z-40 sm:hidden"
          onClick={() => {
            setIsSearchOpen(false);
          }}
        ></div>
      )}
    </>
  );
};


const Searchbar = () => {
  const parmas = useSearchParams();
  const [query, setQuery] = useState(parmas.get("query") || "");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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

  const [results, setResults] = useState([
    "Apple mouse",
    "Logitech G402 gaming mouse 8000dpi",
    "Razer DeathAdder V2 wired gaming mouse",
    "Logitech MX Master 3S wireless mouse",
    "SteelSeries Rival 5 RGB gaming mouse",
    "Corsair Harpoon RGB wireless mouse",
    "HP X3000 wireless mouse",
    "Dell MS116 optical wired mouse",
    "Microsoft Bluetooth ergonomic mouse",
    "Glorious Model O lightweight gaming mouse"
  ]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };


  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() && !isOpen) {
      setIsOpen(true);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form className="flex items-center justify-between border border-accent rounded-full p-2 text-sm w-48 sm:w-80 lg:w-140 relative" onSubmit={handleSearch}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            className="outline-none border-none text-sm px-2 w-full bg-transparent"
            onFocus={() => setIsOpen(true)}
          />
        </PopoverTrigger>

        <PopoverContent
          style={{
            width: "var(--radix-popover-trigger-width)"
          }}
          className="bg-white shadow-sm border border-accent outline-none rounded-md mt-2 z-50 p-0"
          align="start"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-60 overflow-y-auto">
            {results
              .filter(result =>
                result.toLowerCase().includes(query.toLowerCase()) || query === ""
              )
              .map((val, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(val)}
                  className="whitespace-nowrap overflow-hidden text-ellipsis text-sm px-3 py-2 cursor-pointer hover:bg-slate-100 first:rounded-t-md last:rounded-b-md"
                >
                  {val}
                </div>
              ))
            }
          </div>
        </PopoverContent>
      </Popover>

      <button type="submit" className="shrink-0">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};