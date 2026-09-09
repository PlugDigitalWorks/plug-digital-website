import { headers } from 'next/headers';

const WHATSAPP_HIDDEN_COUNTRIES = new Set(['IN']);

export function shouldShowWhatsApp(
  countryCode: string | null | undefined,
): boolean {
  if (!countryCode) return true;
  return !WHATSAPP_HIDDEN_COUNTRIES.has(countryCode.toUpperCase());
}

export async function getVisitorCountryCode(): Promise<string | null> {
  const headersList = await headers();

  return (
    headersList.get('cf-ipcountry') ||
    headersList.get('CF-IPCountry') ||
    headersList.get('x-country') ||
    null
  );
}

export async function shouldShowWhatsAppForVisitor(): Promise<boolean> {
  const countryCode = await getVisitorCountryCode();
  return shouldShowWhatsApp(countryCode);
}
