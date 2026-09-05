import Reveal from "@/components/Reveal";

const SectionHeading = ({ chapter, label, title, description, testid }) => (
    <div className="max-w-3xl">
        <Reveal>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                <span className="font-display text-sm text-slate-500">{chapter}</span>
                <span className="h-px w-8 bg-cyan-400/40" aria-hidden="true" />
                {label}
            </p>
        </Reveal>
        <Reveal delay={0.08}>
            <h2
                data-testid={testid}
                className="font-display mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
                {title}
            </h2>
        </Reveal>
        {description && (
            <Reveal delay={0.16}>
                <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">{description}</p>
            </Reveal>
        )}
    </div>
);

export default SectionHeading;
