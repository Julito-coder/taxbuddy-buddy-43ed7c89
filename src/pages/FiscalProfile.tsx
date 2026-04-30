import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileHub } from '@/components/fiscal-profile/ProfileHub';
import { motion } from 'framer-motion';

const FiscalProfile = () => {
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-5xl mx-auto"
      >
        <header className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Profil fiscal
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Construis le profil qui te fait gagner de l’argent
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Un module à la fois. Tu peux t’arrêter quand tu veux et reprendre plus tard, tes informations sont sauvegardées en sécurité.
          </p>
        </header>

        <ProfileHub />
      </motion.div>
    </AppLayout>
  );
};

export default FiscalProfile;
