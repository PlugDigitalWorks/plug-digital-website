'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';
import clsx from 'clsx';
import { useSearch, type SearchResult } from '@/hooks/useSearch';

function getProductHref(item: SearchResult) {
  return `/product/${item.slug}`;
}

export default function HeaderSearch() {
  const { query, setQuery, results, brands, categories, loading, clear } = useSearch({
    limit: 5,
    debounceMs: 350,
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasResults = results.length > 0 || brands.length > 0 || categories.length > 0;
    if (query.trim().length >= 2) setShowDropdown(true);
    else if (!hasResults) setShowDropdown(false);
  }, [query, results.length, brands.length, categories.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-30 font-sans">
      <form
        onSubmit={handleSearch}
        className={clsx(
          'relative flex items-center gap-3 bg-white border border-[#E3B685]/30 rounded-full px-5 py-3 transition-all duration-300',
          'w-[260px] focus-within:w-[320px] lg:w-[300px] lg:focus-within:w-[450px]',
          'shadow-sm hover:shadow-md hover:border-[#E3B685] focus-within:border-[#E3B685] focus-within:ring-1 focus-within:ring-[#E3B685]/20',
        )}
      >
        <button
          type="submit"
          className="text-[#3A2121] hover:text-[#E3B685] transition-colors"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin text-[#E3B685]" />
          ) : (
            <Search size={18} strokeWidth={2} />
          )}
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || brands.length > 0 || categories.length > 0 || query.length >= 2) setShowDropdown(true);
          }}
          placeholder="Search..."
          className="flex-1 bg-transparent text-[#3A2121] text-sm outline-none placeholder:text-[#3A2121]/40 placeholder:font-light font-secondary tracking-wide"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clear();
              setShowDropdown(false);
            }}
            className="text-[#3A2121]/30 hover:text-[#3A2121] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-[calc(100%+12px)] left-0 w-full bg-white shadow-xl shadow-[#3A2121]/5 rounded-xl overflow-hidden border border-[#E3B685]/20 z-50"
          >
            {loading ? (
              <div className="p-8 text-center bg-white">
                <Loader2
                  className="animate-spin mx-auto text-[#E3B685]"
                  size={20}
                />
                <p className="text-[10px] uppercase tracking-widest text-[#3A2121]/50 mt-3 font-medium">
                  Searching
                </p>
              </div>
            ) : results.length > 0 || brands.length > 0 || categories.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Brands */}
                {brands.length > 0 && (
                  <>
                    <div className="px-5 py-3 text-[10px] uppercase font-bold text-[#E3B685] tracking-widest bg-[#FAF9F6] sticky top-0 backdrop-blur-sm z-10 border-b border-[#E3B685]/10">
                      Brands
                    </div>
                    <ul>
                      {brands.map((item) => (
                        <li
                          key={`brand-${item.id}`}
                          className="border-b border-[#E3B685]/10 group"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-4 p-4 hover:bg-[#FAF9F6] transition-colors"
                          >
                            <div className="text-sm text-[#3A2121] font-medium group-hover:text-[#E3B685] transition-colors font-secondary">
                              {item.name}
                            </div>
                            <span className="text-[10px] text-[#3A2121]/40 uppercase">
                              {item.type}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {/* Categories */}
                {categories.length > 0 && (
                  <>
                    <div className="px-5 py-3 text-[10px] uppercase font-bold text-[#E3B685] tracking-widest bg-[#FAF9F6] border-b border-[#E3B685]/10">
                      Categories
                    </div>
                    <ul>
                      {categories.map((item) => (
                        <li
                          key={`cat-${item.id}`}
                          className="border-b border-[#E3B685]/10 group"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-4 p-4 hover:bg-[#FAF9F6] transition-colors"
                          >
                            <div className="text-sm text-[#3A2121] font-medium group-hover:text-[#E3B685] transition-colors font-secondary">
                              {item.name}
                            </div>
                            <span className="text-[10px] text-[#3A2121]/40 uppercase">
                              {item.type}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {/* Products */}
                {results.length > 0 && (
                  <>
                    <div className="px-5 py-3 text-[10px] uppercase font-bold text-[#E3B685] tracking-widest bg-[#FAF9F6] border-b border-[#E3B685]/10">
                      Products
                    </div>
                    <ul>
                      {results.map((item) => (
                        <li
                          key={item.id}
                          className="border-b border-[#E3B685]/10 last:border-none group"
                        >
                          <Link
                            href={getProductHref(item)}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-4 p-4 hover:bg-[#FAF9F6] transition-colors"
                          >
                        <div className="relative w-12 h-12 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden border border-[#E3B685]/20 group-hover:border-[#E3B685] transition-colors">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="text-[10px] text-[#E3B685] font-bold uppercase tracking-wider mb-1">
                            {item.brand}
                          </div>
                          <div className="text-sm text-[#3A2121] font-medium truncate leading-snug group-hover:text-[#E3B685] transition-colors font-secondary">
                            {item.title}
                          </div>
                          {item.reference && (
                            <div className="text-[10px] text-[#3A2121]/40 mt-0.5 font-mono">
                              {item.reference}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                </>
                )}
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setShowDropdown(false)}
                  className="block w-full p-4 text-center text-xs font-bold text-[#3A2121] hover:text-[#E3B685] hover:bg-[#FAF9F6] transition-all border-t border-[#E3B685]/10 uppercase tracking-widest"
                >
                  View All Results
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center bg-white text-[#3A2121]/50">
                <p className="text-sm font-medium">No results found.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
