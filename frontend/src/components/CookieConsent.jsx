import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cspia_cookie_consent";

const readConsent = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
};

const CookieConsent = () => {
    const [consent, setConsent] = useState(() => readConsent());
    const [bannerVisible, setBannerVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [prefs, setPrefs] = useState({ analytics: false, thirdParty: false });

    useEffect(() => {
        if (!consent) {
            const timer = setTimeout(() => setBannerVisible(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [consent]);

    useEffect(() => {
        const openSettings = () => {
            setPrefs(
                consent
                    ? { analytics: !!consent.analytics, thirdParty: !!consent.thirdParty }
                    : { analytics: false, thirdParty: false },
            );
            setModalOpen(true);
        };
        window.addEventListener("open-cookie-settings", openSettings);
        return () => window.removeEventListener("open-cookie-settings", openSettings);
    }, [consent]);

    const save = (value) => {
        const stored = { ...value, technical: true, date: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        setConsent(stored);
        setBannerVisible(false);
        setModalOpen(false);
        toast.success("Configuración de cookies guardada.");
    };

    const acceptAll = () => save({ analytics: true, thirdParty: true });
    const rejectNonEssential = () => save({ analytics: false, thirdParty: false });

    const categories = [
        {
            key: "technical",
            title: "Cookies técnicas (necesarias)",
            text: "Estas cookies permiten el funcionamiento básico del sitio web. Sin ellas, la página no puede funcionar correctamente.",
            alwaysOn: true,
        },
        {
            key: "analytics",
            title: "Cookies de analítica",
            text: "Nos ayudan a entender cómo los usuarios interactúan con la web para mejorar la experiencia.",
            alwaysOn: false,
        },
        {
            key: "thirdParty",
            title: "Cookies de terceros",
            text: "Pueden ser instaladas por servicios externos integrados en la web (formularios, analítica, hosting).",
            alwaysOn: false,
        },
    ];

    return (
        <>
            <AnimatePresence>
                {bannerVisible && !modalOpen && (
                    <motion.div
                        data-testid="cookie-banner"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="glass fixed inset-x-4 bottom-4 z-[70] rounded-2xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md sm:p-6"
                        role="dialog"
                        aria-label="Aviso de cookies"
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400">
                                <Cookie className="h-5 w-5" strokeWidth={1.8} />
                            </span>
                            <p className="text-sm leading-relaxed text-slate-300">
                                Este sitio web utiliza cookies para garantizar su funcionamiento, analizar el tráfico y
                                mejorar tu experiencia. Puedes aceptar todas las cookies, rechazarlas o configurar
                                cuáles deseas permitir.{" "}
                                <Link to="/cookies" data-testid="cookie-banner-policy-link" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                                    Más información
                                </Link>
                            </p>
                        </div>
                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                data-testid="cookie-accept-all"
                                onClick={acceptAll}
                                className="min-h-[44px] flex-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                            >
                                Aceptar todas
                            </button>
                            <button
                                type="button"
                                data-testid="cookie-reject"
                                onClick={rejectNonEssential}
                                className="min-h-[44px] flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-cyan-400/40 active:scale-95"
                            >
                                Rechazar no esenciales
                            </button>
                            <button
                                type="button"
                                data-testid="cookie-configure"
                                onClick={() => setModalOpen(true)}
                                className="min-h-[44px] flex-1 rounded-full px-4 text-sm font-semibold text-cyan-300 transition-colors duration-200 hover:bg-cyan-400/10 active:scale-95"
                            >
                                Configurar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        data-testid="cookie-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            data-testid="cookie-modal"
                            initial={{ opacity: 0, y: 48 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 48 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Configuración de cookies"
                            className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#111827] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-8"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                                        Configuración de cookies
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                        Puedes gestionar qué cookies deseas permitir en este sitio web.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    data-testid="cookie-modal-close"
                                    onClick={() => setModalOpen(false)}
                                    aria-label="Cerrar configuración de cookies"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.key}
                                        data-testid={`cookie-category-${cat.key}`}
                                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#0D1322] p-4 sm:p-5"
                                    >
                                        <div>
                                            <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                                                {cat.title}
                                            </h3>
                                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                                                {cat.text}
                                            </p>
                                            {cat.alwaysOn && (
                                                <p className="mt-2 text-xs font-semibold text-cyan-400">
                                                    Siempre activas
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            data-testid={`cookie-toggle-${cat.key}`}
                                            checked={cat.alwaysOn ? true : prefs[cat.key]}
                                            disabled={cat.alwaysOn}
                                            onCheckedChange={(checked) =>
                                                setPrefs((p) => ({ ...p, [cat.key]: checked }))
                                            }
                                            aria-label={cat.title}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    data-testid="cookie-save-preferences"
                                    onClick={() => save(prefs)}
                                    className="min-h-[48px] flex-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                                >
                                    Guardar configuración
                                </button>
                                <button
                                    type="button"
                                    data-testid="cookie-modal-accept-all"
                                    onClick={acceptAll}
                                    className="min-h-[48px] flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-cyan-400/40 active:scale-95"
                                >
                                    Aceptar todas
                                </button>
                                <button
                                    type="button"
                                    data-testid="cookie-modal-reject"
                                    onClick={rejectNonEssential}
                                    className="min-h-[48px] flex-1 rounded-full px-4 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-white/5 active:scale-95"
                                >
                                    Rechazar no esenciales
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CookieConsent;
