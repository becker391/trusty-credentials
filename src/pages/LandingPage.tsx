import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { GraduationCap, Shield, CheckCircle2, Link2, ArrowRight, Hash, Database, Search } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-accent" />
            </div>
            <span className="font-bold text-lg">DACS</span>
          </div>
          <Button onClick={() => navigate('/login')} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get Started <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-gradient">Tamper-Proof Academic Credentials</span>
          <br />on the Blockchain
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

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-4">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-2 border border-accent/20">
                  <s.icon className="h-8 w-8 text-accent" />
                </div>
                <p className="font-semibold text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block">
                  <Link2 className="h-5 w-5 text-accent/40 rotate-90 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground space-y-1">
          <p className="font-semibold">DACS — Decentralized Academic Credential System</p>
          <p>Author: John Muthui Gachuru | Student ID: J17-1358-2022</p>
          <p>Machakos University, School of Engineering & Technology, CIT Dept</p>
          <p>BSc Computer Science</p>
        </div>
      </footer>
    </div>
  );
}
