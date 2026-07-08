import { Href } from 'expo-router';
import { FuturesPosition } from '../data/mockFutures';

/** Build a safe expo-router href for a futures position detail screen. */
export function futuresPositionHref(position: FuturesPosition): Href | null {
  const id = position.id?.trim();
  if (!id) return null;
  return {
    pathname: '/futures/position/[id]',
    params: { id },
  };
}
