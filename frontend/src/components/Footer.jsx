import { Link, useLocation } from "react-router-dom";
import { Bot, Linkedin, Twitter, Instagram } from "lucide-react";

const NAV = [
    { label: "Inicio", href: "#inicio" },
    { label: "Soluciones", href: "#soluciones" },
    { label: "Sectores", href: "#sectores" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Contacto", href: "#contacto" },
];

const LEGAL = [
    { label: "Política de privacidad", href: "/privacidad", testid: "footer-link-privacidad" },
    { label: "Aviso legal", href: "/aviso-legal", testid: "footer-link-aviso-legal" },
    { label: "Política de cookies", href: "/cookies", testid: "footer-link-cookies" },
];

const SOCIALS = [
    { icon: Linkedin, label: "LinkedIn", testid: "footer-social-linkedin" },
    { icon: Twitter, label: "Twitter / X", testid: "footer-social-twitter" },
    { icon: Instagram, label: "Instagram", testid: "footer-social-instagram" },
];

const Footer = () => {
    const location = useLocation();
    const homePrefix = location.pathname === "/" ? "" : "/";

    return (
        <footer data-testid="footer" className="border-t border-white/5 bg-[#080C14]">
            <div className="container-x grid gap-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                    <Link to="/" data-testid="footer-logo" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                            <Bot className="h-5 w-5 text-[#0B0F19]" strokeWidth={2.2} />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight">
                            CSP <span className="text-gradient">IA</span>
                        </span>
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                        Automatización inteligente para empresas.
                    </p>
                    <div className="mt-6 flex gap-3">
                        {SOCIALS.map((social) => (
                            <a
                                key={social.testid}
                                href="#"
                                data-testid={social.testid}
                                aria-label={social.label}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors duration-200 hover:border-cyan-400/40 hover:text-cyan-300"
                            >
                                <social.icon className="h-5 w-5" strokeWidth={1.8} />
                            </a>
                        ))}
                    </div>
                </div>

                <nav aria-label="Navegación del pie de página">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-500">
                        Navegación
                    </h3>
                    <ul className="mt-5 space-y-3">
                        {NAV.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={homePrefix + link.href}
                                    data-testid={`footer-link-${link.href.slice(1)}`}
                                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Enlaces legales">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-500">Legal</h3>
                    <ul className="mt-5 space-y-3">
                        {LEGAL.map((link) => (
                            <li key={link.href}>
                                <Link
                                    to={link.href}
                                    data-testid={link.testid}
                                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                data-testid="footer-cookie-settings"
                                onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                                className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                            >
                                Configurar cookies
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="border-t border-white/5">
                <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
                    <p>© 2026 CSP IA. Todos los derechos reservados.</p>
                    <p>Móstoles, Madrid · info@cspia.com</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
