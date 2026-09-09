export const HEADER_MENU = [
  {
    label: 'Buy a Watch',
    icon: 'cart',
    dropdown: true,
    brands: [
      [
        { label: 'See All Watches', href: '/watch' },
        { label: 'Rolex', href: '/watch?brand=rolex' },
        { label: 'Bvlgari', href: '/watch?brand=bvlgari' },
        { label: 'Patek Philippe', href: '/watch?brand=patek-philippe' },
        { label: 'Chanel', href: '/watch?brand=chanel' },
        { label: 'Breitling', href: '/watch?brand=breitling' },
        { label: 'Cartier', href: '/watch?brand=cartier' },
      ],
      // [
      //   { label: "Audemars Piguet", href: "/watch?brand=audemars-piguet" },
      //   { label: "Omega", href: "/watch?brand=omega" },
      //   { label: "Franck Muller", href: "/watch?brand=franck-muller" },
      //   { label: "IWC", href: "/watch?brand=iwc" },
      //   { label: "Panerai", href: "/watch?brand=panerai" },
      //   { label: "Hublot", href: "/watch?brand=breitling" },
      //   { label: "Chopard", href: "/watch?brand=chopard" },
      // ],
    ],
    categories: [
      [
        { label: "Men's Watches", href: '/watch?category=men%27s-watches' },
        { label: "Women's Watches", href: '/watch?category=women%27s-watches' },
        { label: 'Popular Watches', href: '/watch?category=popular-watches' },
        // {
        //   label: 'Mechanical Watches',
        //   href: '/watch?category=mechanical-watches',
        // },
        // {
        //   label: 'Automatic Watches',
        //   href: '/watch?category=automatic-watches',
        // },
        // { label: 'Vintage Watches', href: '/watch?category=vintage-watches' },
      ],
      // [
      //   { label: 'Chronographs', href: '/watch?category=chronographs' },
      //   { label: 'Diving Watches', href: '/watch?category=diving-watches' },
      //   { label: "Pilot's Watches", href: '/watch?category=pilot%27s-watches' },
      //   { label: 'Military Watches', href: '/watch?category=military-watches' },
      //   { label: 'Swiss Watches', href: '/watch?category=swiss-watches' },
      //   {
      //     label: 'Affordable Watches',
      //     href: '/watch?category=affordable-watches',
      //   },
      //   { label: 'Popular Watches', href: '/watch?category=popular-watches' },
      // ],
      // [
      //   {
      //     label: 'Bracelets and Staps',
      //     href: '/watch?category=bracelets-and-staps',
      //   },
      //   {
      //     label: 'Parts and Accessories',
      //     href: '/watch?category=parts-and-accessories',
      //   },
      // ],
    ],
  },
  {
    label: 'Sell Your Watch',
    icon: 'sell',
    href: '/sell-your-watch',
    dropdown: false,
  },
  {
    label: 'Bags',
    icon: 'sell',
    href: '/bag',
    dropdown: false,
  },
  {
    label: 'Jewellery',
    icon: 'jewellery',
    dropdown: true,
    brands: [
      // {
      //   label: 'Van Cleef & Arpels',
      //   href: '/jewellery?brand=van-cleef-%26-arpels',
      // },
      {
        label: 'BRACELETS, Jewellery Collection',
        href: '/jewellery?brand=cmkf71zwc005if73sy81aopuk',
      },
      {
        label: 'Cartier Earrings',
        href: '/jewellery?brand=cmkf75495007uf73s7l32k0kj',
      },
      {
        label: 'Cartier Jewellery Collection',
        href: '/jewellery?brand=cmkf74aok006xf73sxyxyto2y',
      },
      { label: 'Chatila', href: '/jewellery?brand=cmkf72b88005tf73srmudpiw3' },
      { label: 'Necklace', href: '/jewellery?brand=cmkf71t9i0054f73s2uvb2yfz' },
      { label: 'Rings', href: '/jewellery?brand=cmkf71rbr004xf73su257jjpj' },
      { label: 'Tiffany', href: '/jewellery?brand=cmkf75hxt008gf73s9dbk65in' },
    ],
    categories: [
      {
        label: 'Popular Jewelleries',
        href: '/jewellery?category=popular-jewelleries',
      },
      // { label: 'Bracelets', href: '/jewellery?category=bracelets' },
      // { label: 'Earring', href: '/jewellery?category=earring' },
      // { label: 'Necklaces', href: '/jewellery?category=necklaces' },
      { label: 'All Jewellery', href: '/jewellery' },
    ],
  },
  {
    label: 'Services',
    icon: 'services',
    dropdown: false,
    href: '/services',
  },
  {
    label: 'About',
    icon: 'about',
    dropdown: false,
    href: '/about',
  },
];

export const MOBILE_MENU = [
  { label: 'Buy a Watch', icon: 'cart', href: '/watch' },
  { label: 'Sell Your Watch', icon: 'sell', href: '/sell-your-watch' },
  { label: 'Jewellery', icon: 'jewellery', href: '/jewellery' },
  { label: 'Services', icon: 'services', href: '/services' },
  { label: 'About', icon: 'about', href: '/about' },
  { label: 'Blog', icon: 'blog', href: '/blog' },
  { label: 'Buy', icon: 'bag' },
  { label: 'Sell', icon: 'tag' },
  { label: 'Previous Visits', icon: 'clock' },
  { label: 'Profile', icon: 'user', href: '/profile' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Log Out', icon: 'logout' },
];
