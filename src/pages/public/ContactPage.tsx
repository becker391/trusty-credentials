import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast({ title: 'Message sent', description: "We'll get back to you within 1–2 business days." });
    }, 900);
  };

  const channels = [
    { icon: Mail, title: 'Email', value: 'support@dacs.platform', desc: 'General inquiries & support' },
    { icon: MessageSquare, title: 'Partnerships', value: 'partners@dacs.platform', desc: 'Institutional onboarding' },
    { icon: MapPin, title: 'Headquarters', value: 'Nairobi, Kenya', desc: 'East Africa operations hub' },
    { icon: Clock, title: 'Response Time', value: '1–2 business days', desc: 'Mon–Fri, 9:00–17:00 EAT' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Questions about DACS, integration, or partnerships? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Channels */}
        <div className="space-y-4">
          {channels.map(c => (
            <Card key={c.title} className="p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-sm">{c.title}</h3>
                <p className="text-sm text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Form */}
        <Card className="p-8 lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold">Message Received</h2>
              <p className="text-muted-foreground max-w-md">
                Thanks for reaching out. Our team will respond to <span className="text-foreground font-medium">{form.email}</span> within 1–2 business days.
              </p>
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: 'general', message: '' }); }}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Send a Message</h2>
                <p className="text-sm text-muted-foreground">Tell us a bit about your inquiry.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={form.topic} onValueChange={v => setForm({ ...form, topic: v })}>
                  <SelectTrigger id="topic"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="institution">Institution Onboarding</SelectItem>
                    <SelectItem value="verifier">Verifier / Employer</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="press">Press & Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
              </div>

              <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
