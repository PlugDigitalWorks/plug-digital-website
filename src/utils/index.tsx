import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-ğüşıöç]/g, '') // Remove unwanted characters
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/-+/g, '-'); // Remove repeated dashes
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
};

export const getCookie = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const removeCookie = (name: string): void => {
  if (typeof window !== 'undefined') {
    const date = new Date();
    date.setTime(date.getTime() + 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=true;${expires};path=/`;
  }
};

export const setCookie = (
  name: string,
  value: string,
  minutes: number,
): void => {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value};${expires};path=/`;
  }
};

export const formatDateTime = (date: Date | string): string => {
  return format(new Date(date), 'HH:MM - dd MMMM yyyy', { locale: tr });
};
