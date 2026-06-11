export interface News {
  id: string;
  source: string;
  time: string;
  title: string;
  imageUrl?: string;
  url?: string;
}

export const MOCK_NEWS: News[] = [
  {
    id: '1',
    source: 'Business Recorder',
    time: '31m ago',
    title: 'KSE-100 index gains 850 points as investor confidence returns after SBP rate cut',
  }
];
