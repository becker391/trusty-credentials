import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { WalletAddress } from '@/components/ui/WalletAddress';
import { toast } from 'sonner';
import { User, Bell, Shield, Palette, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
            </div>
          </div>
          {user && (
            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <WalletAddress address={user.walletAddress} />
            </div>
          )}
          {user?.institution && (
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input value={user.institution} readOnly className="text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Change Password</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
