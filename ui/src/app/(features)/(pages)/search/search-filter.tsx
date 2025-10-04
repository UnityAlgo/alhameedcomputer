"use client"
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSelector } from "@/components/ui/range";

interface MinMaxRange {
    min: number;
    max: number;
}

interface FilterState {
    priceRange: MinMaxRange;
    selectedBrands: string[];
    selectedCategories: string[];
}

interface SearchFilterProps {
    attributes: Record<string, Array<{ name: string, id: string }>>;
    onFiltersChange?: (filters: FilterState) => void;
    priceMin?: number;
    priceMax?: number;
    defaultPriceRange?: MinMaxRange;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    attributes,
    onFiltersChange,
    priceMin = 0,
    priceMax = 1000,
    defaultPriceRange = { min: 0, max: 1000 }
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const brands = attributes?.brands || [];
    const categories = attributes?.categories || [];

    // Initialize state from URL params
    const [filterState, setFilterState] = useState<FilterState>(() => {
        const priceMinParam = searchParams.get('price_min');
        const priceMaxParam = searchParams.get('price_max');
        const brandsParam = searchParams.get('brands');
        const categoriesParam = searchParams.get('categories');

        return {
            priceRange: {
                min: priceMinParam ? parseInt(priceMinParam) : defaultPriceRange.min,
                max: priceMaxParam ? parseInt(priceMaxParam) : defaultPriceRange.max,
            },
            selectedBrands: brandsParam ? brandsParam.split(',').filter(Boolean) : [],
            selectedCategories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : [],
        };
    });

    // Create URL search params from filter state
    const createSearchParams = useCallback((filters: FilterState) => {
        const params = new URLSearchParams();

        // Add price range if different from default
        if (filters.priceRange.min !== defaultPriceRange.min) {
            params.set('price_min', filters.priceRange.min.toString());
        }
        if (filters.priceRange.max !== defaultPriceRange.max) {
            params.set('price_max', filters.priceRange.max.toString());
        }

        // Add selected brands
        if (filters.selectedBrands.length > 0) {
            params.set('brands', filters.selectedBrands.join(','));
        }

        // Add selected categories
        if (filters.selectedCategories.length > 0) {
            params.set('categories', filters.selectedCategories.join(','));
        }

        // Preserve other search params that might exist
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.forEach((value, key) => {
            if (!['price_min', 'price_max', 'brands', 'categories'].includes(key)) {
                params.set(key, value);
            }
        });

        return params;
    }, [defaultPriceRange, searchParams]);

    // Update URL when filters change
    const updateURL = useCallback((filters: FilterState) => {
        const params = createSearchParams(filters);
        const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;

        // Use replace to avoid cluttering browser history
        router.replace(newURL, { scroll: false });
    }, [createSearchParams, pathname, router]);

    // Update state and URL
    const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
        const updatedFilters = { ...filterState, ...newFilters };
        setFilterState(updatedFilters);
        updateURL(updatedFilters);
        onFiltersChange?.(updatedFilters);
    }, [filterState, updateURL, onFiltersChange]);

    // Handle price range change
    const handlePriceRangeChange = (range: MinMaxRange) => {
        updateFilters({ priceRange: range });
    };

    // Handle brand checkbox change
    const handleBrandChange = (brandId: string, checked: boolean) => {
        const newSelectedBrands = checked
            ? [...filterState.selectedBrands, brandId]
            : filterState.selectedBrands.filter(id => id !== brandId);

        updateFilters({ selectedBrands: newSelectedBrands });
    };

    // Handle category checkbox change
    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const newSelectedCategories = checked
            ? [...filterState.selectedCategories, categoryId]
            : filterState.selectedCategories.filter(id => id !== categoryId);

        updateFilters({ selectedCategories: newSelectedCategories });
    };

    // Clear all filters
    const clearFilters = () => {
        const clearedFilters: FilterState = {
            priceRange: defaultPriceRange,
            selectedBrands: [],
            selectedCategories: [],
        };
        setFilterState(clearedFilters);
        updateURL(clearedFilters);
        onFiltersChange?.(clearedFilters);
    };

    // Check if filters are active
    const hasActiveFilters = (
        filterState.priceRange.min !== defaultPriceRange.min ||
        filterState.priceRange.max !== defaultPriceRange.max ||
        filterState.selectedBrands.length > 0 ||
        filterState.selectedCategories.length > 0
    );

    // Update parent component when filters change on mount
    useEffect(() => {
        onFiltersChange?.(filterState);
    }, []);

    // Format price for display
    const formatPrice = (value: number): string => `$${value.toLocaleString()}`;

    return (
        <div className="space-y-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Active Filters Summary
            {hasActiveFilters && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Active Filters:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(filterState.priceRange.min !== defaultPriceRange.min ||
                            filterState.priceRange.max !== defaultPriceRange.max) && (
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded-full">
                                    {formatPrice(filterState.priceRange.min)} - {formatPrice(filterState.priceRange.max)}
                                </span>
                            )}
                        {filterState.selectedBrands.map(brandId => {
                            const brand = brands.find(b => b.id === brandId);
                            return brand ? (
                                <span key={brandId} className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs rounded-full">
                                    {brand.name}
                                </span>
                            ) : null;
                        })}
                        {filterState.selectedCategories.map(categoryId => {
                            const category = categories.find(c => c.id === categoryId);
                            return category ? (
                                <span key={categoryId} className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 text-xs rounded-full">
                                    {category.name}
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            )} */}

            {/* Price Range Filter */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <div className="font-bold mb-4">Price Range</div>
                <RangeSelector
                    label="Price"
                    min={priceMin}
                    max={priceMax}
                    step={10}
                    value={filterState.priceRange}
                    onValueChange={handlePriceRangeChange}
                    formatValue={formatPrice}
                    showValues={true}
                />
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="font-bold mb-4">
                        Brands
                        {filterState.selectedBrands.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filterState.selectedBrands.length} selected)
                            </span>
                        )}
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {brands.map(brand => (
                            <div key={brand.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`brand-${brand.id}`}
                                    checked={filterState.selectedBrands.includes(brand.id)}
                                    onCheckedChange={(checked) =>
                                        handleBrandChange(brand.id, checked as boolean)
                                    }
                                />
                                <label
                                    htmlFor={`brand-${brand.id}`}
                                    className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    {brand.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="pb-6">
                    <div className="font-bold mb-4">
                        Categories
                        {filterState.selectedCategories.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filterState.selectedCategories.length} selected)
                            </span>
                        )}
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={filterState.selectedCategories.includes(category.id)}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(category.id, checked as boolean)
                                    }
                                />
                                <label
                                    htmlFor={`category-${category.id}`}
                                    className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filterState.selectedBrands.length + filterState.selectedCategories.length > 0 ? (
                        <>
                            {filterState.selectedBrands.length + filterState.selectedCategories.length} filter{filterState.selectedBrands.length + filterState.selectedCategories.length !== 1 ? 's' : ''} applied
                        </>
                    ) : (
                        'No filters applied'
                    )}
                </div>
            </div> */}
        </div>
    );
};

export { SearchFilter };