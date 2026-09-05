import { motion } from "framer-motion";
import {
    Headset,
    CalendarCheck,
    MessageCircle,
    Phone,
    UserPlus,
    BellRing,
    CircleHelp,
    ClipboardList,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const ITEMS = [
    { icon: Headset, title: "Atención al cliente", text: "Respuestas instantáneas y coherentes en cada conversación." },
    { icon: CalendarCheck, title: "Reserva de citas", text: "Citas creadas, modificadas y canceladas sin intervención." },
    { icon: MessageCircle, title: "WhatsApp", text: "Tu canal favorito atendido por un agente de IA, siempre activo." },
    { icon: Phone, title: "Llamadas telefónicas", text: "Llamadas entrantes y salientes con lenguaje natural." },
    { icon: UserPlus, title: "Captación de clientes", text: "Leads cualificados automáticamente desde el primer contacto." },
    { icon: BellRing, title: "Recordatorios", text: "Avisos de citas y seguimientos enviados en el momento justo." },
    { icon: CircleHelp, title: "Preguntas frecuentes", text: "Horarios, precios y servicios respondidos al instante." },
    { icon: ClipboardList, title: "Tareas administrativas", text: "Procesos repetitivos ejecutados sin errores ni esperas." },
];

const AutomationGrid = () => (
    <section id="soluciones" data-testid="automation-section" className="py-20 sm:py-24 lg:py-28">
        <div className="container-x">
            <SectionHeading
                chapter="01"
                label="Automatización"
                title="¿Qué podemos automatizar?"
                description="Cada interacción repetitiva de tu negocio puede ser gestionada por un agente de IA entrenado para tu empresa."
                testid="automation-heading"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
                {ITEMS.map((item, i) => (
                    <motion.div
                        key={item.title}
                        data-testid={`automation-card-${i}`}
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="card-hover group rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-7"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                            <item.icon className="h-6 w-6" strokeWidth={1.8} />
                        </span>
                        <h3 className="font-display mt-5 text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default AutomationGrid;
