import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import * as credentialService from '@/services/credentialService';
import * as notificationService from '@/services/notificationService';
import type { Credential, Notification } from '@/types';
import { CheckCircle2, FileText, Share2, Bell, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export default function ActivityPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const [credsResponse, notifs] = await Promise.all([
          credentialService.getCredentialsByStudent(user.id),
          notificationService.getNotifications(user.id),
        ]);

        const creds = credsResponse.data || [];
        const items: ActivityItem[] = [];

        creds.forEach(c => {
          items.push({
            id: `cred-${c.id}`,
            icon: FileText,
            title: `Credential Issued: ${c.course}`,
            description: `${c.certificateType} from ${c.institutionName} — Grade: ${c.grade}`,
            timestamp: c.issueDate,
            color: 'text-accent',
          });
        });

        (notifs || []).forEach(n => {
          items.push({
            id: `notif-${n.id}`,
            icon: n.type === 'success' ? CheckCircle2 : Bell,
            title: n.title,
            description: n.message,
            timestamp: n.createdAt,
            color: n.type === 'success' ? 'text-success' : 'text-accent',
          });
        });

        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(items);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load activity data:', error);
        setActivities([]);
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Activity</h1>

      {activities.length === 0 ? (
        <EmptyState title="No activity yet" message="Your credential activity will appear here." />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />

          <div className="space-y-4">
            {activities.map(item => (
              <div key={item.id} className="flex gap-4 relative">
                <div className={`z-10 h-10 w-10 rounded-full bg-card border border-border/50 flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <Card className="flex-1 glow-card">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
