import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  session: string;
}

const tradingPairs: TradingPair[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0850, change: 0.0025, changePercent: 0.23, volume: '2.1B', session: 'NY' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2650, change: -0.0015, changePercent: -0.12, volume: '1.8B', session: 'NY' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 149.50, change: 0.75, changePercent: 0.50, volume: '1.5B', session: 'NY' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.6550, change: -0.0030, changePercent: -0.46, volume: '980M', session: 'NY' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.3425, change: 0.0018, changePercent: 0.13, volume: '750M', session: 'NY' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', price: 0.6125, change: -0.0012, changePercent: -0.20, volume: '520M', session: 'NY' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.8745, change: 0.0008, changePercent: 0.09, volume: '680M', session: 'NY' },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', price: 0.8580, change: 0.0035, changePercent: 0.41, volume: '890M', session: 'London' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', price: 162.25, change: 1.25, changePercent: 0.78, volume: '720M', session: 'Tokyo' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', price: 189.15, change: -0.85, changePercent: -0.45, volume: '640M', session: 'Tokyo' },
  { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', price: 97.95, change: 0.45, changePercent: 0.46, volume: '420M', session: 'Tokyo' },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', price: 2045.50, change: 12.30, changePercent: 0.60, volume: '15.2B', session: 'NY' },
];

interface PairSelectorProps {
  selectedPairs: string[];
  onPairToggle: (pair: string) => void;
}

export const PairSelector = ({ selectedPairs, onPairToggle }: PairSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPairs = tradingPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center font-display">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Trading Pairs
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredPairs.map((pair) => (
          <div
            key={pair.symbol}
            className={`
              flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${selectedPairs.includes(pair.symbol) 
                ? 'bg-primary/10 border-primary/30 shadow-sm' 
                : 'bg-muted/30 border-border hover:bg-muted/50'
              }
            `}
            onClick={() => onPairToggle(pair.symbol)}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-sm">{pair.symbol}</div>
                  <div className="text-xs text-muted-foreground">{pair.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium">{pair.price}</div>
                  <div className={`text-xs flex items-center ${
                    pair.change > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {pair.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {pair.changePercent > 0 ? '+' : ''}{pair.changePercent}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {pair.session}
                </Badge>
                <span className="text-xs text-muted-foreground">Vol: {pair.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PairSelector;