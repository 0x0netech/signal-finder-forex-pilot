import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, TrendingUp, TrendingDown, Target, Clock, Users, DollarSign, BarChart3, Signal } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    result: 'WIN'
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
    result: 'WIN'
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
    pips: 0
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
    result: 'LOSS'
  }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [signals, setSignals] = useState<TradingSignal[]>(mockSignals);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Signal className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">ForexSignals Pro</h1>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                NY Session Active
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString('en-US', { 
                  timeZone: 'America/New_York',
                  hour12: false 
                })} EST
              </div>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                1,247 Active
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{winRate.toFixed(1)}%</div>
              <Progress value={winRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">+{totalPips}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeSignals.length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk/Reward</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">1:2</div>
              <p className="text-xs text-muted-foreground">Minimum ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="live">Live Signals</TabsTrigger>
            <TabsTrigger value="history">Signal History</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <div className="space-y-6">
              {/* Active Signals Alert */}
              <Alert className="border-primary/20 bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  New York Session: {activeSignals.length} active signals with minimum 1:2 risk/reward ratio
                </AlertDescription>
              </Alert>

              {/* Live Signals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeSignals.map((signal) => (
                  <Card key={signal.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{signal.pair}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={signal.type === 'BUY' ? 'default' : 'destructive'}
                            className={signal.type === 'BUY' ? 'bg-success text-success-foreground' : ''}
                          >
                            {signal.type === 'BUY' ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {signal.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {signal.session}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        <Clock className="h-4 w-4 inline mr-1" />
                        {signal.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Entry</p>
                            <p className="font-medium">{signal.entry}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stop Loss</p>
                            <p className="font-medium text-destructive">{signal.stopLoss}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Take Profit</p>
                            <p className="font-medium text-success">{signal.takeProfit}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">R:R {signal.riskReward}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Current: +{signal.pips} pips
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pending Signals */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {signals.filter(s => s.status === 'PENDING').map((signal) => (
                      <div key={signal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{signal.pair}</Badge>
                          <Badge variant={signal.type === 'BUY' ? 'default' : 'destructive'}>
                            {signal.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Entry: {signal.entry}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Signal History</CardTitle>
                <CardDescription>Complete history of all trading signals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>R:R</TableHead>
                      <TableHead>Pips</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signals.map((signal) => (
                      <TableRow key={signal.id}>
                        <TableCell className="font-medium">{signal.pair}</TableCell>
                        <TableCell>
                          <Badge variant={signal.type === 'BUY' ? 'default' : 'destructive'}>
                            {signal.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{signal.entry}</TableCell>
                        <TableCell>
                          {signal.status === 'CLOSED' 
                            ? (signal.result === 'WIN' ? signal.takeProfit : signal.stopLoss)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{signal.riskReward}</TableCell>
                        <TableCell className={signal.pips > 0 ? 'text-success' : signal.pips < 0 ? 'text-destructive' : ''}>
                          {signal.pips > 0 ? '+' : ''}{signal.pips}
                        </TableCell>
                        <TableCell>
                          {signal.result && (
                            <Badge 
                              variant={signal.result === 'WIN' ? 'default' : 'destructive'}
                              className={signal.result === 'WIN' ? 'bg-success text-success-foreground' : ''}
                            >
                              {signal.result}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{signal.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="text-sm font-medium">{winRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={winRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk/Reward Ratio</span>
                      <span className="text-sm font-medium">1:2</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Signals</span>
                      <span className="text-sm font-medium">{signals.length}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Pips per Trade</span>
                      <span className="text-sm font-medium">
                        {closedSignals.length > 0 ? (totalPips / closedSignals.length).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Session Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-primary">New York Session</h3>
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Primary trading session with highest volume and volatility
                      </p>
                      <div className="mt-3 text-sm">
                        <p><strong>Time:</strong> 8:00 AM - 5:00 PM EST</p>
                        <p><strong>Focus:</strong> Major pairs (EUR/USD, GBP/USD, USD/JPY)</p>
                        <p><strong>Min R:R:</strong> 1:2 ratio maintained</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-success">75%</div>
                        <div className="text-sm text-muted-foreground">NY Session Win Rate</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">+180</div>
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