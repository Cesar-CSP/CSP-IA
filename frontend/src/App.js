import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import LegalPage from "@/pages/LegalPage";
import CookieConsent from "@/components/CookieConsent";
import { LEGAL_CONTENT } from "@/data/legalContent";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0B0F19] text-white">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/privacidad" element={<LegalPage content={LEGAL_CONTENT.privacidad} />} />
                    <Route path="/aviso-legal" element={<LegalPage content={LEGAL_CONTENT.avisoLegal} />} />
                    <Route path="/cookies" element={<LegalPage content={LEGAL_CONTENT.cookies} />} />
                </Routes>
                <CookieConsent />
                <Toaster position="bottom-right" theme="dark" richColors />
            </div>
        </BrowserRouter>
    );
}

export default App;
