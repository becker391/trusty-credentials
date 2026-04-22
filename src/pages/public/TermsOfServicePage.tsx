import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    { title: '1. Acceptance of Terms', body: 'By accessing or using DACS, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the platform.' },
    { title: '2. Eligibility', body: 'You must be at least 18 years old, or the age of majority in your jurisdiction, to register an account. Institution and government accounts must be authorized by the represented entity.' },
    { title: '3. Account Responsibilities', body: 'You are responsible for safeguarding your credentials, wallet keys, and MFA devices. Notify us immediately of any unauthorized use of your account.' },
    { title: '4. Acceptable Use', body: 'You may not (a) issue credentials you are not authorized to issue, (b) impersonate any person or institution, (c) attempt to compromise the platform or other users, or (d) use DACS for unlawful purposes.' },
    { title: '5. Credentials & Blockchain Records', body: 'Issued credentials are anchored on a public blockchain. Once anchored, the cryptographic hash cannot be deleted, but credentials can be revoked by the issuing institution and will be flagged invalid in subsequent verifications.' },
    { title: '6. Intellectual Property', body: 'The DACS platform, including its design, code, and trademarks, is owned by DACS and its licensors. You retain ownership of credential content you submit.' },
    { title: '7. Service Availability', body: 'We strive for high availability but do not guarantee uninterrupted service. Blockchain network conditions may affect issuance and verification times.' },
    { title: '8. Disclaimers', body: 'DACS is provided "as is" without warranties of any kind. We do not guarantee that any third party will accept a verified credential.' },
    { title: '9. Limitation of Liability', body: 'To the maximum extent permitted by law, DACS shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform.' },
    { title: '10. Termination', body: 'We may suspend or terminate accounts that violate these terms. You may close your account at any time; on-chain records will persist as required by the immutable nature of the blockchain.' },
    { title: '11. Governing Law', body: 'These terms are governed by the laws of the jurisdiction in which DACS is incorporated, without regard to conflict-of-law principles.' },
    { title: '12. Changes', body: 'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the revised terms.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
          <FileText className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <Card className="p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Welcome to DACS. These Terms of Service govern your access to and use of the Decentralized Academic Credential System.
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
