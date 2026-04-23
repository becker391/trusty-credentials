import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  GraduationCap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Hash,
  Database,
  Search,
  Lock,
  Globe,
  Zap,
  Sparkles,
} from 'lucide-react';
import heroCertificate from '@/assets/hero-certificate.jpg';

const features = [
  {
    icon: GraduationCap,
    title: 'Issue',
    desc: 'Institutions issue tamper-proof digital credentials anchored on the blockchain.',
  },
  {
    icon: Shield,
    title: 'Own',
    desc: 'Students own their credentials in a secure self-sovereign digital wallet.',
  },
  {
    icon: CheckCircle2,
    title: 'Verify',
    desc: 'Employers verify authenticity instantly with a single cryptographic lookup.',
  },
];

const steps = [
  { icon: GraduationCap, label: 'Issue', desc: 'Institution creates the credential' },
  { icon: Hash, label: 'Hash', desc: 'SHA-256 fingerprint generated' },
  { icon: Database, label: 'Anchor', desc: 'Recorded on the blockchain' },
  { icon: Search, label: 'Verify', desc: 'Anyone verifies in seconds' },
];

const benefits = [
  { icon: Lock, title: 'Tamper-Proof', desc: 'Cryptographic hashing makes forgery mathematically impossible.' },
  { icon: Globe, title: 'Globally Portable', desc: 'Verifiable across borders without intermediaries.' },
  { icon: Zap, title: 'Instant Verification', desc: 'Replace weeks of manual checks with sub-second lookups.' },
  { icon: Sparkles, title: 'Student-Owned', desc: 'Learners hold and share their credentials on their terms.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0">
          <img
            src={heroCertificate}
            alt="Blockchain-secured academic certificate"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
              <Sparkles className="h-3 w-3" /> Decentralized Academic Credential System
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Tamper-Proof Academic Credentials
              <br />
              <span className="text-accent">Secured by the Blockchain</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              DACS lets institutions issue, students own, and employers verify academic
              credentials with cryptographic certainty — no paperwork, no fraud, no waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/verify')}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Verify a Credential <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">A trust layer for academic achievement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three roles, one immutable source of truth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="glow-card bg-card/60 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <f.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">From issuance to verification</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four simple steps, backed by cryptography.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="relative">
              <Card className="bg-card/60 backdrop-blur border-border/60 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      STEP {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{s.label}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border/50 bg-card/40">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why DACS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The credentialing infrastructure modern education deserves.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col items-start">
                <div className="h-11 w-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <b.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to issue trust?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join the institutions modernizing academic credentials with blockchain-grade integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Create an account <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/how-it-works')}>
              Learn how it works
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
