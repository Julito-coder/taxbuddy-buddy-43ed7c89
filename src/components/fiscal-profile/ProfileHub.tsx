import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  loadFiscalProfile,
  saveFiscalProfile,
  FiscalProfileData,
} from '@/lib/fiscalProfileService';
import {
  MODULES,
  ModuleId,
  computeModuleProgress,
  computeOverallProgress,
  getVisibleModules,
} from './moduleRegistry';
import { ProfileHubHeader } from './ProfileHubHeader';
import { ProfileModuleCard } from './ProfileModuleCard';
import { ProfileModuleDrawer } from './ProfileModuleDrawer';
import { IdentitySection } from './IdentitySection';
import { FamilySection } from './FamilySection';
import { ProfessionalSection } from './ProfessionalSection';
import { IncomeSection } from './IncomeSection';
import { InvestmentRealEstateSection } from './InvestmentRealEstateSection';
import { InvestmentFinancialSection } from './InvestmentFinancialSection';
import { ConsentsSection } from './ConsentsSection';

export const ProfileHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<FiscalProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadFiscalProfile(user.id).then((profile) => {
      setData(profile);
      setLoading(false);
    });
  }, [user]);

  const handleChange = useCallback((updates: Partial<FiscalProfileData>) => {
    setData((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const overall = useMemo(
    () =>
      data
        ? computeOverallProgress(data)
        : {
            percentage: 0,
            qualitativeLabel: 'À démarrer',
            remainingGain: 0,
            nextModuleId: undefined as ModuleId | undefined,
            nextModuleTitle: undefined as string | undefined,
            nextModuleGain: 0,
            progresses: [],
          },
    [data]
  );

  const visibleModules = useMemo(() => (data ? getVisibleModules(data) : []), [data]);

  const openModule = (id: ModuleId) => {
    setActiveModuleId(id);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!user || !data) return;
    setSaving(true);
    const result = await saveFiscalProfile(user.id, data);
    setSaving(false);
    if (result.success) {
      toast({ title: 'Profil mis à jour', description: 'Tes informations sont enregistrées.' });
      window.dispatchEvent(
        new CustomEvent('elio:profile-updated', { detail: { source: 'profile_hub' } })
      );
      setDrawerOpen(false);
    } else {
      toast({
        title: 'Impossible d’enregistrer',
        description: result.error || 'Réessaie dans un instant.',
        variant: 'destructive',
      });
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeModule = MODULES.find((m) => m.id === activeModuleId) || null;

  const renderModuleContent = () => {
    if (!activeModule) return null;
    switch (activeModule.id) {
      case 'identity':
        return <IdentitySection data={data} onChange={handleChange} />;
      case 'family':
        return <FamilySection data={data} onChange={handleChange} />;
      case 'professional':
        return <ProfessionalSection data={data} onChange={handleChange} />;
      case 'income':
        return (
          <IncomeSection
            data={data}
            onChange={handleChange}
            onCloseDrawer={() => setDrawerOpen(false)}
          />
        );
      case 'real_estate':
        return <InvestmentRealEstateSection data={data} onChange={handleChange} />;
      case 'financial':
        return <InvestmentFinancialSection data={data} onChange={handleChange} />;
      case 'consents':
        return <ConsentsSection data={data} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <ProfileHubHeader
        percentage={overall.percentage}
        qualitativeLabel={overall.qualitativeLabel}
        remainingGain={overall.remainingGain}
        hasNextModule={!!overall.nextModuleId}
        onContinue={() => overall.nextModuleId && openModule(overall.nextModuleId)}
      />

      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Tes modules</h2>
        <p className="text-sm text-muted-foreground">
          Complète à ton rythme. Chaque module débloque des recommandations chiffrées.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleModules.map((module) => {
          const progress = computeModuleProgress(module, data);
          const isRecommended = module.id === overall.nextModuleId;
          return (
            <div key={module.id} data-module-id={module.id}>
              <ProfileModuleCard
                module={module}
                progress={progress}
                isRecommended={isRecommended}
                onClick={() => openModule(module.id)}
              />
            </div>
          );
        })}
      </div>

      <ProfileModuleDrawer
        module={activeModule}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setActiveModuleId(null);
        }}
        onSave={handleSave}
        saving={saving}
      >
        {renderModuleContent()}
      </ProfileModuleDrawer>
    </motion.div>
  );
};
