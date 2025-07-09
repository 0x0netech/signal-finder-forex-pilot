import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerData {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}

export const PriceTicker = () => {
  const [prices, setPrices] = useState<PriceTickerData[]>([
    { pair: 'EUR/USD', price: 1.0850, change: 0.0025, changePercent: 0.23 },
    { pair: 'GBP/USD', price: 1.2650, change: -0.0015, changePercent: -0.12 },
    { pair: 'USD/JPY', price: 149.50, change: 0.75, changePercent: 0.50 },
    { pair: 'AUD/USD', price: 0.6550, change: -0.0030, changePercent: -0.46 },
    { pair: 'USD/CAD', price: 1.3620, change: 0.0020, changePercent: 0.15 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(price => {
        const variation = (Math.random() - 0.5) * 0.002;
        const newPrice = price.price + variation;
        const change = newPrice - price.price;
        const changePercent = (change / price.price) * 100;
        
        return {
          ...price,
          price: newPrice,
          change: change,
          changePercent: changePercent
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden bg-card border-y border-border">
      <div className="animate-marquee whitespace-nowrap py-2">
        <div className="inline-flex space-x-8">
          {prices.map((price, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className="font-mono font-semibold">{price.pair}</span>
              <span className="font-mono">{price.price.toFixed(4)}</span>
              <div className={`flex items-center space-x-1 ${price.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {price.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-mono text-xs">
                  {price.changePercent > 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;