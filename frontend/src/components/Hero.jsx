import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PlayCircle, Bot, CheckCheck, CalendarCheck, Sparkles } from "lucide-react";

const lineReveal = {
    hidden: { y: "115%" },
    visible: (i) => ({
        y: "0%",
        transition: { delay: 0.15 + i * 0.13, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    }),
};

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.55 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    }),
};

const ChatMockup = () => (
    <div
        data-testid="hero-chat-mockup"
        className="glass w-full max-w-sm rounded-2xl p-4 pb-20 shadow-[0_24px_64px_rgba(0,0,0,0.5)] sm:pb-24"
    >
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                <Bot className="h-5 w-5 text-[#0B0F19]" />
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Agente CSP IA</p>
                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    En línea · responde al instante
                </p>
            </div>
        </div>
        <div className="space-y-3 pt-4 text-sm">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-2.5 text-slate-200">
                Hola, ¿tenéis hueco esta semana?
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-cyan-500 px-4 py-2.5 text-white">
                ¡Hola! Sí, tengo disponibilidad mañana a las 10:30 y a las 12:00. ¿Te viene bien alguna?
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-2.5 text-slate-200">
                A las 12, perfecto.
            </div>
            <div className="ml-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-cyan-500 px-4 py-2.5 text-white">
                <CalendarCheck className="h-4 w-4 shrink-0" />
                <span>Cita reservada · mañana 12:00</span>
                <CheckCheck className="h-4 w-4 shrink-0 text-cyan-100" />
            </div>
        </div>
    </div>
);

const VoiceMockup = () => (
    <div
        data-testid="hero-voice-mockup"
        className="glass w-56 rounded-2xl p-4 shadow-[0_24px_64px_rgba(0,0,0,0.5)] sm:w-64"
    >
        <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Voice AI</p>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                En llamada
            </span>
        </div>
        <div className="mt-4 flex h-12 items-end justify-center gap-1.5" aria-hidden="true">
            {[0.35, 0.7, 1, 0.55, 0.85, 0.4, 0.95, 0.6, 0.75, 0.3].map((h, i) => (
                <span
                    key={i}
                    className="eq-bar w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
                />
            ))}
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
            “Le confirmo su cita para mañana a las 12:00.”
        </p>
    </div>
);

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const yChat = useTransform(scrollYProgress, [0, 1], [0, -70]);
    const yVoice = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const yGlow = useTransform(scrollYProgress, [0, 1], [0, 120]);

    return (
        <section id="inicio" ref={ref} data-testid="hero-section" className="relative overflow-hidden pt-[72px]">
            <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <motion.div
                style={{ y: yGlow }}
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-blue-600/15 blur-[110px]"
            />

            <div className="container-x relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-28">
                <div>
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <span
                            data-testid="hero-badge"
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium text-cyan-300"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            Agentes de IA para WhatsApp, voz y procesos
                        </span>
                    </motion.div>

                    <h1
                        data-testid="hero-headline"
                        className="font-display mt-6 text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        {[
                            "Automatiza la",
                            "atención de tu",
                            <span key="l3">
                                empresa <span className="text-gradient">con IA</span>
                            </span>,
                        ].map((line, i) => (
                            <span key={i} className="block overflow-hidden pb-1">
                                <motion.span
                                    className="block"
                                    variants={lineReveal}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                >
                                    {line}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        data-testid="hero-subheadline"
                        className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
                    >
                        Agentes de IA para WhatsApp y llamadas de voz que atienden a tus clientes, gestionan citas y
                        automatizan tareas 24/7.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <a
                            href="#contacto"
                            data-testid="hero-cta-demo"
                            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-7 text-base font-semibold text-[#0B0F19] shadow-[0_8px_32px_rgba(34,211,238,0.25)] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                        >
                            Solicita una demostración
                            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#como-funciona"
                            data-testid="hero-cta-how"
                            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-base font-semibold text-white transition-colors duration-200 hover:border-cyan-400/40 hover:text-cyan-300 active:scale-95"
                        >
                            <PlayCircle className="h-5 w-5 text-cyan-400" />
                            Ver cómo funciona
                        </a>
                    </motion.div>

                    <motion.ul
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400"
                    >
                        {["Disponible 24/7", "Respuesta inmediata", "Escalado a humanos"].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-cyan-400" aria-hidden="true" />
                                {item}
                            </li>
                        ))}
                    </motion.ul>
                </div>

                <div className="relative mx-auto w-full max-w-md lg:max-w-none" data-testid="hero-visual">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div style={{ y: yChat }} className="relative z-10">
                            <ChatMockup />
                        </motion.div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-20 -mt-16 ml-auto w-fit sm:-mt-20"
                    >
                        <motion.div style={{ y: yVoice }}>
                            <VoiceMockup />
                        </motion.div>
                    </motion.div>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[90px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
