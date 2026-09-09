'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ChevronRight } from 'lucide-react';
import { useSearch, type SearchResult } from '@/hooks/useSearch';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchOverlay({
  isOpen,
  onClose,
}: MobileSearchOverlayProps) {
  const { query, setQuery, results, brands, categories, loading, clear } = useSearch({
    limit: 8,
    debounceMs: 350,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const getProductHref = (item: SearchResult): string => {
    return `/product/${item.slug}`;
  };

  const handleClose = () => {
    clear();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[60] bg-[#FAF9F6] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#E3B685]/20 bg-white shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center bg-[#FAF9F6] border border-[#E3B685]/20 px-4 py-2.5 rounded-full transition-colors focus-within:border-[#E3B685] focus-within:bg-white"
            >
              <Search size={18} className="text-[#3A2121] mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent border-none outline-none text-[#3A2121] placeholder-[#3A2121]/40 text-base font-secondary"
              />
              {loading && (
                <Loader2
                  size={16}
                  className="animate-spin text-[#E3B685] ml-2"
                />
              )}
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => clear()}
                  className="p-1 ml-2 text-[#3A2121]/40 hover:text-[#3A2121]"
                >
                  <X size={16} />
                </button>
              )}
            </form>
            <button
              onClick={handleClose}
              className="text-[#3A2121] font-medium text-sm hover:text-[#E3B685] transition-colors p-2"
            >
              Cancel
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto">
            {query.length >= 2 ? (
              <div className="p-4 safe-bottom">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[#3A2121]/40">
                    <Loader2
                      size={24}
                      className="animate-spin mb-3 text-[#E3B685]"
                    />
                    <span className="text-xs uppercase tracking-widest font-medium">
                      Searching...
                    </span>
                  </div>
                ) : results.length > 0 || brands.length > 0 || categories.length > 0 ? (
                  <div className="space-y-6">
                    {/* Brands */}
                    {brands.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-[#E3B685] uppercase tracking-widest mb-3 px-1">
                          Brands
                        </div>
                        <ul className="space-y-2">
                          {brands.map((item) => (
                            <li
                              key={`brand-${item.id}`}
                              className="bg-white rounded-xl shadow-sm border border-[#E3B685]/10 overflow-hidden active:scale-[0.99] transition-transform duration-200"
                            >
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between p-3"
                              >
                                <span className="text-sm font-medium text-[#3A2121] font-secondary">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-[#3A2121]/40 uppercase">
                                  {item.type}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Categories */}
                    {categories.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-[#E3B685] uppercase tracking-widest mb-3 px-1">
                          Categories
                        </div>
                        <ul className="space-y-2">
                          {categories.map((item) => (
                            <li
                              key={`cat-${item.id}`}
                              className="bg-white rounded-xl shadow-sm border border-[#E3B685]/10 overflow-hidden active:scale-[0.99] transition-transform duration-200"
                            >
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between p-3"
                              >
                                <span className="text-sm font-medium text-[#3A2121] font-secondary">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-[#3A2121]/40 uppercase">
                                  {item.type}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Products */}
                    {results.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-[#E3B685] uppercase tracking-widest mb-4 px-1">
                          Products
                        </div>
                        <ul className="space-y-3">
                          {results.map((item) => (
                            <li
                              key={item.id}
                              className="bg-white rounded-xl shadow-sm border border-[#E3B685]/10 overflow-hidden active:scale-[0.99] transition-transform duration-200"
                            >
                              <Link
                                href={getProductHref(item)}
                                onClick={onClose}
                                className="flex items-center p-3 gap-4"
                              >
                              <div className="relative w-16 h-16 flex-shrink-0 bg-[#FAF9F6] rounded-lg overflow-hidden border border-[#E3B685]/10">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] text-[#E3B685] font-bold uppercase tracking-wider mb-1">
                                  {item.brand}
                                </div>
                                <h4 className="text-sm font-medium text-[#3A2121] truncate leading-tight font-secondary mb-1">
                                  {item.title}
                                </h4>
                                {item.reference && (
                                  <div className="text-[10px] text-[#3A2121]/40 truncate font-mono">
                                    {item.reference}
                                  </div>
                                )}
                              </div>
                                <ChevronRight
                                  size={18}
                                  className="text-[#E3B685]/50"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 text-center text-xs font-bold text-white bg-[#3A2121] rounded-xl hover:bg-[#3A2121]/90 transition-colors uppercase tracking-widest shadow-lg shadow-[#3A2121]/10"
                    >
                      View All Results
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-20 text-[#3A2121]/40">
                    <p className="font-secondary">
                      No results found for "{query}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Empty State / Suggestions
              <div className="flex flex-col items-center justify-center h-full text-[#3A2121]/20 pb-20 px-8 text-center">
                <Search
                  size={48}
                  strokeWidth={1}
                  className="mb-4 text-[#E3B685]/30"
                />
                <p className="text-sm font-medium text-[#3A2121]/40 font-secondary">
                  Start typing to search for
                  <br />
                  exclusive watches and jewellery
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
