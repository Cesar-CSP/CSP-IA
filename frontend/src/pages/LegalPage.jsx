import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const Block = ({ block }) => {
    if (block.list) {
        return (
            <ul className="mt-3 space-y-2">
                {block.list.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>
        );
    }
    return <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{block.text}</p>;
};

const LegalPage = ({ content }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19]" data-testid={`legal-page-${content.slug}`}>
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0F19]/85 backdrop-blur-xl">
                <div className="container-x flex h-[72px] items-center justify-between">
                    <Link to="/" data-testid="legal-logo" className="flex items-center gap-2.5" aria-label="CSP IA - Inicio">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                            <Bot className="h-5 w-5 text-[#0B0F19]" strokeWidth={2.2} />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight">
                            CSP <span className="text-gradient">IA</span>
                        </span>
                    </Link>
                    <Link
                        to="/"
                        data-testid="legal-back-home"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio
                    </Link>
                </div>
            </header>

            <main className="container-x py-14 sm:py-20">
                <article className="mx-auto max-w-3xl">
                    <Reveal>
                        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                            <span className="h-px w-8 bg-cyan-400/40" aria-hidden="true" />
                            Legal
                        </p>
                        <h1
                            data-testid="legal-title"
                            className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                        >
                            {content.title}
                        </h1>
                        <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">{content.intro}</p>
                    </Reveal>

                    <div className="mt-12 space-y-10">
                        {content.sections.map((section, i) => (
                            <Reveal key={i} delay={0.04 * i}>
                                <section data-testid={`legal-section-${i}`}>
                                    <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                                        {section.title}
                                    </h2>
                                    {section.body.map((block, j) => (
                                        <Block key={j} block={block} />
                                    ))}
                                </section>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={0.1}>
                        <p className="mt-14 border-t border-white/10 pt-6 text-xs text-slate-500">
                            Última actualización: agosto de 2026
                        </p>
                    </Reveal>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPage;
