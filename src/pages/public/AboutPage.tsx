import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Shield, Users, Globe, Code, Database } from 'lucide-react';

const techStack = [
  { icon: Code, name: 'React + TypeScript', desc: 'Modern frontend framework with type safety' },
  { icon: Database, name: 'Blockchain (Ethereum/Polygon)', desc: 'Immutable ledger for credential records' },
  { icon: Shield, name: 'SHA-256 Hashing', desc: 'Cryptographic integrity verification' },
  { icon: Globe, name: 'Decentralized Storage', desc: 'IPFS for distributed credential storage' },
];

const stakeholders = [
  { icon: GraduationCap, role: 'Institutions', desc: 'Issue tamper-proof credentials with blockchain anchoring and manage student records securely.' },
  { icon: Users, role: 'Students', desc: 'Own credentials in a digital wallet, share verifiable proofs, and control access to their academic records.' },
  { icon: Shield, role: 'Employers & Verifiers', desc: 'Instantly verify credential authenticity without contacting the issuing institution.' },
  { icon: Globe, role: 'Government', desc: 'Oversee the credential ecosystem, monitor institutions, and track system-wide analytics.' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">About DACS</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The Decentralized Academic Credential System (DACS) is a blockchain-powered platform designed to 
          eliminate credential fraud, empower students with ownership of their achievements, and enable 
          instant verification for employers worldwide.
        </p>
      </div>

      {/* Mission */}
      <Card className="glow-card">
        <CardContent className="p-8 md:p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            To create a transparent, secure, and universally accessible system for academic credential 
            verification that eliminates fraud, reduces verification time from weeks to seconds, and 
            gives students true ownership of their academic achievements through blockchain technology.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholders */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Platform Stakeholders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stakeholders.map(s => (
            <Card key={s.role} className="glow-card">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.role}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map(t => (
            <Card key={t.name} className="glow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <t.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-destructive/20">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-destructive">The Problem</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Credential fraud costs billions globally each year</li>
              <li>• Manual verification takes days or weeks</li>
              <li>• Paper certificates are easily forged or lost</li>
              <li>• No universal standard for credential verification</li>
              <li>• Students lack control over their own records</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-accent">The Solution</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Immutable blockchain records prevent forgery</li>
              <li>• Instant verification in under 3 seconds</li>
              <li>• Digital credentials with cryptographic proof</li>
              <li>• Universal hash-based verification standard</li>
              <li>• Student-owned credentials via digital wallets</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
