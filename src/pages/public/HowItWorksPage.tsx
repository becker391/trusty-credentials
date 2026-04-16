import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Hash, Database, Search, Shield, Lock, Globe, Zap } from 'lucide-react';
import credentialImage from '@/assets/credential-concept.jpg';

const steps = [
  { icon: GraduationCap, label: 'Issue', title: 'Institution Issues Credential', desc: 'An accredited institution creates a digital credential for a student, including course details, grade, and graduation date.' },
  { icon: Hash, label: 'Hash', title: 'SHA-256 Hash Generated', desc: 'The credential data is hashed using SHA-256, creating a unique cryptographic fingerprint that represents the credential.' },
  { icon: Database, label: 'Store', title: 'Stored on Blockchain', desc: 'The hash is published to the blockchain as an immutable record. The transaction hash and block number serve as proof.' },
  { icon: Search, label: 'Verify', title: 'Instant Verification', desc: 'Anyone can verify a credential by comparing its hash against the blockchain record — no intermediary required.' },
];

const benefits = [
  { icon: Shield, title: 'Tamper-Proof', desc: 'Once recorded on the blockchain, credentials cannot be altered or forged.' },
  { icon: Lock, title: 'Student Ownership', desc: 'Students hold credentials in their digital wallet with full control over sharing.' },
  { icon: Globe, title: 'Globally Verifiable', desc: 'Employers anywhere can instantly verify authenticity without contacting the institution.' },
  { icon: Zap, title: 'Instant Results', desc: 'Verification takes seconds, not days or weeks of manual checking.' },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">How DACS Works</h1>
        <p className="text-lg text-muted-foreground">
          A simple four-step process transforms how academic credentials are issued, stored, and verified using blockchain technology.
        </p>
      </div>

      {/* Steps with image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden border border-border/50">
          <img src={credentialImage} alt="Digital credential concept" loading="lazy" className="w-full h-auto object-cover" />
        </div>
        <div className="flex flex-col gap-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <span className="text-accent font-bold text-sm">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Why Blockchain Credentials?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(b => (
            <Card key={b.title} className="glow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <Card className="glow-card">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Smart Contracts</h4>
              <p className="text-sm text-muted-foreground">Credentials are managed through smart contracts deployed on Ethereum and Polygon networks, ensuring decentralization and immutability.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Cryptographic Hashing</h4>
              <p className="text-sm text-muted-foreground">SHA-256 hashing ensures each credential has a unique fingerprint. Any modification to the data produces a completely different hash.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Digital Wallets</h4>
              <p className="text-sm text-muted-foreground">Students receive credentials as NFTs in their digital wallets, giving them full ownership and the ability to share verifiable proofs.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
