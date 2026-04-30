import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserProfile, calculateDashboardMetrics } from '@/lib/dashboardService';
import { loadFiscalProfile, calculateProfileCompletion } from '@/lib/fiscalProfileService';
import { ElioMascot3D, type MascotState } from './ElioMascot3D';

interface Props {
  state?: MascotState;
}

const extractFirstName = (fullName: string): string => {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/)[0];
};

export const AgentHero = ({ state = 'idle' }: Props) => {
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [firstName, setFirstName] = useState('');
  const [subtitle, setSubtitle] = useState('Qu\'est-ce qu\'on regarde ensemble aujourd\'hui ?');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const [userProfile, fiscalProfile] = await Promise.all([
          loadUserProfile(user.id),
          loadFiscalProfile(user.id),
        ]);

        if (cancelled) return;

        const name = extractFirstName(
          fiscalProfile.fullName || userProfile?.fullName || ''
        );
        setFirstName(name);

        // Count priority actions: alerts critical/warning
        let priorityCount = 0;
        if (userProfile) {
          const metrics = calculateDashboardMetrics(userProfile);
          priorityCount = metrics.alerts.filter(
            (a) => a.severity === 'critical' || a.severity === 'warning'
          ).length;
        }

        const completion = calculateProfileCompletion(fiscalProfile);

        if (priorityCount > 0) {
          setSubtitle(
            `Tu as ${priorityCount} action${priorityCount > 1 ? 's' : ''} en attente ce mois-ci.`
          );
        } else if (completion >= 75) {
          setSubtitle('Qu\'est-ce qu\'on regarde ensemble aujourd\'hui ?');
        } else {
          setSubtitle('Posons les bases pour que je puisse t\'aider précisément.');
        }
      } catch {
        // Defaults already set
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const greeting = firstName ? `Bonjour ${firstName}` : 'Bonjour';

  return (
    <section
      className="flex flex-col items-center text-center"
      style={{
        paddingTop: 'clamp(24px, 4vw, 32px)',
        paddingBottom: 'clamp(24px, 4vw, 32px)',
      }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <ElioMascot3D state={state} />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="mt-4 sm:mt-6 px-4"
      >
        <h2
          className="text-foreground"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {greeting}
        </h2>
        <p
          className="mt-2 text-muted-foreground"
          style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.5 }}
        >
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
};
