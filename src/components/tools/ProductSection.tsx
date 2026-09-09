'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/tools/ProductCard';
import Image from 'next/image';
import { ProductWithRelations } from '@/lib/definitions';

type ProductType = 'watch' | 'jewellery' | 'bag';

interface ProductSectionProps {
    type: ProductType;
    products: ProductWithRelations[];
    allCategories: string[];
    allBrands: {
        name: string;
        slug: string;
    }[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const sortOptions = [
    { label: 'Best Selling', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'A-Z', value: 'name-asc' },
    { label: 'Z-A', value: 'name-desc' },
];

const normalize = (v: string) => v.toLowerCase().replace(/\s+/g, '-');

function DebouncedSearchInput({
    defaultValue,
    onSearch,
}: {
    defaultValue: string;
    onSearch: (value: string) => void;
}) {
    const [value, setValue] = useState(defaultValue);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                onSearch(newValue);
            }, 500);
        },
        [onSearch],
    );

    return (
        <Input
            leftIcon="search.svg"
            placeholder="Search Products"
            value={value}
            onChange={handleChange}
            className="bg-[#F3F1F0] border-0 h-12"
        />
    );
}

export default function ProductSection({
    type,
    products,
    allCategories,
    allBrands,
    pagination,
}: ProductSectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const gridRef = useRef<HTMLDivElement>(null);
    const basePath = `/${type}`;

    // ✅ category from route: /watch/[slug]
    const routeCategorySlug = pathname.startsWith(basePath + '/')
        ? pathname.split('/')[2]
        : '';

    // ✅ URL is single source of truth
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const brand = searchParams.get('brand') || '';
    const page = parseInt(searchParams.get('page') || '1');

    // ✅ CURRENT PAGE (pagination için)
    const currentPage = page;

    const category = useMemo(() => {
        if (!routeCategorySlug) return '';
        return (
            allCategories.find((c) => normalize(c) === routeCategorySlug) || ''
        );
    }, [routeCategorySlug, allCategories]);

    const uniqueBrands = useMemo(() => allBrands || [], [allBrands]);
    const uniqueCategories = useMemo(() => allCategories || [], [allCategories]);

    // ✅ URL builder (NO STATE RESET BUG)
    const updateURL = (params: {
        search?: string;
        sort?: string;
        brand?: string;
        page?: number;
        categorySlug?: string;
    }) => {
        const q = new URLSearchParams();

        if (params.search) q.set('search', params.search);
        if (params.sort && params.sort !== 'newest') q.set('sort', params.sort);
        if (params.brand) q.set('brand', params.brand);
        if (params.page && params.page > 1) q.set('page', String(params.page));

        const path = params.categorySlug
            ? `${basePath}/${params.categorySlug}`
            : basePath;

        const url = q.toString() ? `${path}?${q.toString()}` : path;

        // ✅ scroll jump fix
        router.replace(url, { scroll: false });
    };


    const clearFilters = () => updateURL({});

    const removeFilter = (key: 'search' | 'brand' | 'category') => {
        updateURL({
            search: key === 'search' ? '' : search,
            sort,
            brand: key === 'brand' ? '' : brand,
            categorySlug: key === 'category' ? undefined : routeCategorySlug,
        });
    };

    const formatLabel = (v: string) => v.replace(/-/g, ' ').toUpperCase();

    // ✅ PAGINATION HANDLER
    const handlePageChange = (newPage: number) => {
        updateURL({
            search,
            sort,
            brand,
            page: newPage,
            categorySlug: routeCategorySlug || undefined,
        });
        gridRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section className="bg-white">
            <Container>
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 pr-6 pt-2">
                        <div className="flex flex-col gap-2">

                            {/* BRAND */}
                            <details open className="group">
                                <summary className="cursor-pointer font-semibold flex justify-between py-2 border-b">
                                    Brand
                                    <Image
                                        src="/icons/arrow-down.svg"
                                        alt="arrow"
                                        width={20}
                                        height={20}
                                        className="group-open:rotate-180 transition-transform"
                                    />
                                </summary>

                                <div className="pl-2 py-2 space-y-2">
                                    {uniqueBrands.map((b) => (
                                        <label key={b.slug} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={brand === b.slug}
                                                onChange={() =>
                                                    updateURL({
                                                        search,
                                                        sort,
                                                        brand: b.slug,
                                                        categorySlug: routeCategorySlug || undefined,
                                                    })
                                                }
                                            />
                                            <span>{b.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </details>

                            {/* CATEGORY */}
                            <details open className="group">
                                <summary className="cursor-pointer font-semibold flex justify-between py-2 border-b">
                                    Category
                                    <Image
                                        src="/icons/arrow-down.svg"
                                        alt="arrow"
                                        width={20}
                                        height={20}
                                        className="group-open:rotate-180 transition-transform"
                                    />
                                </summary>

                                <div className="pl-2 py-2 space-y-2">
                                    {uniqueCategories.map((cat) => {
                                        const slug = normalize(cat);
                                        return (
                                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={routeCategorySlug === slug}
                                                    onChange={() =>
                                                        updateURL({
                                                            search,
                                                            sort,
                                                            brand,
                                                            categorySlug: slug,
                                                        })
                                                    }
                                                />
                                                <span>{cat}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </details>
                        </div>
                    </aside>

                    {/* MAIN */}
                    <div className="flex-1">

                        {/* ACTIVE FILTERS */}
                        {(search || brand || routeCategorySlug) && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-sm">Active Filters</span>
                                    <button onClick={clearFilters} className="text-xs text-red-500 underline">
                                        Clear All
                                    </button>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {search && (
                                        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                            Search: {search}
                                            <button onClick={() => removeFilter('search')}> ×</button>
                                        </span>
                                    )}
                                    {brand && (
                                        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                            Brand: {formatLabel(brand)}
                                            <button onClick={() => removeFilter('brand')}> ×</button>
                                        </span>
                                    )}
                                    {routeCategorySlug && (
                                        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                            Category: {formatLabel(routeCategorySlug)}
                                            <button onClick={() => removeFilter('category')}> ×</button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SEARCH + SORT */}
                        <div className="flex justify-between mb-6 gap-4">
                            <DebouncedSearchInput
                                defaultValue={search}
                                onSearch={(value) =>
                                    updateURL({
                                        search: value,
                                        sort,
                                        brand,
                                        categorySlug: routeCategorySlug || undefined,
                                    })
                                }
                            />

                            <select
                                value={sort}
                                onChange={(e) =>
                                    updateURL({
                                        search,
                                        sort: e.target.value,
                                        brand,
                                        categorySlug: routeCategorySlug || undefined,
                                    })
                                }
                                className="border px-3 py-2 rounded-md"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* GRID */}
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <ProductCard
                                        key={p.slug}
                                        type={type}
                                        brand={p.brand.name}
                                        title={p.title}
                                        description={p.subtitle || ''}
                                        price={p.price}
                                        image={(p.images as string[])?.[0] || '/images/placeholder.png'}
                                        slug={p.slug}
                                        cartIcon
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 opacity-60">
                                    No products found.
                                </div>
                            )}
                        </div>

                        {/* ✅ PAGINATION */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10 flex-wrap">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                                >
                                    Prev
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`px-4 py-2 border rounded transition ${p === currentPage
                                            ? 'bg-primary text-white border-primary'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === pagination.totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </Container>
        </Section>
    );
}
