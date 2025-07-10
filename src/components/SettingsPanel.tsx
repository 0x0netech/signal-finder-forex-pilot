import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, TrendingUp, Shield, DollarSign, Clock, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      soundEnabled: true,
      emailEnabled: false,
      pushEnabled: true
    },
    trading: {
      riskReward: [2],
      minConfidence: [75],
      maxPositions: [5],
      autoTrade: false,
      slippage: [0.5]
    },
    display: {
      theme: 'dark',
      refreshRate: '3',
      priceDecimal: 5,
      showVolume: true
    }
  });

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-display">Settings</CardTitle>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          <CardDescription>
            Configure your trading preferences and system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trading" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trading" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trading</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Display</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trading" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-warning" />
                    <span>Risk Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Minimum Risk/Reward Ratio</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={settings.trading.riskReward}
                        onValueChange={(value) => updateSetting('trading', 'riskReward', value)}
                        max={5}
                        min={1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1:1</span>
                        <Badge variant="outline">1:{settings.trading.riskReward[0]}</Badge>
                        <span>1:5</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Signal Confidence (%)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={settings.trading.minConfidence}
                        onValueChange={(value) => updateSetting('trading', 'minConfidence', value)}
                        max={95}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>50%</span>
                        <Badge variant="outline">{settings.trading.minConfidence[0]}%</Badge>
                        <span>95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maximum Positions</Label>
                      <Input
                        type="number"
                        value={settings.trading.maxPositions[0]}
                        onChange={(e) => updateSetting('trading', 'maxPositions', [parseInt(e.target.value)])}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slippage Tolerance (%)</Label>
                      <Input
                        type="number"
                        value={settings.trading.slippage[0]}
                        onChange={(e) => updateSetting('trading', 'slippage', [parseFloat(e.target.value)])}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Trading</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically execute signals when conditions are met
                      </p>
                    </div>
                    <Switch
                      checked={settings.trading.autoTrade}
                      onCheckedChange={(checked) => updateSetting('trading', 'autoTrade', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for new signals and trades
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.enabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center">
                      <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <Label>Sound Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sound when new signals arrive
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'soundEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send important alerts to your email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailEnabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications for instant alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushEnabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pushEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-accent-foreground" />
                    <span>Display Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Refresh Rate</Label>
                      <Select value={settings.display.refreshRate} onValueChange={(value) => updateSetting('display', 'refreshRate', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 second</SelectItem>
                          <SelectItem value="3">3 seconds</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price Decimals</Label>
                      <Select value={settings.display.priceDecimal.toString()} onValueChange={(value) => updateSetting('display', 'priceDecimal', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 places</SelectItem>
                          <SelectItem value="3">3 places</SelectItem>
                          <SelectItem value="4">4 places</SelectItem>
                          <SelectItem value="5">5 places</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Volume</Label>
                      <p className="text-sm text-muted-foreground">
                        Display trading volume in charts and tickers
                      </p>
                    </div>
                    <Switch
                      checked={settings.display.showVolume}
                      onCheckedChange={(checked) => updateSetting('display', 'showVolume', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;