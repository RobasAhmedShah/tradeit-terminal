import { Stock, StockPerformance, StockMetrics, AIInsight, StockNews } from '../types';
export type { Stock, StockPerformance, StockMetrics, AIInsight, StockNews };

// ─── Master stock registry ────────────────────────────────────────────────────
// Every symbol referenced anywhere in the app must live here so that
// stock/[symbol].tsx and spot/[symbol].tsx never show "Stock not found."

export const MOCK_MARKET_STOCKS: Stock[] = [
  // ── FANM ─────────────────────────────────────────────────────────────────
  {
    id: 'm1', symbol: 'FANM', name: 'Fauji Fertilizer Co. Ltd.',
    price: 904.00, buyPrice: 903.50, sellPrice: 904.50,
    changePercent: 1.69, changeValue: 15.00, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 882.00, high: 910.00, low: 875.00, lcl: 842.00,
    volume: 1250000, avgVolume: '2.14M', marketCap: 'Rs 215.45B',
    peRatio: 5.32, eps: 169.92, dividendYield: 5.42,
    annualDividend: 12.95, exDividendDate: 'May 22, 2025',
    payDate: 'Jun 12, 2025', dividendFreq: 'Semi-Annual',
    sector: 'Fertilizer', industry: 'Fertilizer',
    incorporated: '1978', employees: '3,482', website: 'ffc.com.pk',
    about: 'Fauji Fertilizer Company Limited is one of Pakistan\'s largest urea fertilizer manufacturers and a key player in the agriculture value chain.',
    performance: { oneDay: 1.69, oneWeek: 6.28, oneMonth: 11.34, threeMonth: 24.81, ytd: 19.72 },
    metrics: { priceToBook: 1.48, roe: 24.12, debtToEquity: 0.24, currentRatio: 2.15 },
    aiInsight: { badge: 'Bullish', text: 'FFC remains a sector leader with strong margins and healthy dividend yield. Demand outlook remains stable.' },
    news: [
      { id: 'n1', title: 'FFC announces record urea production in May 2025', source: 'Dawn News', time: '1h ago' },
      { id: 'n2', title: 'FFC declares interim dividend of Rs 12.95 per share', source: 'Business Recorder', time: '3h ago' },
    ],
  },

  // ── FFLM ─────────────────────────────────────────────────────────────────
  {
    id: 'm2', symbol: 'FFLM', name: 'Fauji Fertilizer Bin Qasim',
    price: 9.67, buyPrice: 9.66, sellPrice: 9.68,
    changePercent: 11.53, changeValue: 1.00, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 8.50, high: 9.80, low: 8.40, lcl: 8.20,
    volume: 4500000, avgVolume: '3.20M', marketCap: 'Rs 12.40B',
    peRatio: 12.5, eps: 0.77, dividendYield: 2.10,
    annualDividend: 0.20, exDividendDate: 'Jun 10, 2025',
    payDate: 'Jul 01, 2025', dividendFreq: 'Annual',
    sector: 'Fertilizer', industry: 'Fertilizer',
    incorporated: '1993', employees: '1,240', website: 'ffbl.com.pk',
    about: 'FFBL is a subsidiary of Fauji Foundation, engaged in manufacturing and marketing of fertilizers including DAP and urea.',
    performance: { oneDay: 11.53, oneWeek: 14.20, oneMonth: 18.40, threeMonth: 22.00, ytd: 15.30 },
    metrics: { priceToBook: 0.95, roe: 8.40, debtToEquity: 0.68, currentRatio: 1.12 },
    aiInsight: { badge: 'Neutral', text: 'FFBL shows recovery momentum but faces margin pressure from gas tariff hikes. Watch for improved DAP volumes.' },
    news: [
      { id: 'n1', title: 'FFBL reports improved DAP offtake in Q2 2025', source: 'The News', time: '2h ago' },
      { id: 'n2', title: 'Fertilizer sector benefits from government subsidy continuation', source: 'ARY News', time: '5h ago' },
    ],
  },

  // ── FTSM ─────────────────────────────────────────────────────────────────
  {
    id: 'm3', symbol: 'FTSM', name: 'Fauji Cement Company Ltd.',
    price: 23.09, buyPrice: 23.07, sellPrice: 23.11,
    changePercent: 10.01, changeValue: 2.10, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 21.00, high: 23.50, low: 20.80, lcl: 19.90,
    volume: 7800000, avgVolume: '5.60M', marketCap: 'Rs 28.90B',
    peRatio: 8.20, eps: 2.82, dividendYield: 3.80,
    annualDividend: 0.88, exDividendDate: 'Apr 15, 2025',
    payDate: 'May 05, 2025', dividendFreq: 'Annual',
    sector: 'Cement', industry: 'Building Materials',
    incorporated: '1992', employees: '2,150', website: 'faujicement.com.pk',
    about: 'Fauji Cement is one of the largest cement producers in Pakistan with a total installed capacity of 3.15 million tons per annum.',
    performance: { oneDay: 10.01, oneWeek: 12.50, oneMonth: 16.80, threeMonth: 20.40, ytd: 18.60 },
    metrics: { priceToBook: 1.10, roe: 14.20, debtToEquity: 0.42, currentRatio: 1.35 },
    aiInsight: { badge: 'Bullish', text: 'Rising construction activity and government PSDP spending bode well for FTSM. Capacity utilization at 78%.' },
    news: [
      { id: 'n1', title: 'Fauji Cement dispatches hit new monthly record in May 2025', source: 'Business Recorder', time: '3h ago' },
      { id: 'n2', title: 'Cement sector rallies on infrastructure spending news', source: 'Geo News', time: '6h ago' },
    ],
  },

  // ── REDCO ─────────────────────────────────────────────────────────────────
  {
    id: 'm4', symbol: 'REDCO', name: 'Resource Energy Dev. Corp.',
    price: 28.68, buyPrice: 28.65, sellPrice: 28.72,
    changePercent: 10.01, changeValue: 2.61, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: false,
    open: 26.00, high: 29.10, low: 25.80, lcl: 24.50,
    volume: 3200000, avgVolume: '2.80M', marketCap: 'Rs 8.60B',
    peRatio: 14.30, eps: 2.01, dividendYield: 1.50,
    annualDividend: 0.43, exDividendDate: 'Mar 20, 2025',
    payDate: 'Apr 10, 2025', dividendFreq: 'Annual',
    sector: 'Energy', industry: 'Oil & Gas Exploration',
    incorporated: '2005', employees: '680', website: 'redco.com.pk',
    about: 'Resource Energy Development Corporation is engaged in exploration, development, and production of oil and gas reserves across Pakistan.',
    performance: { oneDay: 10.01, oneWeek: 13.40, oneMonth: 19.20, threeMonth: 28.70, ytd: 22.50 },
    metrics: { priceToBook: 1.72, roe: 12.10, debtToEquity: 0.55, currentRatio: 1.60 },
    aiInsight: { badge: 'Bullish', text: 'Rising oil prices and new block awards support REDCO\'s growth outlook. Management guidance remains positive for FY25.' },
    news: [
      { id: 'n1', title: 'REDCO awarded two new exploration blocks in Balochistan', source: 'Dawn Business', time: '4h ago' },
      { id: 'n2', title: 'Oil & gas sector outperforms as crude touches $85/bbl', source: 'The Express Tribune', time: '7h ago' },
    ],
  },

  // ── BPL ──────────────────────────────────────────────────────────────────
  {
    id: 'm5', symbol: 'BPL', name: 'Bata Pakistan Ltd.',
    price: 56.86, buyPrice: 56.80, sellPrice: 56.92,
    changePercent: 10.00, changeValue: 5.17, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: false,
    open: 51.80, high: 57.50, low: 51.20, lcl: 49.80,
    volume: 1100000, avgVolume: '0.85M', marketCap: 'Rs 14.20B',
    peRatio: 18.60, eps: 3.06, dividendYield: 2.80,
    annualDividend: 1.59, exDividendDate: 'Feb 28, 2025',
    payDate: 'Mar 20, 2025', dividendFreq: 'Annual',
    sector: 'Consumer Goods', industry: 'Footwear',
    incorporated: '1951', employees: '1,850', website: 'bata.com.pk',
    about: 'Bata Pakistan Limited is the country\'s leading footwear brand, operating over 400 retail outlets and a large manufacturing plant in Batapur, Lahore.',
    performance: { oneDay: 10.00, oneWeek: 11.20, oneMonth: 14.50, threeMonth: 18.90, ytd: 16.40 },
    metrics: { priceToBook: 2.40, roe: 13.50, debtToEquity: 0.18, currentRatio: 2.10 },
    aiInsight: { badge: 'Neutral', text: 'Bata benefits from strong brand equity and retail expansion, but rising leather costs remain a margin risk.' },
    news: [
      { id: 'n1', title: 'Bata Pakistan opens 15 new stores in FY25', source: 'Tribune Express', time: '5h ago' },
      { id: 'n2', title: 'Consumer discretionary stocks gain on improved inflation outlook', source: 'Dawn News', time: '8h ago' },
    ],
  },

  // ── PSO ──────────────────────────────────────────────────────────────────
  {
    id: 'm6', symbol: 'PSO', name: 'Pakistan State Oil Co. Ltd.',
    price: 186.35, buyPrice: 186.10, sellPrice: 186.60,
    changePercent: 6.92, changeValue: 12.05, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: false,
    open: 174.20, high: 188.00, low: 173.50, lcl: 165.80,
    volume: 3800000, avgVolume: '3.10M', marketCap: 'Rs 201.40B',
    peRatio: 4.10, eps: 45.45, dividendYield: 7.20,
    annualDividend: 13.42, exDividendDate: 'May 05, 2025',
    payDate: 'May 28, 2025', dividendFreq: 'Semi-Annual',
    sector: 'Oil & Gas', industry: 'Oil Marketing',
    incorporated: '1976', employees: '4,200', website: 'psopk.com',
    about: 'Pakistan State Oil is the country\'s largest oil marketing company, responsible for over 55% of the total petroleum products market share.',
    performance: { oneDay: 6.92, oneWeek: 9.80, oneMonth: 15.30, threeMonth: 28.60, ytd: 24.10 },
    metrics: { priceToBook: 0.88, roe: 21.80, debtToEquity: 0.72, currentRatio: 0.92 },
    aiInsight: { badge: 'Bullish', text: 'PSO\'s circular debt resolution progress and higher POL volumes make it an attractive value play at current levels.' },
    news: [
      { id: 'n1', title: 'PSO receives Rs 45B in circular debt payments from govt', source: 'Business Recorder', time: '1h ago' },
      { id: 'n2', title: 'PSO Q3 profit surges 34% year-on-year', source: 'Dawn Business', time: '4h ago' },
    ],
  },

  // ── HBL ──────────────────────────────────────────────────────────────────
  {
    id: 'm7', symbol: 'HBL', name: 'Habib Bank Ltd.',
    price: 210.75, buyPrice: 210.50, sellPrice: 211.00,
    changePercent: 4.27, changeValue: 8.61, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: false,
    open: 202.00, high: 212.50, low: 201.20, lcl: 194.50,
    volume: 5200000, avgVolume: '4.80M', marketCap: 'Rs 288.10B',
    peRatio: 6.80, eps: 30.99, dividendYield: 4.60,
    annualDividend: 9.70, exDividendDate: 'Apr 25, 2025',
    payDate: 'May 15, 2025', dividendFreq: 'Quarterly',
    sector: 'Banking', industry: 'Commercial Banking',
    incorporated: '1941', employees: '15,600', website: 'hbl.com',
    about: 'Habib Bank Limited is Pakistan\'s largest private sector bank with a network of over 1,700 branches domestically and presence in 25 countries worldwide.',
    performance: { oneDay: 4.27, oneWeek: 7.50, oneMonth: 12.80, threeMonth: 22.40, ytd: 18.90 },
    metrics: { priceToBook: 1.32, roe: 19.40, debtToEquity: 8.20, currentRatio: 1.05 },
    aiInsight: { badge: 'Bullish', text: 'HBL\'s strong deposit base, improving NIMs, and international remittance business make it a top banking sector pick.' },
    news: [
      { id: 'n1', title: 'HBL posts Rs 14.2B profit in Q1 2025 — up 28% YoY', source: 'The News', time: '2h ago' },
      { id: 'n2', title: 'Banking sector rallies on SBP rate cut expectations', source: 'ARY Business', time: '5h ago' },
    ],
  },

  // ── OGDC ─────────────────────────────────────────────────────────────────
  {
    id: 'm8', symbol: 'OGDC', name: 'Oil & Gas Dev. Company Ltd.',
    price: 119.80, buyPrice: 119.60, sellPrice: 120.00,
    changePercent: -2.45, changeValue: -3.00, isPositive: false,
    sparklineTrend: 'down', isShariahCompliant: true,
    open: 123.00, high: 123.50, low: 118.90, lcl: 116.20,
    volume: 6100000, avgVolume: '5.40M', marketCap: 'Rs 514.80B',
    peRatio: 4.60, eps: 26.04, dividendYield: 8.10,
    annualDividend: 9.70, exDividendDate: 'Jun 02, 2025',
    payDate: 'Jun 25, 2025', dividendFreq: 'Semi-Annual',
    sector: 'Oil & Gas', industry: 'E&P',
    incorporated: '1961', employees: '10,500', website: 'ogdcl.com',
    about: 'OGDCL is Pakistan\'s largest E&P company, contributing over 50% of the country\'s total crude oil and natural gas production.',
    performance: { oneDay: -2.45, oneWeek: -3.80, oneMonth: 2.10, threeMonth: 8.40, ytd: 6.20 },
    metrics: { priceToBook: 0.72, roe: 16.80, debtToEquity: 0.08, currentRatio: 3.40 },
    aiInsight: { badge: 'Neutral', text: 'OGDC offers deep value at sub-1x P/B but near-term headwinds from gas price disputes and receivable buildup cap upside.' },
    news: [
      { id: 'n1', title: 'OGDC gas well discovery in KPK adds 12mmcfd production', source: 'Business Recorder', time: '3h ago' },
      { id: 'n2', title: 'E&P stocks dip as government defers wellhead price revision', source: 'Dawn Business', time: '6h ago' },
    ],
  },

  // ── AABS ─────────────────────────────────────────────────────────────────
  {
    id: 'm9', symbol: 'AABS', name: 'Al-Abbas Sugar Mills Ltd.',
    price: 904.00, buyPrice: 903.50, sellPrice: 904.00,
    changePercent: 1.68, changeValue: 15.00, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 892.50, high: 912.50, low: 888.00, lcl: 865.00,
    volume: 290000, avgVolume: '2.21M', marketCap: 'Rs 69.42B',
    peRatio: 9.40, eps: 96.17, dividendYield: 3.20,
    annualDividend: 28.93, exDividendDate: 'Mar 10, 2025',
    payDate: 'Apr 01, 2025', dividendFreq: 'Annual',
    sector: 'Sugar & Allied', industry: 'Sugar',
    incorporated: '1964', employees: '2,800', website: 'alabbas.com.pk',
    about: 'Al-Abbas Sugar Mills Limited is one of the largest sugar producers in Pakistan, also involved in ethanol production and power generation from bagasse.',
    performance: { oneDay: 1.68, oneWeek: 3.40, oneMonth: 7.20, threeMonth: 12.80, ytd: 10.50 },
    metrics: { priceToBook: 1.85, roe: 18.60, debtToEquity: 0.38, currentRatio: 1.42 },
    aiInsight: { badge: 'Neutral', text: 'AABS benefits from improved sugar recovery rates and ethanol co-generation revenue. Watch for upcoming crushing season data.' },
    news: [
      { id: 'n1', title: 'Al-Abbas Sugar crushes 1.1M tons in FY25 season', source: 'Dawn Business', time: '2h ago' },
      { id: 'n2', title: 'Sugar sector under review as export quota announced', source: 'Business Recorder', time: '5h ago' },
    ],
  },

  // ── PIAHCLB ──────────────────────────────────────────────────────────────
  {
    id: 'm10', symbol: 'PIAHCLB', name: 'PIA Holding Co. Ltd. (B)',
    price: 176.06, buyPrice: 175.80, sellPrice: 176.30,
    changePercent: 0.61, changeValue: 1.07, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: false,
    open: 174.50, high: 177.20, low: 173.90, lcl: 169.00,
    volume: 420000, avgVolume: '0.38M', marketCap: 'Rs 22.80B',
    peRatio: 22.10, eps: 7.97, dividendYield: 0.00,
    annualDividend: 0, exDividendDate: 'N/A',
    payDate: 'N/A', dividendFreq: 'None',
    sector: 'Transport', industry: 'Airlines',
    incorporated: '1955', employees: '14,200', website: 'piac.com.pk',
    about: 'PIA Holding Company is the holding entity for Pakistan International Airlines, the national flag carrier operating domestic and international routes.',
    performance: { oneDay: 0.61, oneWeek: 1.20, oneMonth: -2.40, threeMonth: -5.80, ytd: -3.10 },
    metrics: { priceToBook: 3.10, roe: -8.40, debtToEquity: 4.80, currentRatio: 0.62 },
    aiInsight: { badge: 'Bearish', text: 'PIA Holding faces structural headwinds from high debt load and operational losses. Privatisation progress is the key re-rating catalyst to watch.' },
    news: [
      { id: 'n1', title: 'Government advances PIA privatisation — shortlisted bidders announced', source: 'Geo News', time: '1h ago' },
      { id: 'n2', title: 'PIA reports narrowed losses in Q1 FY25 on cost-cut drive', source: 'ARY Business', time: '4h ago' },
    ],
  },

  // ── SAZEW ─────────────────────────────────────────────────────────────────
  {
    id: 'm11', symbol: 'SAZEW', name: 'Sazgar Engineering Works Ltd.',
    price: 2118.50, buyPrice: 2117.00, sellPrice: 2120.00,
    changePercent: 0.15, changeValue: 3.20, isPositive: true,
    sparklineTrend: 'flat', isShariahCompliant: true,
    open: 2112.00, high: 2128.00, low: 2108.00, lcl: 2060.00,
    volume: 85000, avgVolume: '0.07M', marketCap: 'Rs 42.37B',
    peRatio: 11.20, eps: 189.15, dividendYield: 2.40,
    annualDividend: 50.84, exDividendDate: 'May 18, 2025',
    payDate: 'Jun 08, 2025', dividendFreq: 'Annual',
    sector: 'Automobile Assembler', industry: 'Auto',
    incorporated: '1967', employees: '1,600', website: 'sazgar.com.pk',
    about: 'Sazgar Engineering Works is Pakistan\'s leading auto-rickshaw and heavy commercial vehicle manufacturer, also assembling BAIC branded cars and SUVs.',
    performance: { oneDay: 0.15, oneWeek: 1.80, oneMonth: 4.20, threeMonth: 9.60, ytd: 8.10 },
    metrics: { priceToBook: 2.20, roe: 20.80, debtToEquity: 0.28, currentRatio: 1.88 },
    aiInsight: { badge: 'Bullish', text: 'SAZEW\'s EV assembly foray and growing BAIC SUV market share position it well for the next automotive upcycle.' },
    news: [
      { id: 'n1', title: 'Sazgar unveils new BAIC BJ40 Plus for Pakistan market', source: 'PakWheels News', time: '3h ago' },
      { id: 'n2', title: 'Auto sector volumes recover 18% MoM in May 2025', source: 'Business Recorder', time: '6h ago' },
    ],
  },

  // ── LEUL ─────────────────────────────────────────────────────────────────
  {
    id: 'm12', symbol: 'LEUL', name: 'Loads Enterprises (Pvt.) Ltd.',
    price: 45.20, buyPrice: 45.10, sellPrice: 45.30,
    changePercent: 10.00, changeValue: 4.11, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 41.10, high: 45.80, low: 40.80, lcl: 39.20,
    volume: 920000, avgVolume: '0.74M', marketCap: 'Rs 5.42B',
    peRatio: 7.80, eps: 5.80, dividendYield: 4.10,
    annualDividend: 1.85, exDividendDate: 'Apr 08, 2025',
    payDate: 'Apr 28, 2025', dividendFreq: 'Annual',
    sector: 'Engineering', industry: 'Auto Parts & Accessories',
    incorporated: '1969', employees: '740', website: 'loads.com.pk',
    about: 'Loads Enterprises manufactures auto parts, motorcycle components, and general engineering products, serving both OEM and aftermarket segments in Pakistan.',
    performance: { oneDay: 10.00, oneWeek: 12.80, oneMonth: 18.40, threeMonth: 25.60, ytd: 21.30 },
    metrics: { priceToBook: 1.15, roe: 14.80, debtToEquity: 0.32, currentRatio: 1.65 },
    aiInsight: { badge: 'Bullish', text: 'Auto sector recovery is directly lifting LEUL\'s OEM orders. Low valuation and consistent dividend make it an attractive small-cap pick.' },
    news: [
      { id: 'n1', title: 'Loads Enterprises signs OEM supply deal with new EV assembler', source: 'The News', time: '2h ago' },
      { id: 'n2', title: 'Engineering sector stocks rally on improved auto volumess', source: 'Dawn Business', time: '5h ago' },
    ],
  },

  // ── FATM ─────────────────────────────────────────────────────────────────
  {
    id: 'm13', symbol: 'FATM', name: 'Fatima Fertilizer Co. Ltd.',
    price: 28.50, buyPrice: 28.45, sellPrice: 28.55,
    changePercent: 9.21, changeValue: 2.40, isPositive: true,
    sparklineTrend: 'up', isShariahCompliant: true,
    open: 26.10, high: 28.90, low: 25.80, lcl: 24.40,
    volume: 8200000, avgVolume: '6.50M', marketCap: 'Rs 48.60B',
    peRatio: 6.40, eps: 4.45, dividendYield: 6.80,
    annualDividend: 1.94, exDividendDate: 'May 30, 2025',
    payDate: 'Jun 20, 2025', dividendFreq: 'Semi-Annual',
    sector: 'Fertilizer', industry: 'Fertilizer',
    incorporated: '2003', employees: '1,920', website: 'fatimafertilizer.com',
    about: 'Fatima Fertilizer Company is one of the newest and most efficient fertilizer producers in Pakistan, manufacturing CAN, NP, and urea products for the domestic market.',
    performance: { oneDay: 9.21, oneWeek: 11.60, oneMonth: 16.80, threeMonth: 23.40, ytd: 19.80 },
    metrics: { priceToBook: 1.05, roe: 16.50, debtToEquity: 0.48, currentRatio: 1.72 },
    aiInsight: { badge: 'Bullish', text: 'Fatima\'s modern plant and diversified product mix give it a competitive edge. Strong dividend yield supports income-focused investors.' },
    news: [
      { id: 'n1', title: 'Fatima Fertilizer Q2 profit up 22% on improved urea prices', source: 'Business Recorder', time: '1h ago' },
      { id: 'n2', title: 'Fertilizer stocks in demand ahead of Kharif sowing season', source: 'Dawn News', time: '4h ago' },
    ],
  },

  // ── IDSM ─────────────────────────────────────────────────────────────────
  {
    id: 'm14', symbol: 'IDSM', name: 'Indus Dyeing & Mfg. Co.',
    price: 15.40, buyPrice: 15.35, sellPrice: 15.45,
    changePercent: -10.00, changeValue: -1.71, isPositive: false,
    sparklineTrend: 'down', isShariahCompliant: false,
    open: 17.12, high: 17.20, low: 15.20, lcl: 14.90,
    volume: 2100000, avgVolume: '1.80M', marketCap: 'Rs 3.08B',
    peRatio: 18.40, eps: 0.84, dividendYield: 0.00,
    annualDividend: 0, exDividendDate: 'N/A',
    payDate: 'N/A', dividendFreq: 'None',
    sector: 'Textile', industry: 'Textile Composite',
    incorporated: '1958', employees: '1,240', website: 'idicl.com',
    about: 'Indus Dyeing & Manufacturing Company is a vertically integrated textile manufacturer engaged in spinning, weaving, dyeing and finishing of fabric.',
    performance: { oneDay: -10.00, oneWeek: -12.40, oneMonth: -18.60, threeMonth: -22.10, ytd: -15.80 },
    metrics: { priceToBook: 0.68, roe: 3.60, debtToEquity: 1.10, currentRatio: 0.88 },
    aiInsight: { badge: 'Bearish', text: 'IDSM faces headwinds from elevated energy costs and weakened export demand. Margin compression expected to continue in H2 FY25.' },
    news: [
      { id: 'n1', title: 'Textile exports decline 8% in Apr 2025 — sector under pressure', source: 'Business Recorder', time: '2h ago' },
      { id: 'n2', title: 'IDSM reports quarterly loss on gas tariff impact', source: 'The News', time: '6h ago' },
    ],
  },

  // ── PAKQATAR ──────────────────────────────────────────────────────────────
  {
    id: 'm15', symbol: 'PAKQATAR', name: 'Pak Qatar Family Takaful',
    price: 8.20, buyPrice: 8.18, sellPrice: 8.22,
    changePercent: -9.03, changeValue: -0.81, isPositive: false,
    sparklineTrend: 'down', isShariahCompliant: true,
    open: 9.02, high: 9.10, low: 8.10, lcl: 7.90,
    volume: 1400000, avgVolume: '1.10M', marketCap: 'Rs 4.10B',
    peRatio: 24.70, eps: 0.33, dividendYield: 0.00,
    annualDividend: 0, exDividendDate: 'N/A',
    payDate: 'N/A', dividendFreq: 'None',
    sector: 'Insurance', industry: 'Life Insurance (Takaful)',
    incorporated: '2007', employees: '420', website: 'pakqatar.com.pk',
    about: 'Pak Qatar Family Takaful is Pakistan\'s leading Shariah-compliant life insurance provider, offering a range of family takaful plans and savings products.',
    performance: { oneDay: -9.03, oneWeek: -11.20, oneMonth: -16.40, threeMonth: -19.80, ytd: -14.20 },
    metrics: { priceToBook: 1.40, roe: 5.60, debtToEquity: 0.22, currentRatio: 1.35 },
    aiInsight: { badge: 'Bearish', text: 'Slower new policy growth and investment portfolio mark-to-market losses are weighing on PAKQATAR\'s near-term earnings outlook.' },
    news: [
      { id: 'n1', title: 'Takaful sector growth slows as disposable income pressures persist', source: 'Dawn Business', time: '3h ago' },
      { id: 'n2', title: 'Pak Qatar Family Takaful reports 15% drop in new enrollments', source: 'Business Recorder', time: '7h ago' },
    ],
  },

  // ── ZUMA ──────────────────────────────────────────────────────────────────
  {
    id: 'm16', symbol: 'ZUMA', name: 'Zulfiqar Industries Ltd.',
    price: 12.30, buyPrice: 12.25, sellPrice: 12.35,
    changePercent: -5.71, changeValue: -0.74, isPositive: false,
    sparklineTrend: 'down', isShariahCompliant: true,
    open: 13.04, high: 13.15, low: 12.10, lcl: 11.80,
    volume: 680000, avgVolume: '0.55M', marketCap: 'Rs 1.97B',
    peRatio: 11.80, eps: 1.04, dividendYield: 2.40,
    annualDividend: 0.30, exDividendDate: 'Feb 14, 2025',
    payDate: 'Mar 05, 2025', dividendFreq: 'Annual',
    sector: 'Chemicals', industry: 'Specialty Chemicals',
    incorporated: '1982', employees: '380', website: 'zulfiqarindustries.com.pk',
    about: 'Zulfiqar Industries Limited manufactures specialty chemicals, dyes and auxiliaries for the textile and leather industries in Pakistan.',
    performance: { oneDay: -5.71, oneWeek: -7.40, oneMonth: -12.80, threeMonth: -16.20, ytd: -11.50 },
    metrics: { priceToBook: 0.82, roe: 6.90, debtToEquity: 0.58, currentRatio: 1.18 },
    aiInsight: { badge: 'Bearish', text: 'Weak textile sector demand is reducing ZUMA\'s chemical offtake. Import-competing pressures from cheaper Chinese alternatives add to concerns.' },
    news: [
      { id: 'n1', title: 'Chemical sector stocks fall on soft textile orders outlook', source: 'The News', time: '4h ago' },
      { id: 'n2', title: 'ZUMA revises down FY25 volume guidance by 12%', source: 'Dawn Business', time: '8h ago' },
    ],
  },

  // ── PQGTL ─────────────────────────────────────────────────────────────────
  {
    id: 'm17', symbol: 'PQGTL', name: 'Pak Qatar General Takaful',
    price: 6.80, buyPrice: 6.78, sellPrice: 6.82,
    changePercent: -5.55, changeValue: -0.40, isPositive: false,
    sparklineTrend: 'down', isShariahCompliant: true,
    open: 7.20, high: 7.25, low: 6.70, lcl: 6.50,
    volume: 980000, avgVolume: '0.82M', marketCap: 'Rs 2.04B',
    peRatio: 16.20, eps: 0.42, dividendYield: 0.00,
    annualDividend: 0, exDividendDate: 'N/A',
    payDate: 'N/A', dividendFreq: 'None',
    sector: 'Insurance', industry: 'General Insurance (Takaful)',
    incorporated: '2007', employees: '310', website: 'pakqatar.com.pk',
    about: 'Pak Qatar General Takaful provides Shariah-compliant general insurance solutions including motor, fire, marine, and health takaful products across Pakistan.',
    performance: { oneDay: -5.55, oneWeek: -8.20, oneMonth: -13.60, threeMonth: -18.40, ytd: -12.80 },
    metrics: { priceToBook: 1.10, roe: 6.80, debtToEquity: 0.18, currentRatio: 1.42 },
    aiInsight: { badge: 'Bearish', text: 'PQGTL faces claims ratio pressure from the motor segment and subdued premium growth. Short-term outlook remains challenging.' },
    news: [
      { id: 'n1', title: 'General takaful market growth moderates to 8% in FY25', source: 'Business Recorder', time: '3h ago' },
      { id: 'n2', title: 'PQGTL combined ratio rises to 104% — underwriting loss widens', source: 'The News', time: '7h ago' },
    ],
  },
];

// ─── Watchlist ────────────────────────────────────────────────────────────────
// Derived from the master list so tapping always resolves to a full stock page
export const MOCK_WATCHLIST: Stock[] = MOCK_MARKET_STOCKS.filter((s) =>
  ['AABS', 'PIAHCLB', 'SAZEW', 'FANM'].includes(s.symbol)
);

// ─── Top Gainers ──────────────────────────────────────────────────────────────
export const MOCK_TOP_GAINERS: Stock[] = MOCK_MARKET_STOCKS.filter((s) =>
  ['FANM', 'FFLM', 'LEUL', 'FATM'].includes(s.symbol)
).sort((a, b) => b.changePercent - a.changePercent);

// ─── Top Losers ───────────────────────────────────────────────────────────────
export const MOCK_TOP_LOSERS: Stock[] = MOCK_MARKET_STOCKS.filter((s) =>
  ['IDSM', 'PAKQATAR', 'ZUMA', 'PQGTL'].includes(s.symbol)
).sort((a, b) => a.changePercent - b.changePercent);
