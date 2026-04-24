export const mockPortfolio = {
  totalBalance: 42560.84,
  monthlyChangePercentage: 12.4,
  sentiment: {
    score: 78,
    label: 'Extreme Greed',
    volatility: 'Low (14.2)',
    globalTrend: 'Ascending'
  },
  holdings: [
    { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA Corporation', price: 120.45, change: 2.4, isUp: true },
    { id: 'TSLA', symbol: 'TSLA', name: 'Tesla, Inc.', price: 180.20, change: -0.8, isUp: false },
    { id: 'AMZN', symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 180.12, change: 1.1, isUp: true },
    { id: '005930.KS', symbol: 'SSNLF', name: 'Samsung Electronics', price: 75000, currency: 'KRW', change: 0.3, isUp: true }
  ]
};

export const mockCategories = [
  { id: 'SOXX', symbol: 'SOXX', name: 'Blue Chip Semiconductors', price: 1244.50, change: 3.2, isUp: true, icon: 'cpu' },
  { id: 'ICLN', symbol: 'ICLN', name: 'Renewable Energy', price: 842.20, change: 1.8, isUp: true, icon: 'leaf' },
  { id: 'VNQ', symbol: 'VNQ', name: 'Real Estate Trusts', price: 512.10, change: -0.4, isUp: false, icon: 'building' },
];

export const mockStockDetail = {
  id: '005930.KS',
  symbol: '005930.KS',
  name: 'Samsung Electronics',
  category: 'Technology',
  market: 'KRX',
  price: 75400,
  currency: 'KRW',
  changeAmount: 1200,
  changePercentage: 1.62,
  isUp: true,
  stats: {
    open: '74,200',
    high: '75,800',
    low: '73,900',
    vol: '14.2M',
    mktCap: '450.2T',
    peRatio: '18.42',
    divYield: '2.14%',
    high52w: '79,000'
  },
  annualPerformance: [
    { year: '2020', revenue: 236.8, profit: 35.9 },
    { year: '2021', revenue: 279.6, profit: 51.6 },
    { year: '2022', revenue: 302.2, profit: 43.3 },
    { year: '2023 (Est)', revenue: 258.9, profit: 6.5 },
  ],
  peerAnalysis: [
    { name: 'Samsung Elec.', cap: '438.2T', per: 12.8, roe: '17.2%', div: '2.4%', debt: '36.1%', isMain: true },
    { name: 'SK Hynix', cap: '96.5T', per: 18.4, roe: '14.1%', div: '1.2%', debt: '48.3%' },
    { name: 'Intel', cap: '242.1T', per: 15.9, roe: '9.2%', div: '3.1%', debt: '52.4%' },
    { name: 'TSMC', cap: '712.4T', per: 24.1, roe: '34.8%', div: '1.8%', debt: '28.5%' },
  ]
};
