import { motion } from "framer-motion";
import { Bot, CheckCheck, CalendarCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const MESSAGES = [
    { from: "customer", text: "Hola, quiero pedir cita para mañana.", time: "11:02" },
    {
        from: "ai",
        text: "Claro. Tengo disponibilidad a las 10:30, 12:00 y 16:30. ¿Cuál prefieres?",
        time: "11:02",
    },
    { from: "customer", text: "A las 12.", time: "11:03" },
    {
        from: "ai",
        text: "Perfecto. Tu cita ha quedado reservada para mañana a las 12:00.",
        time: "11:03",
        confirmation: true,
    },
];

const ChatDemo = () => (
    <section data-testid="chat-demo-section" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] max-w-[130vw] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]"
        />
        <div className="container-x">
            <div className="mx-auto max-w-3xl text-left sm:text-center">
                <SectionHeading
                    chapter="04"
                    label="Ejemplo real"
                    title="Así trabaja un agente de CSP IA"
                    description="Una conversación real de reserva, resuelta en menos de un minuto y sin intervención humana."
                    testid="chat-demo-heading"
                />
            </div>

            <div className="mx-auto mt-12 max-w-xl lg:mt-16">
                <Reveal>
                    <div
                        data-testid="chat-demo-window"
                        className="glass overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex items-center gap-3 border-b border-white/5 bg-[#0D1322]/80 px-5 py-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                                <Bot className="h-5 w-5 text-[#0B0F19]" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-white">Clínica Demo · Agente CSP IA</p>
                                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    en línea
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 px-4 py-6 sm:px-6" aria-live="polite">
                            {MESSAGES.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    data-testid={`chat-message-${i}`}
                                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ delay: 0.4 + i * 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex ${msg.from === "ai" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                                            msg.from === "ai"
                                                ? "rounded-tr-md bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                                                : "rounded-tl-md bg-slate-800 text-slate-200"
                                        }`}
                                    >
                                        {msg.confirmation && (
                                            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-100">
                                                <CalendarCheck className="h-3.5 w-3.5" />
                                                Reserva confirmada
                                            </span>
                                        )}
                                        <p>{msg.text}</p>
                                        <p
                                            className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                                                msg.from === "ai" ? "text-cyan-100/80" : "text-slate-500"
                                            }`}
                                        >
                                            {msg.time}
                                            {msg.from === "ai" && <CheckCheck className="h-3.5 w-3.5" />}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="border-t border-white/5 bg-[#0D1322]/80 px-5 py-4">
                            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                                <span className="flex-1 text-sm text-slate-500">Escribe un mensaje…</span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                                    <CheckCheck className="h-4 w-4 text-[#0B0F19]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <p
                        data-testid="chat-demo-note"
                        className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-slate-400"
                    >
                        CSP IA puede conectarse con el calendario o sistema de gestión de tu empresa para automatizar
                        todo el proceso.
                    </p>
                </Reveal>
            </div>
        </div>
    </section>
);

export default ChatDemo;
