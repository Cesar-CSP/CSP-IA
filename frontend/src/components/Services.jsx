import { motion } from "framer-motion";
import { MessageCircle, PhoneCall, Workflow, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const SERVICES = [
    {
        icon: MessageCircle,
        title: "WhatsApp AI",
        text: "Atiende a tus clientes automáticamente por WhatsApp, responde preguntas y gestiona citas.",
        tags: ["Respuestas 24/7", "Reserva de citas", "Cualificación de leads"],
    },
    {
        icon: PhoneCall,
        title: "Voice AI",
        text: "Agentes de voz capaces de atender y realizar llamadas utilizando lenguaje natural.",
        tags: ["Llamadas entrantes", "Llamadas salientes", "Confirmación de citas"],
    },
    {
        icon: Workflow,
        title: "Automatización",
        text: "Conecta tus agentes de IA con los procesos y herramientas de tu empresa.",
        tags: ["Calendarios y CRM", "Email y bases de datos", "Software de gestión"],
    },
];

const Services = () => (
    <section data-testid="services-section" className="py-20 sm:py-24 lg:py-28">
        <div className="container-x">
            <SectionHeading
                chapter="03"
                label="Soluciones"
                title="WhatsApp + Voz + Automatización"
                description="Tres pilares que cubren todos los canales por los que tus clientes intentan contactar contigo."
                testid="services-heading"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
                {SERVICES.map((service, i) => (
                    <motion.article
                        key={service.title}
                        data-testid={`service-card-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className={`card-hover group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827] p-8 sm:p-10 ${
                            i === 2 ? "md:col-span-2 lg:col-span-1" : ""
                        }`}
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-[70px] transition-opacity duration-500 group-hover:bg-cyan-500/15"
                        />
                        <div className="flex items-start justify-between">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-cyan-400 ring-1 ring-cyan-400/20 transition-all duration-300 group-hover:shadow-[0_0_32px_rgba(34,211,238,0.3)]">
                                <service.icon className="h-7 w-7" strokeWidth={1.6} />
                            </span>
                            <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-400" />
                        </div>
                        <h3 className="font-display mt-8 text-xl font-semibold text-white sm:text-2xl">
                            {service.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{service.text}</p>
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </motion.article>
                ))}
            </div>
        </div>
    </section>
);

export default Services;
