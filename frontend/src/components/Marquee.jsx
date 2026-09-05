const ITEMS = [
    "Atención al cliente 24/7",
    "WhatsApp AI",
    "Voice AI",
    "Reserva de citas",
    "Captación de clientes",
    "Automatización empresarial",
    "Recordatorios automáticos",
    "Escalado a humanos",
];

const Marquee = () => (
    <div
        data-testid="marquee-section"
        className="overflow-hidden border-y border-white/5 bg-[#0D1322] py-5"
        aria-hidden="true"
    >
        <div className="animate-marquee flex w-max items-center gap-10 pr-10">
            {[...ITEMS, ...ITEMS].map((item, i) => (
                <span
                    key={i}
                    className="font-display flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.3em] text-slate-500"
                >
                    {item}
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                </span>
            ))}
        </div>
    </div>
);

export default Marquee;
