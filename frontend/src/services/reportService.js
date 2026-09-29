const historicalReports = [
  {
    id: 1,
    season: 'Kharif',
    year: '2025',
    crop: 'Rice',
    yield: 3500,
    investment: 38000,
    income: 72000,
    profit: 34000
  },
  {
    id: 2,
    season: 'Rabi',
    year: '2026',
    crop: 'Cotton',
    yield: 2100,
    investment: 50000,
    income: 96000,
    profit: 46000
  },
  {
    id: 3,
    season: 'Zaid',
    year: '2025',
    crop: 'Watermelon',
    yield: 5000,
    investment: 20000,
    income: 45000,
    profit: 25000
  },
  {
    id: 4,
    season: 'Kharif',
    year: '2024',
    crop: 'Soybean',
    yield: 2800,
    investment: 30000,
    income: 60000,
    profit: 30000
  }
];

export const getHistoricalReports = async () => {
  return new Promise((resolve) => setTimeout(() => resolve([...historicalReports]), 600));
};
