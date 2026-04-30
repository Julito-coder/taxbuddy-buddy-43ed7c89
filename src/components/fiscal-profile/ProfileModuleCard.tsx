import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ModuleMeta, ModuleProgress, formatEuros } from './moduleRegistry';

interface Props {
  module: ModuleMeta;
  progress: ModuleProgress;
  isRecommended?: boolean;
  onClick: () => void;
}

const statusLabel: Record<ModuleProgress['status'], string> = {
  empty: 'À compléter',
  partial: 'En cours',
  complete: 'Complet',
};

export const ProfileModuleCard = ({ module, progress, isRecommended, onClick }: Props) => {
  const Icon = module.icon;
  const isComplete = progress.status === 'complete';

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="group text-left bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
              isComplete ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            {isComplete ? (
              <Check className="h-5 w-5 text-primary" />
            ) : (
              <Icon className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground leading-tight">
              {module.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {module.shortDescription}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {progress.filled} / {progress.total} champs essentiels
          </span>
          <Badge variant={isComplete ? 'default' : 'secondary'} className="font-medium">
            {statusLabel[progress.status]}
          </Badge>
        </div>
      </div>

      {!isComplete && module.estimatedAnnualGain > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Gain potentiel</span>
          <span className="text-sm font-semibold text-primary">
            jusqu’à {formatEuros(module.estimatedAnnualGain)}/an
          </span>
        </div>
      )}

      {isRecommended && !isComplete && (
        <Badge variant="outline" className="self-start border-primary/40 text-primary">
          Recommandé pour toi
        </Badge>
      )}
    </motion.button>
  );
};
