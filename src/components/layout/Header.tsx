'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { HEADER_MENU } from '@/mocks/header';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import Link from 'next/link';
import CartModal from '@/components/modals/CartModal';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import type { Brand, Category } from '@/lib/definitions';
import HeaderSearch from './HeaderSearch';
import MobileSearchOverlay from './MobileSearchOverlay';
import { Search } from 'lucide-react';

/* ===================== HELPERS ===================== */

type LinkItem = { label: string; href: string };

const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const ensure2D = (arr?: LinkItem[] | LinkItem[][]): LinkItem[][] => {
  if (!arr) return [];
  if (Array.isArray(arr[0])) return arr as LinkItem[][];
  return [arr as LinkItem[]];
};

const safeArray = <T,>(d: any): T[] => (Array.isArray(d) ? d : []);

/* ===================== TYPES ===================== */

interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  dropdown?: boolean;
  brands?: LinkItem[][];
  categories?: LinkItem[][];
}

/* ===================== COMPONENT ===================== */

export default function Header() {
  const router = useRouter();
  const { cart, cartOpen, openCart, closeCart } = useCart();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(
    null,
  );

  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((t, i) => t + i.quantity, 0);

  /* ===================== NORMALIZE STATIC MENU ===================== */

  const normalizeMenu = (menu: any[]): MenuItem[] =>
    menu.map((item) => ({
      ...item,
      brands: ensure2D(item.brands),
      categories: ensure2D(item.categories),
    }));

  const [dynamicMenu, setDynamicMenu] = useState<MenuItem[]>(
    normalizeMenu(HEADER_MENU),
  );

  /* ===================== BODY SCROLL LOCK (MOBILE) ===================== */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* ===================== CLICK OUTSIDE (DESKTOP DROPDOWN) ===================== */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(t) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(t)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ===================== FETCH DYNAMIC MENU ===================== */

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [
          watchBrandsRaw,
          watchCategoriesRaw,
          jewelleryBrandsRaw,
          jewelleryCategoriesRaw,
        ] = await Promise.all([
          fetch('/api/brands?type=WATCH').then((r) => r.json()),
          fetch('/api/categories?type=WATCH').then((r) => r.json()),
          fetch('/api/brands?type=JEWELLERY').then((r) => r.json()),
          fetch('/api/categories?type=JEWELLERY').then((r) => r.json()),
        ]);

        const watchBrands = safeArray<Brand>(watchBrandsRaw);
        const watchCategories = safeArray<Category>(watchCategoriesRaw);
        const jewelleryBrands = safeArray<Brand>(jewelleryBrandsRaw);
        const jewelleryCategories = safeArray<Category>(jewelleryCategoriesRaw);

        const transformBrands = (
          brands: Brand[],
          type: 'watch' | 'jewellery',
        ): LinkItem[] =>
          brands.map((b) => ({
            label: toTitleCase(b.name),
            href: `/${type}?brand=${encodeURIComponent(b.slug || normalizeName(b.name))}`,
          }));
        console.log(transformBrands(watchBrands, 'watch'));
        const transformCategories = (
          cats: Category[],
          type: 'watch' | 'jewellery',
        ): LinkItem[] =>
          cats.map((c) => ({
            label: c.name,
            href: `/${type}/${encodeURIComponent(c.slug || '')}`,
          }));
        console.log(transformBrands(jewelleryBrands, 'jewellery'));

        const splitCols = (items: LinkItem[], n = 13): LinkItem[][] => {
          const cols: LinkItem[][] = [];
          for (let i = 0; i < items.length; i += n)
            cols.push(items.slice(i, i + n));
          return cols;
        };

        const updated = normalizeMenu(HEADER_MENU).map((item) => {
          if (item.label === 'Buy a Watch') {
            const brandsCols = splitCols(transformBrands(watchBrands, 'watch'));
            const categoriesCols = splitCols(
              transformCategories(watchCategories, 'watch'),
            );
            if (brandsCols[0])
              brandsCols[0].unshift({
                label: 'See All Watches',
                href: '/watch',
              });
            return { ...item, brands: brandsCols, categories: categoriesCols };
          }

          if (item.label === 'Jewellery') {
            const brandsCols = splitCols(
              transformBrands(jewelleryBrands, 'jewellery'),
            );
            const categoriesCols = splitCols([
              { label: 'All Jewellery', href: '/jewellery' },
              ...transformCategories(jewelleryCategories, 'jewellery'),
            ]);
            return { ...item, brands: brandsCols, categories: categoriesCols };
          }

          return item;
        });

        setDynamicMenu(updated);
      } catch (e) {
        console.error('Header menu fetch error:', e);
        setDynamicMenu(normalizeMenu(HEADER_MENU));
      }
    };

    fetchMenu();
  }, []);

  /* ===================== RENDER ===================== */

  return (
    <header className="w-full border-b border-[#EAD6C2] bg-white relative">
      {/* TOP BAR */}
      <div className="bg-primary">
        <div className="flex justify-between items-center px-4 py-2 text-xs mx-auto max-w-[1160px] text-white">
          <div className="flex items-center gap-2">
            <Image src="/icons/phone.svg" alt="Phone" width={16} height={16} />
            +44 (0) 20 7430 2799
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/location.svg"
              alt="Location"
              width={16}
              height={16}
            />
            41 Beauchamp Place, London SW3 1NX
          </div>
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto max-lg:px-4">
        {/* MAIN HEADER */}
        <div className="flex items-center justify-between py-4 lg:py-6 gap-2 lg:gap-4">
          <Link
            href="/"
            className="flex-shrink-0 flex items-center"
            onClick={() => {
              setOpenDropdown(null);
              setMobileMenuOpen(false);
            }}
          >
            <Image
              src="/logo.svg"
              alt="Pacha of London"
              width={312}
              height={43}
              className="max-w-[180px] md:max-w-[312px] h-auto"
            />
          </Link>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="hidden lg:block">
              <HeaderSearch />
            </div>

            {/* Mobile Search Trigger */}
            <button
              className="lg:hidden p-1 text-[#3A2121]"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search strokeWidth={1.5} size={20} />
            </button>

            <button className="flex items-center gap-2" onClick={openCart}>
              <Image
                src="/icons/cart.svg"
                alt="Cart"
                width={24}
                height={24}
                className=""
              />
              <span className="text-primary font-medium max-lg:hidden">
                Cart ({cartItemCount})
              </span>
              <span className="text-primary font-medium lg:hidden">
                ({cartItemCount})
              </span>
            </button>

            {/* MOBILE HAMBURGER */}
            {mobileMenuOpen ? (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <Image
                  src="/icons/close.svg"
                  alt="Close"
                  width={24}
                  height={24}
                />
              </button>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Image
                  src="/icons/menu.svg"
                  alt="Menu"
                  width={24}
                  height={24}
                />
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex justify-between py-2" ref={navRef}>
          {dynamicMenu.map((item) => (
            <button
              key={item.label}
              className={clsx(
                'px-2 py-1 text-base font-medium flex items-center gap-1 border-b-2 border-transparent',
                openDropdown === item.label
                  ? 'text-[#E1B989] border-[#E1B989]'
                  : 'text-primary hover:border-[#E1B989]',
              )}
              onClick={() =>
                item.dropdown
                  ? setOpenDropdown(
                      openDropdown === item.label ? null : item.label,
                    )
                  : item.href && router.push(item.href)
              }
            >
              {item.label}
              {item.dropdown && (
                <Image
                  src="/icons/chevron-down.svg"
                  alt="Dropdown"
                  width={18}
                  height={18}
                  className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                />
              )}
            </button>
          ))}
        </nav>

        {/* DESKTOP DROPDOWN */}
        <div ref={dropdownRef} className="absolute left-0 top-full w-full z-20">
          {dynamicMenu.map((item) => {
            if (!item.dropdown) return null;
            const brands = ensure2D(item.brands);
            const categories = ensure2D(item.categories);
            const isOpen = openDropdown === item.label;

            return (
              <div
                key={item.label}
                className={clsx(
                  'absolute top-0 left-0 w-full bg-white border border-[#EAD6C2] shadow-lg py-8 transition-all duration-300',
                  isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2',
                )}
              >
                <div className="max-w-[1160px] mx-auto px-6 flex gap-12">
                  <div className="flex-[5]">
                    <div className="font-semibold mb-3 text-lg">
                      {item.label === 'Jewellery'
                        ? 'Branded Jewellery'
                        : 'Brands'}
                    </div>
                    <div className="flex gap-12 overflow-x-auto">
                      {brands.map((col, i) => (
                        <ul
                          key={i}
                          className="flex flex-col gap-2 min-w-[180px]"
                        >
                          {col.map((b) => (
                            <li key={b.label}>
                              <Link
                                href={b.href}
                                onClick={() => setOpenDropdown(null)}
                                className="text-primary hover:text-[#E1B989]"
                              >
                                {b.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>

                  <div className="flex-[3]">
                    <div className="font-semibold mb-3 text-lg">Categories</div>
                    <div className="flex gap-12 overflow-x-auto">
                      {categories.map((col, i) => (
                        <ul
                          key={i}
                          className="flex flex-col gap-2 min-w-[180px]"
                        >
                          {col.map((c) => (
                            <li key={c.label}>
                              <Link
                                href={c.href}
                                onClick={() => setOpenDropdown(null)}
                                className="text-primary hover:text-[#E1B989]"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-[105px] left-0 w-full h-[calc(100dvh-105px)] bg-white z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto h-full p-6">
          {dynamicMenu.map((item) => (
            <button
              key={item.label}
              className="flex justify-between w-full text-lg text-primary py-4 border-b"
              onClick={() => {
                if (item.dropdown) setMobileSubmenuOpen(item.label);
                else if (item.href) {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }
              }}
            >
              {item.label}
              {item.dropdown && (
                <Image
                  src="/icons/chevron-down.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="-rotate-90"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE SUBMENU */}
      {mobileSubmenuOpen && mobileMenuOpen && (
        <div className="fixed top-[105px] right-0 w-full h-[calc(100dvh-105px)] bg-white z-50 transition-transform duration-300">
          <div className="p-6 overflow-y-auto h-full">
            <button
              onClick={() => setMobileSubmenuOpen(null)}
              className="flex items-center gap-2 mb-6"
            >
              <Image
                src="/icons/chevron-down.svg"
                alt=""
                width={20}
                height={20}
                className="rotate-90"
              />
              <span className="font-semibold">{mobileSubmenuOpen}</span>
            </button>

            {(() => {
              const item = dynamicMenu.find(
                (i) => i.label === mobileSubmenuOpen,
              );
              if (!item) return null;
              const brands = ensure2D(item.brands).flat();
              const categories = ensure2D(item.categories).flat();

              return (
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold mb-2">Brands</div>
                    {brands.map((b) => (
                      <Link
                        key={b.label}
                        href={b.href}
                        className="block py-2 text-primary"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileSubmenuOpen(null);
                        }}
                      >
                        {b.label}
                      </Link>
                    ))}
                  </div>

                  <div>
                    <div className="text-xs font-semibold mb-2">Categories</div>
                    {categories.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block py-2 text-primary"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileSubmenuOpen(null);
                        }}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <CartModal show={cartOpen} onClose={closeCart} />
      {mobileSearchOpen && (
        <MobileSearchOverlay
          isOpen={mobileSearchOpen}
          onClose={() => setMobileSearchOpen(false)}
        />
      )}
    </header>
  );
}
