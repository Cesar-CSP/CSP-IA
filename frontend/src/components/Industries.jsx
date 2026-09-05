import { motion } from "framer-motion";
import { Stethoscope, UtensilsCrossed, Scissors, Building2, Wrench, Hotel, Store } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const INDUSTRIES = [
    {
        icon: Stethoscope,
        title: "Clínicas",
        text: "Citas, recordatorios y consultas frecuentes de pacientes sin saturar la recepción.",
    },
    {
        icon: UtensilsCrossed,
        title: "Restaurantes",
        text: "Reservas de mesa, carta y horarios atendidos al instante, incluso en pleno servicio.",
    },
    {
        icon: Scissors,
        title: "Peluquerías y estética",
        text: "Reservas, cambios y cancelaciones gestionados automáticamente por WhatsApp.",
    },
    {
        icon: Building2,
        title: "Inmobiliarias",
        text: "Interesados cualificados, visitas agendadas y respuestas sobre propiedades 24/7.",
    },
    {
        icon: Wrench,
        title: "Talleres",
        text: "Citas de taller, presupuestos básicos y estado de reparaciones sin descolgar el teléfono.",
    },
    {
        icon: Hotel,
        title: "Hoteles",
        text: "Disponibilidad, reservas y atención al huésped a cualquier hora, todos los días.",
    },
    {
        icon: Store,
        title: "Otros negocios",
        text: "Si tu equipo repite las mismas respuestas cada día, un agente de IA puede hacerlo por ti.",
    },
];

const Industries = () => (
    <section id="sectores" data-testid="industries-section" className="py-20 sm:py-24 lg:py-28">
        <div className="container-x">
            <SectionHeading
                chapter="05"
                label="Sectores"
                title="¿Para qué tipo de empresas?"
                description="Negocios con interacciones repetitivas con clientes obtienen resultados desde el primer día."
                testid="industries-heading"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
                {INDUSTRIES.map((industry, i) => (
                    <motion.div
                        key={industry.title}
                        data-testid={`industry-card-${i}`}
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`card-hover group flex gap-5 rounded-2xl border border-white/10 bg-[#111827] p-6 sm:p-7 ${
                            i === INDUSTRIES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                        }`}
                    >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/5 text-blue-400 transition-all duration-300 group-hover:text-cyan-300 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                            <industry.icon className="h-6 w-6" strokeWidth={1.8} />
                        </span>
                        <div>
                            <h3 className="font-display text-lg font-semibold text-white">{industry.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{industry.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Industries;
