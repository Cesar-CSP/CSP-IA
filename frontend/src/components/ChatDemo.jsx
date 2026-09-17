import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const SCRIPT = [
    { from: "customer", text: "Hola, quería reservar una cita.", at: 0.1 },
    { from: "ai", text: "Claro. ¿Para qué día y a qué hora le gustaría reservarla?", at: 2.16, typingFrom: 1.76 },
    { from: "customer", text: "Para mañana a las doce, si es posible.", at: 5.6 },
    {
        from: "ai",
        text: "Perfecto. Tenemos disponibilidad. Su cita queda reservada para mañana a las doce. ¿Puedo ayudarle en algo más?",
        at: 8.11,
        typingFrom: 7.72,
    },
    { from: "customer", text: "No, gracias.", at: 14.9 },
];

const WAVE_BARS = [0.45, 0.75, 1, 0.6, 0.9, 0.5, 0.95, 0.65, 0.4, 0.8, 0.55];

const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
    return `${Math.floor(safeSeconds / 60)}:${String(Math.floor(safeSeconds % 60)).padStart(2, "0")}`;
};

const ChatDemo = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(16.14);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return undefined;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleMetadata = () => setDuration(audio.duration || 16.14);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(audio.duration || 16.14);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleMetadata);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleMetadata);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlayback = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        setHasStarted(true);
        if (audio.paused) {
            if (audio.ended) audio.currentTime = 0;
            await audio.play();
        } else {
            audio.pause();
        }
    };

    const restart = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        setCurrentTime(0);
        setHasStarted(true);
        await audio.play();
    };

    const visibleMessages = SCRIPT.filter((message) => currentTime >= message.at);
    const pendingAgentMessage = SCRIPT.find(
        (message) =>
            message.from === "ai" &&
            currentTime >= (message.typingFrom ?? message.at) &&
            currentTime < message.at
    );
    const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
    const primaryLabel = isPlaying
        ? "Pausar"
        : hasStarted && currentTime > 0 && currentTime < duration
          ? "Reanudar"
          : "Escuchar demostración";

    return (
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
                        description="Escucha una conversación de reserva resuelta en segundos y sin intervención humana."
                        testid="chat-demo-heading"
                    />
                </div>

                <div className="mx-auto mt-12 max-w-xl lg:mt-16">
                    <Reveal>
                        <div data-testid="chat-demo-window" className="glass overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                            <div className="border-b border-white/5 bg-[#0D1322]/80 px-4 py-4 sm:px-5">
                                <div className="flex items-center justify-between gap-3">
                                    <img
                                        src="/logo-csp-ia.png"
                                        alt="CSP IA"
                                        className="h-8 w-auto max-w-[160px] object-contain sm:h-9 sm:max-w-[220px]"
                                        draggable="false"
                                    />
                                    <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-emerald-400">
                                        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        En línea
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">Demostración de agente de voz con IA · Clínica Demo</p>
                            </div>

                            <div
                                className="min-h-[260px] space-y-4 px-4 py-6 sm:px-6"
                                aria-live="polite"
                                data-testid="chat-demo-messages"
                            >
                                {!hasStarted && (
                                    <p className="mx-auto max-w-sm pt-14 text-center text-sm leading-relaxed text-slate-400">
                                        Pulsa «Escuchar demostración» para ver y oír cómo el agente gestiona una reserva.
                                    </p>
                                )}
                                <AnimatePresence initial={false}>
                                    {visibleMessages.map((message, index) => (
                                        <motion.div
                                            key={`${message.at}-${message.text}`}
                                            data-testid={`chat-message-${index}`}
                                            initial={{ opacity: 0, y: 14, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className={`flex ${message.from === "ai" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[78%] ${
                                                    message.from === "ai"
                                                        ? "rounded-tr-md bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                                                        : "rounded-tl-md bg-slate-800 text-slate-200"
                                                }`}
                                            >
                                                <p>{message.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isPlaying && pendingAgentMessage && (
                                        <motion.div
                                            key="typing"
                                            data-testid="chat-typing"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex justify-end"
                                        >
                                            <div
                                                className="flex items-center gap-1.5 rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-cyan-500 px-4 py-3.5"
                                                aria-label="El agente está respondiendo"
                                            >
                                                {[0, 1, 2].map((delay) => (
                                                    <motion.span
                                                        key={delay}
                                                        className="h-2 w-2 rounded-full bg-white/90"
                                                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                                        transition={{ duration: 0.9, repeat: Infinity, delay: delay * 0.15 }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="border-t border-white/5 bg-[#0D1322]/80 px-4 py-5 sm:px-5">
                                <audio ref={audioRef} src="/audio/demo-reserva-cita.mp3" preload="metadata" />
                                <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={togglePlayback}
                                        data-testid="voice-demo-toggle"
                                        aria-label={isPlaying ? "Pausar demostración" : primaryLabel}
                                        aria-pressed={isPlaying}
                                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.02] active:scale-95 sm:flex-none sm:px-5"
                                    >
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        <span className="whitespace-nowrap">{primaryLabel}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={restart}
                                        data-testid="voice-demo-restart"
                                        aria-label="Volver a empezar la demostración"
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                                    >
                                        <RotateCcw className="h-5 w-5" />
                                    </button>
                                    <div className="flex h-6 min-w-[88px] flex-1 items-center justify-end gap-1" aria-hidden="true">
                                        {WAVE_BARS.map((height, index) => (
                                            <motion.span
                                                key={height + index}
                                                className="w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400"
                                                style={{ height: `${height * 100}%`, transformOrigin: "center" }}
                                                animate={isPlaying ? { scaleY: [0.35, 1, 0.5, 0.9, 0.4] } : { scaleY: 0.28 }}
                                                transition={
                                                    isPlaying
                                                        ? {
                                                              duration: 0.7 + index * 0.05,
                                                              repeat: Infinity,
                                                              repeatType: "mirror",
                                                              ease: "easeInOut",
                                                          }
                                                        : { duration: 0.3 }
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="w-9 text-right text-[11px] tabular-nums text-slate-400">{formatTime(currentTime)}</span>
                                    <div
                                        role="progressbar"
                                        aria-label="Progreso de la demostración de voz"
                                        aria-valuemin={0}
                                        aria-valuemax={Math.round(duration)}
                                        aria-valuenow={Math.round(currentTime)}
                                        className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
                                    >
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="w-9 text-[11px] tabular-nums text-slate-400">{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p data-testid="chat-demo-note" className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-slate-400">
                            CSP IA puede conectarse con el calendario o sistema de gestión de tu empresa para automatizar todo el proceso.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ChatDemo;
