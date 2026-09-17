import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const LINKS = [
    { label: "Inicio", href: "#inicio" },
    { label: "Soluciones", href: "#soluciones" },
    { label: "Sectores", href: "#sectores" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Contacto", href: "#contacto" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header
            data-testid="main-navbar"
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled || open
                    ? "border-b border-white/5 bg-[#0B0F19]/85 backdrop-blur-xl"
                    : "border-b border-transparent bg-transparent"
            }`}
        >
            <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Navegación principal">
                <a href="#inicio" data-testid="nav-logo" className="flex items-center" aria-label="CSP IA - Inicio">
                    <img
                        src="/logo-csp-ia.png"
                        alt="CSP IA"
                        className="h-9 w-auto select-none sm:h-10"
                        draggable="false"
                    />
                </a>

                <ul className="hidden items-center gap-8 lg:flex">
                    {LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                data-testid={`nav-link-${link.href.slice(1)}`}
                                className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-cyan-300"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <a
                        href="#contacto"
                        data-testid="nav-cta-demo"
                        className="group hidden items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.03] active:scale-95 sm:inline-flex"
                    >
                        Solicita una demostración
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </a>
                    <button
                        type="button"
                        data-testid="nav-menu-toggle"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-label={open ? "Cerrar menú" : "Abrir menú"}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        data-testid="nav-mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] overflow-y-auto bg-[#0B0F19] lg:hidden"
                    >
                        <ul className="container-x flex flex-col gap-1 py-8">
                            {LINKS.map((link, i) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <a
                                        href={link.href}
                                        data-testid={`nav-mobile-link-${link.href.slice(1)}`}
                                        onClick={() => setOpen(false)}
                                        className="font-display flex items-center justify-between border-b border-white/5 py-4 text-2xl font-semibold text-white transition-colors hover:text-cyan-300"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-5 w-5 text-cyan-400" />
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="container-x"
                        >
                            <a
                                href="#contacto"
                                data-testid="nav-mobile-cta-demo"
                                onClick={() => setOpen(false)}
                                className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-base font-semibold text-[#0B0F19] active:scale-95"
                            >
                                Solicita una demostración
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
