import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatEuros } from './moduleRegistry';

interface Props {
  percentage: number;
  qualitativeLabel: string;
  remainingGain: number;
  hasNextModule: boolean;
  onContinue: () => void;
}

export const ProfileHubHeader = ({
  percentage,
  qualitativeLabel,
  remainingGain,
  hasNextModule,
  onContinue,
}: Props) => {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative h-20 w-20 shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" className="stroke-muted" />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-primary"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeDasharray={circumference}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-foreground">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            État de ton profil
          </p>
          <h2 className="text-xl font-bold text-foreground mt-1">{qualitativeLabel}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Plus ton profil est précis, plus mes recommandations te font gagner de l’argent.
          </p>
        </div>

        {remainingGain > 0 && (
          <div className="md:border-l md:border-border md:pl-6 flex md:flex-col items-center md:items-start justify-between gap-2 md:min-w-[180px]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Gain à débloquer</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              jusqu’à {formatEuros(remainingGain)}
              <span className="text-sm font-medium text-muted-foreground"> /an</span>
            </p>
          </div>
        )}
      </div>

      {hasNextModule && (
        <Button
          onClick={onContinue}
          className="mt-5 w-full md:w-auto h-11 rounded-xl"
          size="lg"
        >
          Compléter le prochain module
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </motion.header>
  );
};
