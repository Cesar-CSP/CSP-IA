import { motion } from "framer-motion";
import { Search, PenTool, Rocket } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const STEPS = [
    {
        icon: Search,
        num: "01",
        title: "Analizamos tu negocio",
        text: "Identificamos las tareas repetitivas y oportunidades de automatización.",
    },
    {
        icon: PenTool,
        num: "02",
        title: "Diseñamos tu agente de IA",
        text: "Configuramos el agente según las necesidades y procesos de tu empresa.",
    },
    {
        icon: Rocket,
        num: "03",
        title: "Tu agente comienza a trabajar",
        text: "Tu IA empieza a atender clientes y automatizar procesos 24/7.",
    },
];

const Process = () => (
    <section id="como-funciona" data-testid="process-section" className="py-20 sm:py-24 lg:py-28">
        <div className="container-x">
            <SectionHeading
                chapter="06"
                label="Cómo funciona"
                title="De la primera llamada a tu agente trabajando"
                description="Un proceso simple y acompañado, sin que tengas que preocuparte por la tecnología."
                testid="process-heading"
            />

            <div className="relative mt-12 lg:mt-16">
                <div
                    aria-hidden="true"
                    className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-blue-500/40 via-cyan-400/40 to-transparent lg:left-0 lg:top-6 lg:h-px lg:w-full lg:bg-gradient-to-r"
                />
                <ol className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
                    {STEPS.map((step, i) => (
                        <motion.li
                            key={step.num}
                            data-testid={`process-step-${i}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="relative pl-16 lg:pl-0 lg:pt-16"
                        >
                            <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.35)] lg:left-0">
                                <step.icon className="h-6 w-6 text-[#0B0F19]" strokeWidth={2} />
                            </span>
                            <p className="font-display text-sm font-bold tracking-[0.3em] text-cyan-400/70">
                                {step.num}
                            </p>
                            <h3 className="font-display mt-2 text-lg font-semibold text-white sm:text-xl">
                                {step.title}
                            </h3>
                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{step.text}</p>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </div>
    </section>
);

export default Process;
