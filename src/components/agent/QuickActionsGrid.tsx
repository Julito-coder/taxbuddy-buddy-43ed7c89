import { motion, useReducedMotion } from 'framer-motion';
import { Calculator, Coins, FileText, Building2, type LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  descriptionShort: string;
  prompt: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'tax-2025',
    icon: Calculator,
    title: 'Calcule mon impôt 2025',
    description: 'Avec ta tranche et tes revenus déclarés',
    descriptionShort: 'Tranche + revenus',
    prompt: 'Calcule mon impôt 2025',
  },
  {
    id: 'aides',
    icon: Coins,
    title: 'Vérifie mes aides',
    description: 'Aides nationales que tu pourrais réclamer',
    descriptionShort: 'Aides à réclamer',
    prompt: 'Vérifie les aides auxquelles j\'ai droit',
  },
  {
    id: 'crypto-2086',
    icon: FileText,
    title: 'Prépare ma 2086 crypto',
    description: 'Plus-values calculées en FIFO global',
    descriptionShort: 'Plus-values FIFO',
    prompt: 'Prépare ma déclaration 2086 crypto',
  },
  {
    id: 'micro-vs-sasu',
    icon: Building2,
    title: 'Compare micro vs SASU',
    description: 'Sur tes vrais chiffres d\'activité',
    descriptionShort: 'Sur tes chiffres',
    prompt: 'Compare le statut micro et SASU pour mon activité',
  },
];

interface Props {
  actions?: QuickAction[];
  onSelect?: (prompt: string, action: QuickAction) => void;
}

export const QuickActionsGrid = ({ actions = DEFAULT_ACTIONS, onSelect }: Props) => {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            type="button"
            onClick={() => onSelect?.(action.prompt, action)}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.6 + idx * 0.06,
            }}
            whileHover={
              reduce
                ? undefined
                : { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }
            }
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="group flex min-h-[80px] md:min-h-[88px] min-w-0 flex-col items-start gap-2 rounded-[var(--radius)] border border-border bg-card p-3 sm:p-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-primary/20 hover:shadow-md"
          >
            <Icon
              className="text-primary"
              size={24}
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-foreground"
                style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}
              >
                {action.title}
              </div>
              <p
                className="mt-1 text-muted-foreground"
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                <span className="hidden md:inline">{action.description}</span>
                <span className="md:hidden">{action.descriptionShort}</span>
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
