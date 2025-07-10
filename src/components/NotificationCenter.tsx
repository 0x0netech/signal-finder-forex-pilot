import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellRing, Settings, Volume2, VolumeX, Mail, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  email: boolean;
  push: boolean;
  newSignals: boolean;
  signalUpdates: boolean;
  performanceAlerts: boolean;
}

interface Notification {
  id: string;
  type: 'signal' | 'update' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'signal',
    title: 'New Signal: EUR/USD BUY',
    message: 'High confidence signal generated for EUR/USD with 1:2 R:R',
    time: '2 min ago',
    read: false
  },
  {
    id: '2',
    type: 'update',
    title: 'Signal Update: GBP/USD',
    message: 'GBP/USD signal reached take profit target',
    time: '15 min ago',
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Performance Alert',
    message: 'Monthly win rate target achieved: 85%',
    time: '1 hour ago',
    read: true
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    email: false,
    push: true,
    newSignals: true,
    signalUpdates: true,
    performanceAlerts: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: `Notification preferences saved successfully`,
    });
  };

  const testNotification = () => {
    toast({
      title: "Test Notification",
      description: "This is how your notifications will appear",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center font-display">
              <BellRing className="h-5 w-5 mr-2 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto max-h-96">
          {showSettings ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Notification Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled" className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>Enable Notifications</span>
                  </Label>
                  <Switch
                    id="enabled"
                    checked={settings.enabled}
                    onCheckedChange={(value) => updateSetting('enabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="flex items-center space-x-2">
                    {settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <span>Sound Alerts</span>
                  </Label>
                  <Switch
                    id="sound"
                    checked={settings.sound}
                    onCheckedChange={(value) => updateSetting('sound', value)}
                    disabled={!settings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </Label>
                  <Switch
                    id="email"
                    checked={settings.email}
                    onCheckedChange={(value) => updateSetting('email', value)}
                    disabled={!settings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push" className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </Label>
                  <Switch
                    id="push"
                    checked={settings.push}
                    onCheckedChange={(value) => updateSetting('push', value)}
                    disabled={!settings.enabled}
                  />
                </div>

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">New Signals</span>
                  <Switch
                    checked={settings.newSignals}
                    onCheckedChange={(value) => updateSetting('newSignals', value)}
                    disabled={!settings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Signal Updates</span>
                  <Switch
                    checked={settings.signalUpdates}
                    onCheckedChange={(value) => updateSetting('signalUpdates', value)}
                    disabled={!settings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance Alerts</span>
                  <Switch
                    checked={settings.performanceAlerts}
                    onCheckedChange={(value) => updateSetting('performanceAlerts', value)}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              <Button onClick={testNotification} variant="outline" className="w-full">
                Test Notification
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${notification.read 
                      ? 'bg-muted/30 border-border' 
                      : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                    }
                  `}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        notification.type === 'signal' ? 'border-success text-success' :
                        notification.type === 'alert' ? 'border-warning text-warning' :
                        'border-primary text-primary'
                      }`}
                    >
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;