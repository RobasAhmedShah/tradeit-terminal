import { FuturesContract } from '../data/mockFutures';

export const FUTURES_MARKET_TICK_MS = 2500;

export function tickFuturesContract(contract: FuturesContract): FuturesContract {
  const volatility = contract.markPrice > 1000 ? 0.00055 : 0.0015;
  const delta = (Math.random() - 0.5) * contract.markPrice * volatility * 2;
  const markPrice = Math.max(0.01, Math.round((contract.markPrice + delta) * 100) / 100);
  const indexPrice = Math.round(markPrice * (0.9998 + Math.random() * 0.0004) * 100) / 100;
  const changeValue = Math.round((contract.changeValue + delta) * 100) / 100;
  const base = markPrice - changeValue;
  const changePercent = base !== 0 ? (changeValue / base) * 100 : contract.changePercent;

  return {
    ...contract,
    markPrice,
    indexPrice,
    changeValue,
    changePercent: Math.round(changePercent * 100) / 100,
    isPositive: changeValue >= 0,
    high24h: Math.max(contract.high24h, markPrice),
    low24h: Math.min(contract.low24h, markPrice),
  };
}

export function tickFuturesContracts(contracts: FuturesContract[]): FuturesContract[] {
  return contracts.map(tickFuturesContract);
}
