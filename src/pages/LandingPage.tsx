import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { GraduationCap, Shield, CheckCircle2, Link2, ArrowRight, Hash, Database, Search } from 'lucide-react';
import heroImage from '@/assets/hero-blockchain.jpg';
import credentialImage from '@/assets/credential-concept.jpg';

const features = [
  { icon: GraduationCap, title: 'Issue', desc: 'Institutions issue tamper-proof digital credentials stored on the blockchain' },
  { icon: Shield, title: 'Own', desc: 'Students own credentials in a secure digital wallet with full control' },
  { icon: CheckCircle2, title: 'Verify', desc: 'Employers instantly verify authenticity with a single hash lookup' },
];

const steps = [
  { icon: GraduationCap, label: 'Issue', desc: 'Institution creates credential' },
  { icon: Hash, label: 'Hash', desc: 'SHA-256 hash generated' },
  { icon: Database, label: 'Store', desc: 'Stored on blockchain' },
  { icon: Search, label: 'Verify', desc: 'Instant verification' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Blockchain academic credentials" width={1920} height={800} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tamper-Proof Academic Credentials
            <br />
            <span className="text-accent">on the Blockchain</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A decentralized platform where institutions issue, students own, and employers verify academic credentials — secured by blockchain technology.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Launch Demo <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Roles
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <Card key={f.title} className="glow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works with image */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden border border-border/50">
            <img src={credentialImage} alt="Digital credential concept" loading="lazy" width={1200} height={600} className="w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <s.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">{`${i + 1}. ${s.label}`}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '566+', label: 'Credentials Issued' },
              { val: '3', label: 'Institutions' },
              { val: '1,200+', label: 'Verifications' },
              { val: '23', label: 'Fraud Prevented' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-accent">{s.val}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selector */}
      <section id="roles" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Enter the Demo</h2>
        <p className="text-center text-muted-foreground mb-8">Select a role to explore the platform</p>
        <RoleSelector />
      </section>

      {/* About */}
      <section id="about" className="container mx-auto px-4 py-16">
        <Card className="glow-card">
          <CardContent className="p-8 text-center space-y-3">
            <h2 className="text-2xl font-bold">About This Project</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DACS is a final year project demonstrating how blockchain technology can revolutionize academic credential verification, eliminating fraud and empowering students with ownership of their achievements.
            </p>
            <p className="text-sm text-muted-foreground">
              Developed by John Muthui Gachuru — Machakos University, BSc Computer Science
            </p>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
