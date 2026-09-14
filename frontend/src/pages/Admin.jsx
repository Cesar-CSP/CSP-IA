import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Bot, LogOut, Plus, Lock, LoaderCircle, Users, RefreshCw, X, Pencil, Trash2, Download } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "cspia_admin_token";

const EMPTY = { nombre: "", empresa: "", email: "", telefono: "", tipo_empresa: "", automatizar: "", mensaje: "" };

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0D1322] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 min-h-[48px]";

const formatDate = (iso) => {
    try {
        return new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
    } catch {
        return iso;
    }
};

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const Admin = () => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchLeads = async (activeToken = token) => {
        setLoadingLeads(true);
        try {
            const { data } = await axios.get(`${API}/leads`, {
                headers: { Authorization: `Bearer ${activeToken}` },
            });
            setLeads(data);
        } catch (e) {
            if (e.response?.status === 401) {
                localStorage.removeItem(TOKEN_KEY);
                setToken("");
            } else {
                toast.error("No se pudieron cargar los leads.");
            }
        } finally {
            setLoadingLeads(false);
        }
    };

    useEffect(() => {
        if (token) fetchLeads(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");
        try {
            const { data } = await axios.post(`${API}/admin/login`, { password });
            localStorage.setItem(TOKEN_KEY, data.token);
            setToken(data.token);
            setPassword("");
        } catch (err) {
            const detail = err.response?.data?.detail;
            setAuthError(typeof detail === "string" ? detail : "Error al iniciar sesión.");
        } finally {
            setAuthLoading(false);
        }
    };

    const onLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setLeads([]);
    };

    const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const resetForm = () => {
        setForm(EMPTY);
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (lead) => {
        setForm({
            nombre: lead.nombre || "",
            empresa: lead.empresa || "",
            email: lead.email || "",
            telefono: lead.telefono || "",
            tipo_empresa: lead.tipo_empresa || "",
            automatizar: lead.automatizar || "",
            mensaje: lead.mensaje || "",
        });
        setEditingId(lead.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSaveLead = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                const { data } = await axios.put(`${API}/admin/leads/${editingId}`, form, authHeaders);
                setLeads((prev) => prev.map((l) => (l.id === editingId ? data : l)));
                toast.success("Lead actualizado correctamente.");
            } else {
                const { data } = await axios.post(`${API}/admin/leads`, form, authHeaders);
                setLeads((prev) => [data, ...prev]);
                toast.success("Lead añadido correctamente.");
            }
            resetForm();
        } catch (err) {
            if (err.response?.status === 401) {
                onLogout();
            } else {
                toast.error("No se pudo guardar el lead.");
            }
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (lead) => {
        if (!window.confirm(`¿Eliminar el lead de ${lead.nombre} (${lead.empresa})? Esta acción no se puede deshacer.`)) return;
        setDeletingId(lead.id);
        try {
            await axios.delete(`${API}/admin/leads/${lead.id}`, authHeaders);
            setLeads((prev) => prev.filter((l) => l.id !== lead.id));
            toast.success("Lead eliminado.");
        } catch (err) {
            if (err.response?.status === 401) {
                onLogout();
            } else {
                toast.error("No se pudo eliminar el lead.");
            }
        } finally {
            setDeletingId(null);
        }
    };

    const exportCSV = () => {
        const headers = ["nombre", "empresa", "email", "telefono", "tipo_empresa", "automatizar", "mensaje", "origen", "fecha"];
        const rows = leads.map((l) =>
            [l.nombre, l.empresa, l.email, l.telefono, l.tipo_empresa, l.automatizar, l.mensaje, l.origen, formatDate(l.created_at)]
                .map(csvEscape)
                .join(";"),
        );
        const csv = "\uFEFF" + [headers.map(csvEscape).join(";"), ...rows].join("\r\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-csp-ia-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success("CSV descargado.");
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-5" data-testid="admin-login-page">
                <div className="glass w-full max-w-md rounded-3xl p-8 sm:p-10">
                    <Link to="/" data-testid="admin-login-logo" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                            <Bot className="h-5 w-5 text-[#0B0F19]" strokeWidth={2.2} />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight">
                            CSP <span className="text-gradient">IA</span>
                        </span>
                    </Link>
                    <h1 className="font-display mt-8 text-2xl font-semibold text-white">Panel de administración</h1>
                    <p className="mt-2 text-sm text-slate-400">Introduce la contraseña para gestionar los leads.</p>
                    <form onSubmit={onLogin} className="mt-6">
                        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-300">
                            Contraseña
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            data-testid="admin-password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••••••"
                            className={inputClass}
                            autoComplete="current-password"
                        />
                        {authError && (
                            <p data-testid="admin-login-error" className="mt-3 text-sm text-red-400">
                                {authError}
                            </p>
                        )}
                        <button
                            type="submit"
                            data-testid="admin-login-submit"
                            disabled={authLoading}
                            className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-base font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
                        >
                            {authLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                            Entrar
                        </button>
                    </form>
                    <Link
                        to="/"
                        data-testid="admin-back-home"
                        className="mt-6 block text-center text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                        Volver a la web
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19]" data-testid="admin-dashboard">
            <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0F19]/85 backdrop-blur-xl">
                <div className="container-x flex h-[72px] items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                            <Bot className="h-5 w-5 text-[#0B0F19]" strokeWidth={2.2} />
                        </span>
                        <div>
                            <p className="font-display text-base font-bold leading-tight">
                                CSP <span className="text-gradient">IA</span>
                            </p>
                            <p className="text-xs text-slate-500">Panel de administración</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            data-testid="admin-refresh-button"
                            onClick={() => fetchLeads()}
                            aria-label="Recargar leads"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            data-testid="admin-logout-button"
                            onClick={onLogout}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-red-400/40 hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container-x py-10 sm:py-14">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display flex items-center gap-3 text-2xl font-semibold text-white sm:text-3xl">
                            <Users className="h-7 w-7 text-cyan-400" />
                            Leads
                            <span
                                data-testid="admin-leads-count"
                                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300"
                            >
                                {leads.length}
                            </span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Solicitudes de la web y leads añadidos manualmente.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            data-testid="admin-export-csv"
                            onClick={exportCSV}
                            disabled={leads.length === 0}
                            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-cyan-400/40 hover:text-cyan-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download className="h-4 w-4" />
                            Exportar CSV
                        </button>
                        <button
                            type="button"
                            data-testid="admin-add-lead-toggle"
                            onClick={() => (showForm ? resetForm() : setShowForm(true))}
                            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                        >
                            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {showForm ? "Cancelar" : "Añadir lead"}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form
                        data-testid="admin-lead-form"
                        onSubmit={onSaveLead}
                        className="glass mt-8 rounded-3xl p-6 sm:p-8"
                    >
                        {editingId && (
                            <p data-testid="admin-form-editing" className="mb-4 text-sm font-medium text-cyan-300">
                                Editando lead existente
                            </p>
                        )}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input name="nombre" data-testid="admin-input-nombre" required value={form.nombre} onChange={update} placeholder="Nombre *" className={inputClass} />
                            <input name="empresa" data-testid="admin-input-empresa" required value={form.empresa} onChange={update} placeholder="Empresa *" className={inputClass} />
                            <input name="email" type="email" data-testid="admin-input-email" required value={form.email} onChange={update} placeholder="Email *" className={inputClass} />
                            <input name="telefono" type="tel" data-testid="admin-input-telefono" value={form.telefono} onChange={update} placeholder="Teléfono" className={inputClass} />
                            <input name="tipo_empresa" data-testid="admin-input-tipo" value={form.tipo_empresa} onChange={update} placeholder="Tipo de empresa (clínica, restaurante…)" className={inputClass} />
                            <input name="automatizar" data-testid="admin-input-automatizar" value={form.automatizar} onChange={update} placeholder="¿Qué quiere automatizar?" className={inputClass} />
                            <textarea name="mensaje" data-testid="admin-input-mensaje" rows={3} value={form.mensaje} onChange={update} placeholder="Mensaje / notas" className={`${inputClass} min-h-[96px] resize-y sm:col-span-2`} />
                        </div>
                        <button
                            type="submit"
                            data-testid="admin-lead-submit"
                            disabled={saving}
                            className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-sm font-semibold text-[#0B0F19] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-8"
                        >
                            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {editingId ? "Guardar cambios" : "Guardar lead"}
                        </button>
                    </form>
                )}

                <div className="mt-10">
                    {loadingLeads ? (
                        <div className="flex items-center justify-center py-20" data-testid="admin-loading">
                            <LoaderCircle className="h-8 w-8 animate-spin text-cyan-400" />
                        </div>
                    ) : leads.length === 0 ? (
                        <p data-testid="admin-empty" className="rounded-2xl border border-white/10 bg-[#111827] p-10 text-center text-sm text-slate-400">
                            Todavía no hay leads. Añade el primero con el botón "Añadir lead".
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2" data-testid="admin-leads-list">
                            {leads.map((lead) => (
                                <li
                                    key={lead.id}
                                    data-testid={`admin-lead-card-${lead.id}`}
                                    className="rounded-2xl border border-white/10 bg-[#111827] p-6"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="font-display truncate text-lg font-semibold text-white">
                                                {lead.nombre}
                                            </h2>
                                            <p className="truncate text-sm text-cyan-300">{lead.empresa}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                lead.origen === "manual"
                                                    ? "border border-blue-400/30 bg-blue-400/10 text-blue-300"
                                                    : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                            }`}
                                        >
                                            {lead.origen === "manual" ? "Manual" : "Web"}
                                        </span>
                                    </div>
                                    <dl className="mt-4 space-y-1.5 text-sm">
                                        <div className="flex gap-2">
                                            <dt className="w-32 shrink-0 text-slate-500">Email</dt>
                                            <dd className="break-all text-slate-300">{lead.email}</dd>
                                        </div>
                                        {lead.telefono && (
                                            <div className="flex gap-2">
                                                <dt className="w-32 shrink-0 text-slate-500">Teléfono</dt>
                                                <dd className="text-slate-300">{lead.telefono}</dd>
                                            </div>
                                        )}
                                        {lead.tipo_empresa && (
                                            <div className="flex gap-2">
                                                <dt className="w-32 shrink-0 text-slate-500">Tipo</dt>
                                                <dd className="text-slate-300">{lead.tipo_empresa}</dd>
                                            </div>
                                        )}
                                        {lead.automatizar && (
                                            <div className="flex gap-2">
                                                <dt className="w-32 shrink-0 text-slate-500">Automatizar</dt>
                                                <dd className="text-slate-300">{lead.automatizar}</dd>
                                            </div>
                                        )}
                                        {lead.mensaje && (
                                            <div className="flex gap-2">
                                                <dt className="w-32 shrink-0 text-slate-500">Mensaje</dt>
                                                <dd className="text-slate-300">{lead.mensaje}</dd>
                                            </div>
                                        )}
                                    </dl>
                                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                        <p className="text-xs text-slate-500">{formatDate(lead.created_at)}</p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                data-testid={`admin-edit-lead-${lead.id}`}
                                                onClick={() => startEdit(lead)}
                                                aria-label={`Editar lead de ${lead.nombre}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                data-testid={`admin-delete-lead-${lead.id}`}
                                                onClick={() => onDelete(lead)}
                                                disabled={deletingId === lead.id}
                                                aria-label={`Eliminar lead de ${lead.nombre}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
                                            >
                                                {deletingId === lead.id ? (
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
