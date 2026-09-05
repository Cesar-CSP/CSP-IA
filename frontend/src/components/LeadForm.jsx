import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Mail, LoaderCircle, Send } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INITIAL = {
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    tipo_empresa: "",
    automatizar: "",
    mensaje: "",
};

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0D1322] px-4 py-3.5 text-base text-white placeholder:text-slate-500 outline-none transition-colors duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 min-h-[52px]";

const Field = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-300">
            {label}
        </label>
        {children}
    </div>
);

const LeadForm = () => {
    const [form, setForm] = useState(INITIAL);
    const [sending, setSending] = useState(false);

    const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await axios.post(`${API}/leads`, form);
            toast.success("Solicitud recibida. Te contactaremos muy pronto.");
            setForm(INITIAL);
        } catch (err) {
            toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contacto" data-testid="lead-form-section" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-10 h-80 w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]"
            />
            <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                    <SectionHeading
                        chapter="09"
                        label="Contacto"
                        title="Solicita una demostración"
                        description="Cuéntanos qué quieres automatizar y te mostraremos un agente de IA funcionando con un caso parecido al tuyo."
                        testid="lead-form-heading"
                    />
                    <Reveal delay={0.15}>
                        <ul className="mt-10 space-y-4 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400">
                                    <Mail className="h-5 w-5" strokeWidth={1.8} />
                                </span>
                                <span data-testid="contact-email">hola@cspia.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400">
                                    <Lock className="h-5 w-5" strokeWidth={1.8} />
                                </span>
                                <span className="pt-2 text-slate-400">
                                    Respuesta en menos de 24 horas laborables, sin compromiso.
                                </span>
                            </li>
                        </ul>
                    </Reveal>
                </div>

                <Reveal delay={0.1}>
                    <form
                        data-testid="lead-form"
                        onSubmit={onSubmit}
                        className="glass rounded-3xl p-6 shadow-[0_32px_80px_rgba(0,0,0,0.45)] sm:p-10"
                    >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Nombre *" htmlFor="nombre">
                                <input
                                    id="nombre"
                                    name="nombre"
                                    data-testid="lead-input-nombre"
                                    required
                                    value={form.nombre}
                                    onChange={update}
                                    placeholder="Tu nombre"
                                    className={inputClass}
                                    autoComplete="name"
                                />
                            </Field>
                            <Field label="Empresa *" htmlFor="empresa">
                                <input
                                    id="empresa"
                                    name="empresa"
                                    data-testid="lead-input-empresa"
                                    required
                                    value={form.empresa}
                                    onChange={update}
                                    placeholder="Nombre de tu empresa"
                                    className={inputClass}
                                    autoComplete="organization"
                                />
                            </Field>
                            <Field label="Email *" htmlFor="email">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    data-testid="lead-input-email"
                                    required
                                    value={form.email}
                                    onChange={update}
                                    placeholder="tu@empresa.com"
                                    className={inputClass}
                                    autoComplete="email"
                                />
                            </Field>
                            <Field label="Teléfono" htmlFor="telefono">
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    data-testid="lead-input-telefono"
                                    value={form.telefono}
                                    onChange={update}
                                    placeholder="+34 600 000 000"
                                    className={inputClass}
                                    autoComplete="tel"
                                />
                            </Field>
                            <Field label="Tipo de empresa" htmlFor="tipo_empresa">
                                <select
                                    id="tipo_empresa"
                                    name="tipo_empresa"
                                    data-testid="lead-select-tipo"
                                    value={form.tipo_empresa}
                                    onChange={update}
                                    className={`${inputClass} appearance-none ${form.tipo_empresa ? "" : "text-slate-500"}`}
                                >
                                    <option value="" disabled>
                                        Selecciona tu sector
                                    </option>
                                    <option value="clinica">Clínica</option>
                                    <option value="restaurante">Restaurante</option>
                                    <option value="peluqueria-estetica">Peluquería / centro de estética</option>
                                    <option value="inmobiliaria">Inmobiliaria</option>
                                    <option value="taller">Taller / automoción</option>
                                    <option value="hotel">Hotel / turismo</option>
                                    <option value="otro">Otro negocio</option>
                                </select>
                            </Field>
                            <Field label="¿Qué quieres automatizar?" htmlFor="automatizar">
                                <select
                                    id="automatizar"
                                    name="automatizar"
                                    data-testid="lead-select-automatizar"
                                    value={form.automatizar}
                                    onChange={update}
                                    className={`${inputClass} appearance-none ${form.automatizar ? "" : "text-slate-500"}`}
                                >
                                    <option value="" disabled>
                                        Selecciona una opción
                                    </option>
                                    <option value="whatsapp">Atención por WhatsApp</option>
                                    <option value="llamadas">Llamadas telefónicas</option>
                                    <option value="citas">Reserva de citas</option>
                                    <option value="atencion-cliente">Atención al cliente</option>
                                    <option value="procesos">Procesos administrativos</option>
                                    <option value="todo">Todo lo anterior</option>
                                </select>
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Mensaje" htmlFor="mensaje">
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        data-testid="lead-input-mensaje"
                                        rows={4}
                                        value={form.mensaje}
                                        onChange={update}
                                        placeholder="Cuéntanos brevemente cómo atiendes hoy a tus clientes…"
                                        className={`${inputClass} min-h-[120px] resize-y`}
                                    />
                                </Field>
                            </div>
                        </div>

                        <button
                            type="submit"
                            data-testid="lead-form-submit"
                            disabled={sending}
                            className="mt-7 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-base font-semibold text-[#0B0F19] shadow-[0_8px_32px_rgba(34,211,238,0.25)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {sending ? (
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Quiero automatizar mi empresa
                                    <Send className="h-5 w-5" />
                                </>
                            )}
                        </button>
                        <p data-testid="lead-form-privacy" className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                            Tus datos se utilizan únicamente para contactar contigo sobre la demostración. Nunca los
                            compartiremos con terceros.
                        </p>
                    </form>
                </Reveal>
            </div>
        </section>
    );
};

export default LeadForm;
