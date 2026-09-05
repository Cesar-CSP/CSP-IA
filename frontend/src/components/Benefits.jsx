import { motion } from "framer-motion";
import {
    Clock,
    Zap,
    PhoneOff,
    ListChecks,
    CalendarPlus,
    PiggyBank,
    TrendingUp,
    Layers,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const BENEFITS = [
    { icon: Clock, title: "Atención 24/7", text: "Tu empresa siempre disponible, incluso fuera de horario." },
    { icon: Zap, title: "Respuesta inmediata", text: "Cada mensaje y llamada atendido al instante." },
    { icon: PhoneOff, title: "Menos llamadas perdidas", text: "Ninguna oportunidad se queda sin respuesta." },
    { icon: ListChecks, title: "Menos trabajo repetitivo", text: "Tu equipo se centra en lo que aporta valor." },
    { icon: CalendarPlus, title: "Más citas y oportunidades", text: "Reservas y leads cualificados de forma automática." },
    { icon: PiggyBank, title: "Reducción de costes", text: "Menos horas dedicadas a tareas administrativas." },
    { icon: TrendingUp, title: "Mayor productividad", text: "Procesos que avanzan solos, sin fricción." },
    { icon: Layers, title: "Escalable", text: "Atiende 10 o 1.000 conversaciones a la vez." },
];

const Benefits = () => (
    <section data-testid="benefits-section" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]"
        />
        <div className="container-x">
            <SectionHeading
                chapter="07"
                label="Beneficios"
                title="Lo que cambia cuando tu empresa se automatiza"
                description="Resultados tangibles desde el primer día, sin aumentar la plantilla."
                testid="benefits-heading"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
                {BENEFITS.map((benefit, i) => (
                    <motion.div
                        key={benefit.title}
                        data-testid={`benefit-card-${i}`}
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="card-hover rounded-2xl border border-white/10 bg-gradient-to-b from-[#111827] to-[#0D1322] p-6 sm:p-7"
                    >
                        <benefit.icon className="h-7 w-7 text-cyan-400" strokeWidth={1.6} />
                        <h3 className="font-display mt-5 text-base font-semibold text-white sm:text-lg">
                            {benefit.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{benefit.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Benefits;
