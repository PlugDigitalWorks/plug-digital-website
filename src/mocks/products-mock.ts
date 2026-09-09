export type Watch = {
  id: number;
  slug: string;
  brand: string;
  brandColor: string;
  title: string;
  subtitle: string;
  reference: string;
  price: number;
  image: string;
  images: string[];
  guarantee: string[];
  basicInfo: Record<string, string>;
  additionalInfo: Record<string, string>;
  description: string;
};

export type Jewellery = {
  id: number;
  slug: string;
  brand: string;
  brandColor: string;
  title: string;
  subtitle: string;
  reference: string;
  price: number;
  image: string;
  images: string[];
  guarantee: string[];
  basicInfo?: Record<string, string>;
  description?: string;
};

export const watches: Watch[] = [
  {
    id: 1,
    slug: 'rolex-gmt-master-ii',
    brand: 'ROLEX',
    brandColor: 'gold',
    title: 'Rolex Gmt-Master II',
    subtitle:
      'SARU, gemstones & diamonds, 40mm, 18k yellow gold, off-catalogue',
    reference: '116578SARU',
    price: 145000,
    image: '/images/watch-1.png',
    images: [
      '/images/watch-1.png',
      '/images/watch-1.png',
      '/images/watch-1.png',
      '/images/watch-1.png',
      '/images/watch-1.png',
    ],
    guarantee: [
      'Authenticity Guarantee',
      'Free Overnight Shipping',
      '2-Year Warranty',
    ],
    basicInfo: {
      Brand: 'Rolex',
      Model: 'GMT-Master II',
      ReferenceNumber: '116578SARU',
      NewOrPreOwned: 'Pre-owned',
      Condition: '0 (new/unworn)',
      Papers: 'Yes',
      Box: 'Yes',
      Year: '2007',
      Movement: 'Automatic',
      BraceletMaterial: 'Yellow Gold',
      CaseMaterial: 'Yellow Gold',
    },
    additionalInfo: {
      Clasp: 'Yellow',
      ClaspMaterial: 'Double-fold clasp',
      CaseDiameter: '40',
      MaterialBezel: '18k and gemstones',
      Glass: 'Sapphire Glass',
      Dial: 'Black',
    },
    description: `This watch is used but in MINT condition, ready to ship, and will come as full set with all original Rolex accessories when purchased. The oyster band is in immaculate shape as seen in the photo gallery. This timepiece was originally purchased from AD in November 2021 as indicated on its warranty card.\n\nAll of our watches are 100% guaranteed authentic.\n\nEvery watch in our collection goes through a rigorous multipoint inspection to ensure authenticity. If need be, our timepieces are carefully serviced and detailed with only authentic original parts from the manufacturer.\n\nWe are also accepting trade-ins or offer you a cash value for your timepiece. Please be prepared with an estimate of how much you would want to get for your watch. We will inform you if we are interested ONLY after giving us your estimate. We will not make an offer before you inform us of your own estimate. Our offers are subject to change at any time.`,
  },
  {
    id: 2,
    slug: 'van-cleef-arpels-classique',
    brand: 'VAN CLEEF & ARPELS',
    brandColor: 'gold',
    title: 'Van Cleef & Arpels Classique',
    subtitle:
      'Unique piece in 18k white gold set with round brilliant cut diamonds and gemstones',
    reference: 'VC123456',
    price: 165000,
    image: '/images/watch-2.png',
    images: [
      '/images/watch-2.png',
      '/images/watch-2.png',
      '/images/watch-2.png',
      '/images/watch-2.png',
      '/images/watch-2.png',
    ],
    guarantee: [
      'Authenticity Guarantee',
      'Free Overnight Shipping',
      '2-Year Warranty',
    ],
    basicInfo: {
      Brand: 'Van Cleef & Arpels',
      Model: 'Classique',
      ReferenceNumber: 'VC123456',
      NewOrPreOwned: 'Pre-owned',
      Condition: 'Excellent',
      Papers: 'Yes',
      Box: 'Yes',
      Year: '2015',
      Movement: 'Quartz',
      BraceletMaterial: 'White Gold',
      CaseMaterial: 'White Gold',
    },
    additionalInfo: {
      Clasp: 'White Gold',
      ClaspMaterial: 'Double-fold clasp',
      CaseDiameter: '36',
      MaterialBezel: '18k and gemstones',
      Glass: 'Sapphire Glass',
      Dial: 'Silver',
    },
    description: `A unique piece in 18k white gold set with round brilliant cut diamonds and gemstones. Comes with original box and papers.`,
  },
  {
    id: 3,
    slug: 'assorted-diamond-timepiece',
    brand: 'ASSORTED',
    brandColor: 'gold',
    title: 'Assorted Diamond Timepiece',
    subtitle:
      'Concord 18k yellow and white gold, bezel, case and lugs set with round brilliant cut diamonds',
    reference: 'CDT987654',
    price: 165000,
    image: '/images/watch-3.png',
    images: [
      '/images/watch-3.png',
      '/images/watch-3.png',
      '/images/watch-3.png',
      '/images/watch-3.png',
      '/images/watch-3.png',
    ],
    guarantee: [
      'Authenticity Guarantee',
      'Free Overnight Shipping',
      '2-Year Warranty',
    ],
    basicInfo: {
      Brand: 'Concord',
      Model: 'Diamond Timepiece',
      ReferenceNumber: 'CDT987654',
      NewOrPreOwned: 'Pre-owned',
      Condition: 'Very Good',
      Papers: 'No',
      Box: 'No',
      Year: '2012',
      Movement: 'Quartz',
      BraceletMaterial: 'Yellow Gold',
      CaseMaterial: 'Yellow Gold',
    },
    additionalInfo: {
      Clasp: 'Yellow Gold',
      ClaspMaterial: 'Double-fold clasp',
      CaseDiameter: '38',
      MaterialBezel: '18k and diamonds',
      Glass: 'Sapphire Glass',
      Dial: 'Gold',
    },
    description: `Concord 18k yellow and white gold, bezel, case and lugs set with round brilliant cut diamonds. Pre-owned, comes without box and papers.`,
  },
];

