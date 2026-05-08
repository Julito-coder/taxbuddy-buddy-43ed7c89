import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Clock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sections, type SubItem, type Status } from '@/data/simulationsCatalog';

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4B8264] bg-[#4B8264]/10 px-2 py-0.5 rounded-full">
        <Check className="h-3 w-3" /> Disponible
      </span>
    );
  }
  if (status === 'agent') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C8943E] bg-[#C8943E]/10 px-2 py-0.5 rounded-full">
        <Sparkles className="h-3 w-3" /> Via Élio
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      <Clock className="h-3 w-3" /> Bientôt
    </span>
  );
};

const Simulations = () => {
  const navigate = useNavigate();

  const handleClick = (item: SubItem) => {
    if (item.status === 'soon') return;
    if (item.to) {
      navigate(item.to);
      return;
    }
    if (item.prompt) {
      navigate('/agent', { state: { initialPrompt: item.prompt } });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Simulations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Anticipe l'impact fiscal de tes grandes décisions, du PACS à la retraite.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/simulations/immobilier')}
          className="w-full bg-gradient-to-br from-[#0F1E33] to-[#2A5A8C] text-white rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#C8943E] text-white px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" /> Outil complet
                </span>
              </div>
              <h2 className="text-xl font-bold">Simulateur immobilier</h2>
              <p className="text-sm text-white/80">
                Achat RP, locatif nu/meublé, SCI, travaux : amortissement, cashflow, patrimoine, dossier banque PDF.
              </p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-semibold">
            Lancer le simulateur
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        {sections.map((section, sIdx) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + sIdx * 0.04 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${section.accent} flex items-center justify-center`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <p className="text-xs text-muted-foreground">{section.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item) => {
                const disabled = item.status === 'soon';
                return (
                  <button
                    key={item.label}
                    onClick={() => handleClick(item)}
                    disabled={disabled}
                    className={`bg-card rounded-xl border border-[#E5E7EB] p-4 text-left transition-all flex items-start gap-3 group ${
                      disabled
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:border-[#0F1E33]/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-[#F8F5F0] flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-[#0F1E33]" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-sm font-medium text-foreground leading-tight group-hover:text-[#0F1E33] transition-colors">
                        {item.label}
                      </p>
                      <StatusBadge status={item.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        ))}

        <p className="text-xs text-muted-foreground text-center px-4 pt-6">
          Élio fournit des estimations à titre indicatif. Pour toute décision fiscale, consulte un professionnel habilité.
        </p>
      </div>
    </AppLayout>
  );
};

export default Simulations;
