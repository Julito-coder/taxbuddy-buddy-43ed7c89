import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ElioLogo } from '@/components/layout/ElioLogo';

type LegalKey = 'mentions-legales' | 'confidentialite' | 'cgu';

const PAGES: Record<LegalKey, { title: string; intro: string }> = {
  'mentions-legales': {
    title: 'Mentions légales',
    intro:
      'Élio est édité par la société Élio (SAS) en cours d\'immatriculation. Hébergement assuré par des prestataires européens conformes RGPD.',
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    intro:
      'Tes données fiscales et bancaires sont chiffrées au repos et en transit. Tu peux exporter ou supprimer ton compte à tout moment depuis ton profil.',
  },
  cgu: {
    title: 'Conditions générales d\'utilisation',
    intro:
      'Élio fournit des estimations à titre indicatif. L\'utilisateur reste responsable de ses déclarations fiscales et de ses décisions financières.',
  },
};

const Legal = () => {
  const { key } = useParams<{ key: LegalKey }>();
  const page = key && PAGES[key as LegalKey];

  return (
    <div className="min-h-screen bg-ds-bg-primary text-ds-text-primary font-sans">
      <header className="border-b border-ds-border-light bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-ds-4 sm:px-ds-6">
          <Link to="/" className="flex items-center" aria-label="Élio — Accueil">
            <ElioLogo variant="compact" size={32} />
          </Link>
          <Link to="/" className="ds-btn ds-btn-ghost">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-ds-4 py-ds-16 sm:px-ds-6">
        {page ? (
          <article className="space-y-ds-6">
            <h1 className="text-ds-3xl font-bold text-ds-text-primary">{page.title}</h1>
            <p className="text-ds-lg text-ds-text-secondary">{page.intro}</p>
            <div className="ds-card">
              <p className="text-ds-base text-ds-text-secondary">
                Cette page est en cours de finalisation. Le document définitif sera publié avant la sortie commerciale.
                Pour toute question d'ici là :{' '}
                <a
                  href="mailto:contact@eliotax.fr"
                  className="font-medium text-ds-primary underline underline-offset-4"
                  style={{ textDecorationThickness: '2px' }}
                >
                  contact@eliotax.fr
                </a>
                .
              </p>
            </div>
          </article>
        ) : (
          <article className="space-y-ds-6">
            <h1 className="text-ds-3xl font-bold text-ds-text-primary">Page non trouvée</h1>
            <p className="text-ds-lg text-ds-text-secondary">
              Le document demandé n'existe pas. Retour à{' '}
              <Link to="/" className="font-medium text-ds-primary underline underline-offset-4">
                l'accueil
              </Link>
              .
            </p>
          </article>
        )}
      </main>
    </div>
  );
};

export default Legal;
