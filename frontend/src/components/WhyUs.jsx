import { Settings2, Plug, ShieldCheck, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const REASONS = [
    {
        icon: Settings2,
        title: "Soluciones adaptadas a cada empresa",
        text: "No usamos plantillas genéricas: cada agente se diseña según tus procesos, tu tono y tus clientes.",
    },
    {
        icon: Plug,
        title: "Integración con tus procesos",
        text: "Arquitectura preparada para conectar con tu calendario, CRM, email o software de gestión cuando lo necesites.",
    },
    {
        icon: ShieldCheck,
        title: "IA con supervisión humana",
        text: "El agente resuelve lo repetitivo y escala a una persona de tu equipo cuando la conversación lo requiere.",
    },
];

const WhyUs = () => (
    <section data-testid="why-us-section" className="py-20 sm:py-24 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
                <SectionHeading
                    chapter="08"
                    label="Por qué CSP IA"
                    title="Tecnología seria para empresas reales"
                    description="CSP IA no es una agencia más de IA. Construimos agentes y automatizaciones a medida, pensados para durar y para crecer contigo."
                    testid="why-us-heading"
                />
                <Reveal delay={0.2}>
                    <a
                        href="#contacto"
                        data-testid="why-us-cta"
                        className="group mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-7 text-base font-semibold text-cyan-300 transition-colors duration-200 hover:bg-cyan-400/10 active:scale-95"
                    >
                        Hablemos de tu caso
                        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                </Reveal>
            </div>
            <div className="space-y-5">
                {REASONS.map((reason, i) => (
                    <Reveal key={reason.title} delay={0.1 * i}>
                        <article
                            data-testid={`why-us-card-${i}`}
                            className="card-hover flex gap-5 rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-8"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-cyan-400 ring-1 ring-cyan-400/20">
                                <reason.icon className="h-6 w-6" strokeWidth={1.8} />
                            </span>
                            <div>
                                <h3 className="font-display text-lg font-semibold text-white">{reason.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">{reason.text}</p>
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default WhyUs;
