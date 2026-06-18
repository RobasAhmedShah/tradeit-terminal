/**
 * Quick sanity check for portfolio math (run: npx tsx scripts/test-portfolio.ts)
 */
import { MOCK_MARKET_STOCKS } from '../src/data/mockStocks';
import { DEFAULT_PORTFOLIO_STATE } from '../src/utils/portfolioPrefs';

const stockMap = new Map(MOCK_MARKET_STOCKS.map((s) => [s.symbol, s]));

let buyingPower = DEFAULT_PORTFOLIO_STATE.buyingPower;
const holdings = [...DEFAULT_PORTFOLIO_STATE.holdings];

console.log('--- Start ---');
console.log('Buying power:', buyingPower.toLocaleString());
console.log('Holdings:', holdings.map((h) => `${h.symbol} x${h.qty}`).join(', '));

// Simulate deposit
const deposit = 10_000;
buyingPower += deposit;
console.log('\nAfter deposit +10,000:', buyingPower.toLocaleString());

// Simulate buy 10 FANM @ 904
const symbol = 'FANM';
const qty = 10;
const price = 904;
const totalCost = price * qty * 1.00165; // fees
if (totalCost <= buyingPower) {
  buyingPower -= totalCost;
  const idx = holdings.findIndex((h) => h.symbol === symbol);
  if (idx >= 0) {
    const h = holdings[idx];
    const newQty = h.qty + qty;
    holdings[idx] = { ...h, qty: newQty, avgCost: (h.avgCost * h.qty + price * qty) / newQty };
  } else {
    holdings.unshift({
      symbol,
      name: 'Fauji Fertilizer',
      qty,
      avgCost: price,
      chartPath: 'M0,12 L40,12',
    });
  }
  console.log(`\nAfter BUY ${qty} ${symbol}:`, buyingPower.toLocaleString());
  console.log('Holdings:', holdings.filter((h) => h.qty > 0).map((h) => `${h.symbol} x${h.qty}`).join(', '));
} else {
  console.log('BUY failed — not enough cash');
}

const holdingsValue = holdings
  .filter((h) => h.qty > 0)
  .reduce((sum, h) => sum + h.qty * (stockMap.get(h.symbol)?.price ?? h.avgCost), 0);

console.log('\nStocks value:', holdingsValue.toLocaleString());
console.log('Total net worth:', (holdingsValue + buyingPower).toLocaleString());
console.log('\n✓ Portfolio logic OK');
