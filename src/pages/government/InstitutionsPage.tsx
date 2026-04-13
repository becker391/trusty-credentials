import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import * as institutionService from '@/services/institutionService';
import type { Institution } from '@/types';
import { Search, Building2, Globe, Award, FileText } from 'lucide-react';

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Institution | null>(null);

  useEffect(() => {
    institutionService.getInstitutions().then(inst => {
      setInstitutions(inst);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const filtered = institutions.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Institutions</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search institutions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inst => (
          <Card key={inst.id} className="glow-card cursor-pointer" onClick={() => setSelected(inst)}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{inst.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> {inst.country}
                  </div>
                </div>
                <Badge variant="outline" className="border-success/30 text-success text-xs">Accredited</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Award className="h-3 w-3" /> {inst.accreditationId}</div>
                <div className="flex items-center gap-1"><FileText className="h-3 w-3" /> {inst.totalIssued} issued</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <Card className="glow-card">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">{selected.name}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Country:</span> {selected.country}</div>
              <div><span className="text-muted-foreground">Accreditation:</span> {selected.accreditationId}</div>
              <div><span className="text-muted-foreground">Total Issued:</span> {selected.totalIssued}</div>
              <div><span className="text-muted-foreground">Joined:</span> {selected.joinedDate}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Public Key:</span> <span className="font-mono text-xs break-all">{selected.publicKey}</span></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