export const jewelleries: Jewellery[] = [
  {
    id: 1,
    slug: 'louis-vuitton-locket-double-ring',
    brand: 'LOUIS VUITTON',
    brandColor: 'gold',
    title: 'Branded Jewellery Louis Vuitton Locket Double ring',
    subtitle: 'Diamonds, 18k white gold, Double ring, Locket',
    reference: '116578SARU',
    price: 4750,
    image: '/images/jewellery-1.png',
    images: [
      '/images/jewellery-1.png',
      '/images/jewellery-1.png',
      '/images/jewellery-1.png',
      '/images/jewellery-1.png',
      '/images/jewellery-1.png',
    ],
    guarantee: [
      'Authenticity Guarantee',
      'Free Overnight Shipping',
      '2-Year Warranty',
    ],
    basicInfo: {
      'New or Pre-owned': 'Pre-owned',
      Condition: '1 (mint)',
      Gender: 'Unisex',
      Location: 'London',
      'Delivery Time': 'Immediately',
      Papers: 'Yes',
      Box: 'Yes',
      Material: 'Platinum',
      Carat: '0.40',
      Colour: 'G',
      Clarity: 'SI1',
    },
    description:
      'This ring is used but in MINT condition, ready to ship, and will come as full set with all original accessories. Diamonds, 18k white gold, Double ring, Locket.',
  },
  {
    id: 2,
    slug: 'bvlgari-bzero1',
    brand: 'BZERO 1',
    brandColor: 'gold',
    title: 'Branded Jewellery Bzero 1',
    subtitle:
      'Bvlgari Bzero1 collection Black ceramic with rose gold and diamonds. Size 52',
    reference: 'RRPE4830',
    price: 3600,
    image: '/images/jewellery-2.png',
    images: [
      '/images/jewellery-2.png',
      '/images/jewellery-2.png',
      '/images/jewellery-2.png',
      '/images/jewellery-2.png',
      '/images/jewellery-2.png',
    ],
    guarantee: ['Authenticity Guarantee', 'Free Overnight Shipping'],
    basicInfo: {
      'New or Pre-owned': 'Pre-owned',
      Condition: 'Excellent',
      Material: 'Black ceramic, rose gold, diamonds',
      Size: '52',
    },
    description:
      'Bvlgari Bzero1 collection Black ceramic with rose gold and diamonds. Size 52.',
  },
  {
    id: 3,
    slug: 'jewellery-collection-lip-pendant',
    brand: 'NECKLACE',
    brandColor: 'gold',
    title: 'Jewellery Collection Lip Pendant',
    subtitle:
      'Lip design drop pendant 1.50ct Round brilliant cut diamonds G colour-Vs clarity',
    reference: 'N/A',
    price: 3950,
    image: '/images/jewellery-3.png',
    images: [
      '/images/jewellery-3.png',
      '/images/jewellery-3.png',
      '/images/jewellery-3.png',
      '/images/jewellery-3.png',
      '/images/jewellery-3.png',
    ],
    guarantee: ['Authenticity Guarantee'],
    basicInfo: {
      'New or Pre-owned': 'New',
      Material: '18k white gold',
      Diamonds: '1.50ct',
      Colour: 'G',
      Clarity: 'VS',
    },
    description:
      'Lip design drop pendant 1.50ct Round brilliant cut diamonds G colour-Vs clarity.',
  },
];
