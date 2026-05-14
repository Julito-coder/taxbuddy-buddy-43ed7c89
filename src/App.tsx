import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Bulletin from "./pages/Bulletin";
import HomePage from "./pages/Home";
import AgentPage from "./pages/Agent";
import Simulations from "./pages/Simulations";
import ProfilPage from "./pages/Profil";
import CoffreFortPage from "./pages/CoffreFort";
import CalendarPage from "./pages/Calendar";
import Scanner from "./pages/Scanner";
import RealEstateSimulator from "./pages/RealEstateSimulator";
import NewSimulation from "./pages/simulator/NewSimulation";
import SimulationDetails from "./pages/simulator/SimulationDetails";
import CompareSimulations from "./pages/simulator/CompareSimulations";
import SavingsSimulator from "./pages/SavingsSimulator";
import PacsSimulator from "./pages/simulators/PacsSimulator";
import FreelanceSimulator from "./pages/simulators/FreelanceSimulator";
import AidesDetector from "./pages/AidesDetector";
import Finances from "./pages/Finances";
import Coach from "./pages/Coach";
import FiscalProfile from "./pages/FiscalProfile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Navigate to="/" replace />} />
            <Route path="/lp" element={<Navigate to="/" replace />} />
            <Route path="/quiz" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/legal/:key" element={<Legal />} />

            {/* Accueil (pillar 1) */}
            <Route path="/bulletin" element={<ProtectedRoute><Bulletin /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><Coach /></ProtectedRoute>} />
            <Route path="/agent" element={<ProtectedRoute><AgentPage /></ProtectedRoute>} />

            {/* Mes finances (pillar 2) */}
            <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />

            {/* Pilotage (pillar 3) */}
            <Route path="/calendrier" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/aides" element={<ProtectedRoute><AidesDetector /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
            <Route path="/profil/fiscal" element={<ProtectedRoute><FiscalProfile /></ProtectedRoute>} />
            <Route path="/profil/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Simulations (pillar 4) - hub fusionné */}
            <Route path="/simulations" element={<ProtectedRoute><Simulations /></ProtectedRoute>} />
            <Route path="/simulations/immobilier" element={<ProtectedRoute><RealEstateSimulator /></ProtectedRoute>} />
            <Route path="/simulations/immobilier/new" element={<ProtectedRoute><NewSimulation /></ProtectedRoute>} />
            <Route path="/simulations/immobilier/edit/:id" element={<ProtectedRoute><NewSimulation /></ProtectedRoute>} />
            <Route path="/simulations/immobilier/compare" element={<ProtectedRoute><CompareSimulations /></ProtectedRoute>} />
            <Route path="/simulations/immobilier/:id" element={<ProtectedRoute><SimulationDetails /></ProtectedRoute>} />
            <Route path="/simulations/epargne" element={<ProtectedRoute><SavingsSimulator /></ProtectedRoute>} />
            <Route path="/simulations/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
            <Route path="/simulations/pacs" element={<ProtectedRoute><PacsSimulator /></ProtectedRoute>} />
            <Route path="/simulations/freelance" element={<ProtectedRoute><FreelanceSimulator /></ProtectedRoute>} />

            {/* Coffre-fort (utility, hors nav principale) */}
            <Route path="/coffre" element={<ProtectedRoute><CoffreFortPage /></ProtectedRoute>} />

            {/* Tableau de bord legacy */}
            <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/tableau-de-bord" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

            {/* Backward-compat redirects (anciens chemins → nouveaux) */}
            <Route path="/outils" element={<Navigate to="/simulations" replace />} />
            <Route path="/outils/calendrier" element={<Navigate to="/calendrier" replace />} />
            <Route path="/outils/scanner" element={<Navigate to="/simulations/scanner" replace />} />
            <Route path="/outils/simulateur" element={<Navigate to="/simulations/immobilier" replace />} />
            <Route path="/outils/simulateur/new" element={<Navigate to="/simulations/immobilier/new" replace />} />
            <Route path="/outils/simulateur/compare" element={<Navigate to="/simulations/immobilier/compare" replace />} />
            <Route path="/outils/simulateur/edit/:id" element={<Navigate to="/simulations/immobilier/edit/:id" replace />} />
            <Route path="/outils/simulateur/:id" element={<Navigate to="/simulations/immobilier/:id" replace />} />
            <Route path="/outils/epargne" element={<Navigate to="/simulations/epargne" replace />} />
            <Route path="/outils/aides" element={<Navigate to="/aides" replace />} />
            <Route path="/outils/banques" element={<Navigate to="/finances" replace />} />
            <Route path="/outils/coffre" element={<Navigate to="/coffre" replace />} />
            <Route path="/simulateurs" element={<Navigate to="/simulations" replace />} />
            <Route path="/simulateurs/pacs" element={<Navigate to="/simulations/pacs" replace />} />
            <Route path="/simulateurs/freelance" element={<Navigate to="/simulations/freelance" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
