"use client"

import axios from "axios";
import Link from "next/link";
import { useDebounce } from "@uidotdev/usehooks";
import { useState, useRef, FormEvent, KeyboardEvent, useEffect } from "react";
import {
    Loader2,
    Search,
    X,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type SuggestionQueryResponse = {
    suggestions: string[]
    count: number
    query: string
}


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

const useSuggestionQuery = (query: string, enabled: boolean): UseQueryResult<SuggestionQueryResponse> => {
    return useQuery(({
        queryKey: ["suggestions-query", query],
        queryFn: async () => {
            const request = await axios.get(API_URL + "api/products/suggestions?query=" + query)
            return request.data
        },
        enabled: enabled
    }))
}

export const Searchbar = () => {
    const params = useSearchParams();
    const router = useRouter();


    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(params.get("query") || "");
    const debouncedQuery = useDebounce(query, 500);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const suggestionQuery = useSuggestionQuery(debouncedQuery, Boolean(debouncedQuery.trim().length && isOpen))

    useEffect(() => {
        if (suggestionQuery.isSuccess && suggestionQuery.data) {
            const { suggestions } = suggestionQuery.data;
            setSuggestions(suggestions)
        }
    }, [suggestionQuery.isSuccess, suggestionQuery.data])



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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
            setSuggestions([]);
        }
    };

    const handleFocus = () => {
        if (query.trim() && suggestions.length > 0) {
            setIsOpen(true);
        }
    };



    const showDropdown = isOpen && (suggestions.length > 0 || suggestionQuery.isLoading || error);
    console.log(query)
    console.log(isOpen)
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
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="outline-none border-none text-sm px-2 w-full bg-transparent"
                    autoComplete="off"
                />

                {showDropdown && (
                    <div
                        ref={dropdownRef}
                        className="bg-white shadow-lg border border-accent rounded-md mt-4 z-50 absolute left-0 right-0  w-full min-w-full "
                    >

                        <div className="md:max-h-72 overflow-y-auto">
                            {suggestionQuery.isLoading && (
                                <div className="flex items-center justify-center py-4 text-gray-500">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    <span className="text-sm">Loading suggestions...</span>
                                </div>
                            )}

                            {suggestionQuery.isError && !suggestionQuery.isLoading && (
                                <div className="px-3 py-2 text-sm text-destructive">
                                    Failed to load suggestions
                                </div>
                            )}

                            {!suggestionQuery.isLoading && !suggestionQuery.isError && !suggestions.length && query.trim() && ( 
                                <div className="px-3 py-2 text-sm">
                                    No suggestions found
                                </div>
                            )}

                            {!suggestionQuery.isLoading && !suggestionQuery.isError && suggestions.length && (
                                <>
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelect(suggestion)}
                                            className="whitespace-nowrap overflow-hidden text-ellipsis text-sm px-3 py-2 cursor-pointer hover:bg-accent first:rounded-t-md last:rounded-b-md transition-colors"
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