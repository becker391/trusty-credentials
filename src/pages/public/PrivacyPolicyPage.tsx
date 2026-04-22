import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    { title: '1. Information We Collect', body: 'We collect information you provide when creating an account (name, email, role, institution affiliation) and data generated through your use of DACS, including credential metadata, verification activity, and wallet addresses. Personal data is never written to the blockchain — only cryptographic hashes are anchored on-chain.' },
    { title: '2. How We Use Your Information', body: 'Your data is used to issue and verify academic credentials, secure your account, deliver notifications, prevent fraud, and improve the platform. We never sell personal data to third parties.' },
    { title: '3. Blockchain & Public Data', body: 'Credential hashes, transaction identifiers, and wallet addresses are recorded on a public blockchain and are inherently visible. Hashes are one-way and cannot be reversed to reveal personal information.' },
    { title: '4. Data Sharing', body: 'Credentials are shared only with parties you explicitly authorize (e.g. employers via a verification link). Government regulators receive aggregated, non-personal analytics for oversight purposes.' },
    { title: '5. Security', body: 'We apply industry-standard safeguards: encryption in transit and at rest, Argon2id password hashing, hardware-secured signing keys, MFA for high-privilege roles, and continuous monitoring.' },
    { title: '6. Your Rights', body: 'You may access, correct, export, or request deletion of your personal data at any time. On-chain hashes cannot be deleted but can be revoked, marking them invalid for future verifications.' },
    { title: '7. Cookies', body: 'We use strictly necessary cookies for authentication and session management. No tracking or advertising cookies are set.' },
    { title: '8. Changes to This Policy', body: 'We may update this policy to reflect product or legal changes. Material updates will be communicated by email and through an in-app notice.' },
    { title: '9. Contact', body: 'For privacy questions or data requests, reach our team via the Contact page.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
          <Shield className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <Card className="p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          DACS ("we", "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have.
        </p>
        {sections.map(s => (
          <section key={s.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
      </Card>
    </div>
  );
}
