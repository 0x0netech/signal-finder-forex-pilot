import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, TrendingDown, Target, Clock, Copy, Eye } from 'lucide-react';
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

interface TradingSignalCardProps {
  signal: TradingSignal;
  onView?: (signal: TradingSignal) => void;
  onCopy?: (signal: TradingSignal) => void;
}

export const TradingSignalCard = ({ signal, onView, onCopy }: TradingSignalCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const signalText = `${signal.pair} ${signal.type}
Entry: ${signal.entry}
SL: ${signal.stopLoss}
TP: ${signal.takeProfit}
R:R: ${signal.riskReward}
Time: ${signal.time}`;
    
    navigator.clipboard.writeText(signalText);
    toast({
      title: "Signal Copied!",
      description: `${signal.pair} ${signal.type} signal copied to clipboard`,
    });
    
    if (onCopy) onCopy(signal);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    if (onView) onView(signal);
  };

  const getProgressColor = () => {
    if (signal.pips > 0) return 'bg-success';
    if (signal.pips < 0) return 'bg-destructive';
    return 'bg-muted';
  };

  const getProgressValue = () => {
    const maxPips = Math.abs(signal.takeProfit - signal.entry) * 10000;
    const currentPips = Math.abs(signal.pips);
    return Math.min((currentPips / maxPips) * 100, 100);
  };

  return (
    <Card 
      className={`
        bg-card border-border transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20
        ${isHovered ? 'transform hover:scale-[1.02]' : ''}
        ${isClicked ? 'transform scale-[0.98]' : ''}
        ${signal.status === 'ACTIVE' ? 'animate-pulse-glow' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-display">{signal.pair}</CardTitle>
            {signal.status === 'ACTIVE' && (
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={signal.type === 'BUY' ? 'default' : 'destructive'}
              className={`
                transition-all duration-200 font-mono
                ${signal.type === 'BUY' ? 'bg-success hover:bg-success/80 text-success-foreground' : 'hover:bg-destructive/80'}
                ${isHovered ? 'animate-bounce-subtle' : ''}
              `}
            >
              {signal.type === 'BUY' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {signal.type}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              {signal.session}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{signal.time}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm">Confidence: {signal.confidence}%</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Entry</p>
            <p className="font-mono text-base font-semibold">{signal.entry}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Stop Loss</p>
            <p className="font-mono text-base font-semibold text-destructive">{signal.stopLoss}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Take Profit</p>
            <p className="font-mono text-base font-semibold text-success">{signal.takeProfit}</p>
          </div>
        </div>

        {signal.status === 'ACTIVE' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className={`font-mono font-semibold ${signal.pips > 0 ? 'text-success' : signal.pips < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {signal.pips > 0 ? '+' : ''}{signal.pips} pips
              </span>
            </div>
            <Progress 
              value={getProgressValue()} 
              className="h-2"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium font-mono">R:R {signal.riskReward}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onView) onView(signal);
              }}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {signal.result && (
          <div className="pt-2 border-t border-border">
            <Badge 
              variant={signal.result === 'WIN' ? 'default' : 'destructive'}
              className={`
                w-full justify-center font-mono
                ${signal.result === 'WIN' ? 'bg-success text-success-foreground' : ''}
              `}
            >
              {signal.result === 'WIN' ? '✓' : '✗'} {signal.result}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingSignalCard;