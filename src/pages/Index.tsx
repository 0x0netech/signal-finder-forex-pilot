import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, TrendingUp, TrendingDown, Target, Clock, Users, DollarSign, BarChart3, Signal, Bell, Settings, Activity, Star } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import PriceChart from '@/components/PriceChart';
import TradingSignalCard from '@/components/TradingSignalCard';
import PriceTicker from '@/components/PriceTicker';
import { useToast } from '@/hooks/use-toast';

interface TradingSignal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: string;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  time: string;
  session: string;
  pips: number;
  result?: 'WIN' | 'LOSS' | 'BREAK_EVEN';
  confidence: number;
}

const mockSignals: TradingSignal[] = [
  {
    id: '1',
    pair: 'EUR/USD',
    type: 'BUY',
    entry: 1.0850,
    stopLoss: 1.0800,
    takeProfit: 1.0950,
    riskReward: '1:2',
    status: 'ACTIVE',
    time: '09:30 EST',
    session: 'NY',
    pips: 15,
    result: 'WIN',
    confidence: 85
  },
  {
    id: '2',
    pair: 'GBP/USD',
    type: 'SELL',
    entry: 1.2650,
    stopLoss: 1.2700,
    takeProfit: 1.2550,
    riskReward: '1:2',
    status: 'CLOSED',
    time: '10:15 EST',
    session: 'NY',
    pips: 25,
    result: 'WIN',
    confidence: 92
  },
  {
    id: '3',
    pair: 'USD/JPY',
    type: 'BUY',
    entry: 149.50,
    stopLoss: 149.00,
    takeProfit: 150.50,
    riskReward: '1:2',
    status: 'PENDING',
    time: '11:45 EST',
    session: 'NY',
    pips: 0,
    confidence: 78
  },
  {
    id: '4',
    pair: 'AUD/USD',
    type: 'SELL',
    entry: 0.6550,
    stopLoss: 0.6580,
    takeProfit: 0.6490,
    riskReward: '1:2',
    status: 'CLOSED',
    time: '08:30 EST',
    session: 'NY',
    pips: -15,
    result: 'LOSS',
    confidence: 68
  }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [signals, setSignals] = useState<TradingSignal[]>(mockSignals);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeSignals = signals.filter(s => s.status === 'ACTIVE');
  const closedSignals = signals.filter(s => s.status === 'CLOSED');
  const winRate = closedSignals.length > 0 ? (closedSignals.filter(s => s.result === 'WIN').length / closedSignals.length) * 100 : 0;
  const totalPips = closedSignals.reduce((sum, signal) => sum + signal.pips, 0);

  const handleSignalView = (signal: TradingSignal) => {
    toast({
      title: "Signal Details",
      description: `Viewing details for ${signal.pair} ${signal.type} signal`,
    });
  };

  const handleSignalCopy = (signal: TradingSignal) => {
    // Toast is handled in the component
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Signal className="h-8 w-8 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-display text-foreground">ForexSignals Pro</h1>
                  <p className="text-sm text-muted-foreground font-inter">Professional Trading Signals</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-success/10 text-success border-success animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  NY Session Active
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-mono text-sm font-medium">
                  {currentTime.toLocaleTimeString('en-US', { 
                    timeZone: 'America/New_York',
                    hour12: false 
                  })} EST
                </div>
                <div className="text-xs text-muted-foreground">New York Time</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="transition-all hover:scale-105">
                  <Users className="h-4 w-4 mr-2" />
                  1,247 Active
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-muted">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-muted">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Price Ticker */}
      <PriceTicker />

      <div className="container mx-auto px-6 py-8">
        {/* Performance Overview with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-success" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-success group-hover:scale-105 transition-transform">
                {winRate.toFixed(1)}%
              </div>
              <Progress value={winRate} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">Above industry average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-2 text-primary" />
                Total Pips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-primary group-hover:scale-105 transition-transform">
                +{totalPips}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Signal className="h-4 w-4 mr-2 text-warning" />
                Active Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground group-hover:scale-105 transition-transform">
                {activeSignals.length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-warning" />
                Risk/Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-warning group-hover:scale-105 transition-transform">
                1:2
              </div>
              <p className="text-xs text-muted-foreground">Minimum ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="live" className="font-medium">Live Signals</TabsTrigger>
            <TabsTrigger value="charts" className="font-medium">Price Charts</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            {/* Active Signals Alert */}
            <Alert className="border-primary/30 bg-primary/10 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary font-medium">
                New York Session: {activeSignals.length} active signals with minimum 1:2 risk/reward ratio
              </AlertDescription>
            </Alert>

            {/* Live Signals Grid using new TradingSignalCard */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-display">Active Signals</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeSignals.map((signal) => (
                  <TradingSignalCard
                    key={signal.id}
                    signal={signal}
                    onView={handleSignalView}
                    onCopy={handleSignalCopy}
                  />
                ))}
              </div>
            </div>

            {/* Pending Signals */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center font-display">
                  <Clock className="h-5 w-5 mr-2" />
                  Pending Signals
                </CardTitle>
                <CardDescription>Signals waiting for entry conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signals.filter(s => s.status === 'PENDING').map((signal) => (
                    <div key={signal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/80 transition-all">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-mono">{signal.pair}</Badge>
                        <Badge variant={signal.type === 'BUY' ? 'default' : 'destructive'}>
                          {signal.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Confidence: {signal.confidence}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        Entry: {signal.entry}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-display">Real-Time Price Charts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PriceChart
                  pair="EUR/USD"
                  currentPrice={1.0850}
                  change={0.0025}
                  changePercent={0.23}
                />
                <PriceChart
                  pair="GBP/USD"
                  currentPrice={1.2650}
                  change={-0.0015}
                  changePercent={-0.12}
                />
                <PriceChart
                  pair="USD/JPY"
                  currentPrice={149.50}
                  change={0.75}
                  changePercent={0.50}
                />
                <PriceChart
                  pair="AUD/USD"
                  currentPrice={0.6550}
                  change={-0.0030}
                  changePercent={-0.46}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center font-display">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="text-sm font-medium font-mono">{winRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={winRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk/Reward Ratio</span>
                      <span className="text-sm font-medium font-mono">1:2</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Signals</span>
                      <span className="text-sm font-medium font-mono">{signals.length}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Pips per Trade</span>
                      <span className="text-sm font-medium font-mono">
                        {closedSignals.length > 0 ? (totalPips / closedSignals.length).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center font-display">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Session Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium font-display text-primary">New York Session</h3>
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Primary trading session with highest volume and volatility
                      </p>
                      <div className="mt-3 text-sm space-y-1">
                        <p><strong>Time:</strong> 8:00 AM - 5:00 PM EST</p>
                        <p><strong>Focus:</strong> Major pairs (EUR/USD, GBP/USD, USD/JPY)</p>
                        <p><strong>Min R:R:</strong> 1:2 ratio maintained</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
                        <div className="text-2xl font-bold font-display text-success">75%</div>
                        <div className="text-sm text-muted-foreground">NY Session Win Rate</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold font-display text-primary">+180</div>
                        <div className="text-sm text-muted-foreground">Monthly Pips</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;