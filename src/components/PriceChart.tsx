import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  pair: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  className?: string;
}

export const PriceChart = ({ pair, currentPrice, change, changePercent, className }: PriceChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Generate initial data
    const generateInitialData = () => {
      const data: PriceData[] = [];
      const basePrice = currentPrice;
      
      for (let i = 0; i < 50; i++) {
        const timestamp = new Date(Date.now() - (49 - i) * 60000);
        const variation = (Math.random() - 0.5) * 0.01;
        const price = basePrice + variation;
        
        data.push({
          time: timestamp.toLocaleTimeString('en-US', { hour12: false }),
          price: price,
          volume: Math.floor(Math.random() * 1000000) + 500000,
        });
      }
      
      return data;
    };

    setPriceData(generateInitialData());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setPriceData(prev => {
        const newData = [...prev];
        const lastPrice = newData[newData.length - 1].price;
        const variation = (Math.random() - 0.5) * 0.005;
        const newPrice = lastPrice + variation;
        
        // Remove first element and add new one
        newData.shift();
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          price: newPrice,
          volume: Math.floor(Math.random() * 1000000) + 500000,
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const isPositive = change >= 0;
  const lineColor = isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  const areaColor = isPositive ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--destructive) / 0.1)';

  return (
    <Card 
      className={`bg-card border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-display">{pair}</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={`text-sm font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold font-mono">
            {currentPrice.toFixed(5)}
          </div>
          <div className={`text-sm font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(5)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`h-64 transition-all duration-300 ${isHovered ? 'h-72' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id={`gradient-${pair}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                tickFormatter={(value) => value.toFixed(5)}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--popover-foreground))',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value.toFixed(5), 'Price']}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#gradient-${pair})`}
                fillOpacity={1}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: lineColor,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;