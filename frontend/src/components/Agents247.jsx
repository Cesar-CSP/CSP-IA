import { Clock, Zap, ShieldCheck, Repeat2, UserCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const POINTS = [
    { icon: Clock, title: "Disponible 24/7", text: "Noches, fines de semana y festivos: tu empresa nunca cierra." },
    { icon: Zap, title: "Respuestas inmediatas", text: "Cada cliente es atendido en el momento en que escribe o llama." },
    { icon: ShieldCheck, title: "Servicio consistente", text: "La misma calidad de atención en la conversación 1 y en la 1.000." },
    { icon: Repeat2, title: "Menos trabajo repetitivo", text: "Tu equipo deja de responder lo mismo cientos de veces." },
    { icon: UserCheck, title: "Escalado a humanos", text: "Cuando una conversación lo requiere, pasa a una persona de tu equipo." },
];

const Agents247 = () => (
    <section data-testid="agents-section" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-[110px]"
        />
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                    <img
                        src="https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc4Njk5NDAzNXww&ixlib=rb-4.1.0&q=85"
                        alt="Mano humana y mano robótica alcanzando un texto de inteligencia artificial, representando la automatización empresarial"
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                    <div className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl px-5 py-4 sm:bottom-6 sm:left-6 sm:right-6">
                        <div>
                            <p className="font-display text-sm font-semibold text-white sm:text-base">Agente activo</p>
                            <p className="text-xs text-slate-400">Atendiendo clientes ahora mismo</p>
                        </div>
                        <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
                            24/7
                        </span>
                    </div>
                </div>
            </Reveal>

            <div className="order-1 lg:order-2">
                <SectionHeading
                    chapter="02"
                    label="Agentes 24/7"
                    title="Agentes de IA que trabajan por ti 24/7"
                    description="CSP IA permite a tu empresa delegar las interacciones repetitivas con clientes en agentes de inteligencia artificial que nunca descansan."
                    testid="agents-heading"
                />
                <ul className="mt-10 space-y-5">
                    {POINTS.map((point, i) => (
                        <Reveal key={point.title} delay={0.08 * i}>
                            <li className="flex gap-4" data-testid={`agents-point-${i}`}>
                                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400">
                                    <point.icon className="h-5 w-5" strokeWidth={1.8} />
                                </span>
                                <div>
                                    <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                                        {point.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{point.text}</p>
                                </div>
                            </li>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

export default Agents247;
