// Servidor de Era para Tranquera: bot único de Telegram para todas las empresas + activación de planes.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { crearEra } from "./era-core.js";

const URL_SB = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TOKEN = Deno.env.get("TELEGRAM_TOKEN") ?? "";
const GROQ = Deno.env.get("GROQ_API_KEY") ?? "";     // transcripción de audios (recomendado: rápido y barato)
const OPENAI = Deno.env.get("OPENAI_API_KEY") ?? ""; // alternativa si no hay GROQ_API_KEY
const AUDIO_MAX_SEG = 120;
const db = createClient(URL_SB, SERVICE, { auth: { persistSession: false } });
const FN_URL = `${URL_SB}/functions/v1/era`;
const PRUEBA_DIAS = 15;
const LIC_PUB = {"kty": "EC", "crv": "P-256", "x": "jPHuV6w2HiDa9YWkq8XUZ0pZqlxCh32mKijVTtMFhcw", "y": "A2x3H3zF3GWvbP1nNaSnZSm8EBy7hnu5CNfZnJT3RWs"};
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };

async function secreto(): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("era-webhook:" + TOKEN));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
}
async function tg(metodo: string, params: Record<string, unknown>) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${metodo}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
  return await r.json();
}
const enviar = (chat: number, text: string, extra: Record<string, unknown> = {}) => tg("sendMessage", { chat_id: chat, text: text.slice(0, 4000), disable_web_page_preview: true, ...extra });
const BOTON_DESHACER = { reply_markup: { inline_keyboard: [[{ text: "↩️ Deshacer este registro", callback_data: "undo" }]] } };

// Audios: Telegram guarda el archivo; lo bajamos y lo pasamos a texto con Whisper (Groq u OpenAI).
async function transcribir(fileId: string, pista: string): Promise<string> {
  const f = await tg("getFile", { file_id: fileId });
  if (!f.ok) throw new Error("No pude bajar el audio de Telegram.");
  const audio = await (await fetch(`https://api.telegram.org/file/bot${TOKEN}/${f.result.file_path}`)).blob();
  const nombre = (f.result.file_path.split("/").pop() || "audio.ogg").replace(/\.oga$/, ".ogg");
  const prov = GROQ ? { url: "https://api.groq.com/openai/v1/audio/transcriptions", key: GROQ, model: "whisper-large-v3-turbo" } : { url: "https://api.openai.com/v1/audio/transcriptions", key: OPENAI, model: "whisper-1" };
  const fd = new FormData();
  fd.append("file", audio, nombre);
  fd.append("model", prov.model);
  fd.append("language", "es");
  fd.append("temperature", "0");
  fd.append("response_format", "json");
  fd.append("prompt", pista.slice(0, 800));
  const r = await fetch(prov.url, { method: "POST", headers: { Authorization: `Bearer ${prov.key}` }, body: fd });
  if (!r.ok) { console.error("transcripción", r.status, await r.text()); throw new Error("No pude pasar el audio a texto."); }
  return String((await r.json()).text || "").trim();
}
// vocabulario del campo para que la transcripción escriba bien los nombres
function pistaCampo(data: any): string {
  const pots = (data?.potreros || []).map((p: any) => p.nombre).slice(0, 40);
  const ins = (data?.insumos || []).map((i: any) => i.nombre).slice(0, 30);
  return `Registro de campo en Argentina. Potreros: ${pots.join(", ")}. Insumos: ${ins.join(", ")}. Vacas, vaquillonas, terneros, terneras, novillos, toros, milímetros, hectáreas, pulverización, siembra, cosecha.`;
}
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });

function aTexto(html: string): string {
  let t = String(html)
    .replace(/<p><a [^>]*class="btn[^"]*"[^>]*>.*?<\/a><\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<(div|table|ul|p)\b/gi, "\n<$1")
    .replace(/<\/(p|li|tr|h\d|ul|table|div)>/gi, "\n").replace(/<li>/gi, "• ").replace(/<\/t[dh]>/gi, " · ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return t.split("\n").map((l) => l.replace(/(\s·\s*)+$/, "").replace(/\s+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
const hoyAR = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const masDias = (f: string, n: number) => { const d = new Date(f.slice(0, 10) + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fD = (s: string) => s.split("-").reverse().join("/");

function estadoPlan(org: { lic: any; created_at: string }) {
  const h = hoyAR(), L = org.lic;
  if (L && L.h >= h) return { activo: true, telegram: true, nombre: L.p === "pro" ? "Tranquera Pro" : "Tranquera" };
  const fin = masDias(org.created_at, PRUEBA_DIAS);
  if (!L && h <= fin) return { activo: true, telegram: true, nombre: "Prueba" };
  return { activo: false, telegram: false, nombre: "" };
}

const AYUDA_TG = (campo: string, pots: string[]) => `Soy Era, la asistente de ${campo}. Escribime o mandame un audio con lo que pasó en el campo y lo registro en Tranquera. Por ejemplo:
• Llovieron 25 mm ayer
• Nacieron 6 terneros en ${pots[0] || "Lote 1"}
• Moví 20 vacas de ${pots[0] || "Lote 1"} a ${pots[1] || "Lote 2"}
• Usé 20 litros de glifosato en ${pots[1] || "Lote 2"}
• Tarea: vacunar terneros el viernes

También podés preguntarme:
• ¿Cuánta lluvia cayó este año?
• ¿Qué potreros están en descanso?
• ¿Qué insumos están bajo mínimo?

Comandos: /resumen · /deshacer · /campo · /ayuda`;

async function boton(cb: any) {
  const chat = cb.message?.chat?.id;
  if (!chat || cb.data !== "undo") { await tg("answerCallbackQuery", { callback_query_id: cb.id }); return; }
  await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Deshaciendo…" });
  await tg("editMessageReplyMarkup", { chat_id: chat, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } });
  await procesar({ chat: cb.message.chat, from: cb.from, text: "/deshacer" });
}

async function procesar(m: any) {
  if (!m?.chat || m.chat.type !== "private") return;
  const chat = m.chat.id as number;
  let texto = String(m.text || m.caption || "").trim();
  const audio = m.voice || m.audio || m.video_note;
  let oido = "";
  const quien = [m.from?.first_name, m.from?.last_name].filter(Boolean).join(" ") || m.from?.username || "Usuario";

  // vincular: /start CODIGO
  const mStart = texto.match(/^\/start(?:@\w+)?\s+([A-Z0-9]{6,})/i);
  if (mStart) {
    const { data: c } = await db.from("tg_codigos").select("*").eq("codigo", mStart[1].toUpperCase()).maybeSingle();
    if (!c || new Date(c.expira) < new Date()) { await enviar(chat, "Ese código venció o no es válido. Generá uno nuevo en Tranquera → Preferencias → Era en Telegram."); return; }
    const { data: mi } = await db.from("miembros").select("nombre").eq("org_id", c.org_id).eq("user_id", c.user_id).maybeSingle();
    let campo = c.campo_id;
    if (!campo) { const { data: cs } = await db.from("campos").select("id").eq("org_id", c.org_id).order("updated_at", { ascending: false }).limit(1); campo = cs?.[0]?.id ?? null; }
    await db.from("tg_links").upsert({ chat_id: chat, org_id: c.org_id, campo_id: campo, user_id: c.user_id, nombre: mi?.nombre || quien, tg_usuario: m.from?.username || "", undo: null });
    await db.from("tg_codigos").delete().eq("codigo", c.codigo);
    const { data: cp } = await db.from("campos").select("nombre,data").eq("id", campo).maybeSingle();
    const pots = (cp?.data?.potreros || []).map((p: any) => p.nombre);
    await enviar(chat, `¡Listo, ${mi?.nombre || quien}! Ya estás conectado a ${cp?.nombre || "tu campo"}.\n\n` + AYUDA_TG(cp?.nombre || "tu campo", pots));
    return;
  }

  const { data: link } = await db.from("tg_links").select("*").eq("chat_id", chat).maybeSingle();
  if (!link) {
    await enviar(chat, `Hola ${quien}, soy Era, la asistente de campo de Tranquera. Para usarme, entrá a Tranquera → Preferencias → Era en Telegram y tocá «Conectar mi Telegram».`);
    return;
  }
  const { data: org } = await db.from("orgs").select("id,nombre,lic,created_at").eq("id", link.org_id).single();
  const plan = estadoPlan(org);
  const log = (resp: string) => db.from("tg_log").insert({ org_id: link.org_id, chat_id: chat, quien: link.nombre || quien, texto: (audio && !m.text ? "🎙️ " : "") + (texto || (audio ? "(audio)" : "(sin texto)")), resp: resp.slice(0, 600) });
  if (!plan.telegram) {
    const r = plan.activo ? "Era en Telegram no está incluida en el plan de tu empresa." : "La suscripción de tu empresa no está activa, así que no puedo registrar datos por acá. Pedile al administrador que la renueve.";
    await enviar(chat, r); await log(r); return;
  }

  // elegir campo
  const { data: campos } = await db.from("campos").select("id,nombre").eq("org_id", link.org_id).order("nombre");
  const mCampo = texto.match(/^\/campo(?:@\w+)?\s*(\d+)?/i);
  if (mCampo) {
    if (!campos?.length) { await enviar(chat, "Tu empresa todavía no tiene campos."); return; }
    if (mCampo[1]) {
      const c = campos[+mCampo[1] - 1];
      if (!c) { await enviar(chat, "No encontré ese número de campo."); return; }
      await db.from("tg_links").update({ campo_id: c.id, undo: null }).eq("chat_id", chat);
      await enviar(chat, `Listo, ahora trabajo con ${c.nombre}.`); return;
    }
    await enviar(chat, "Tus campos:\n" + campos.map((c: any, i: number) => `${i + 1}. ${c.nombre}${c.id === link.campo_id ? " (actual)" : ""}`).join("\n") + "\n\nPara cambiar, mandá por ejemplo /campo 2");
    return;
  }
  let campoId = link.campo_id && campos?.some((c: any) => c.id === link.campo_id) ? link.campo_id : campos?.[0]?.id;
  if (!campoId) { await enviar(chat, "Tu empresa todavía no tiene campos cargados."); return; }

  if (audio && !texto) {
    if (!GROQ && !OPENAI) { const r = "Todavía no puedo escuchar audios: falta configurar la transcripción. Mientras tanto, escribime lo que pasó."; await enviar(chat, r); await log(r); return; }
    if ((audio.duration || 0) > AUDIO_MAX_SEG) { const r = `El audio es muy largo. Mandame audios de hasta ${AUDIO_MAX_SEG / 60} minutos, mejor uno por cada cosa que pasó.`; await enviar(chat, r); await log(r); return; }
    tg("sendChatAction", { chat_id: chat, action: "typing" });
    const { data: cpp } = await db.from("campos").select("data").eq("id", campoId).single();
    try { oido = await transcribir(audio.file_id, pistaCampo(cpp?.data)); }
    catch (e) { const r = (e as Error).message + " Probá de nuevo o escribímelo."; await enviar(chat, r); await log(r); return; }
    if (!oido) { const r = "No llegué a entender el audio. Probá de nuevo hablando cerca del celular, o escribímelo."; await enviar(chat, r); await log(r); return; }
    texto = oido;
  }

  for (let intento = 0; intento < 3; intento++) {
    const { data: cp } = await db.from("campos").select("id,nombre,data,version").eq("id", campoId).single();
    const E = crearEra();
    E.cargar(cp.data || {});
    E.usuario = link.nombre || quien;
    E.via = "telegram";
    E.permitir = plan.activo;
    const pots = (E.S.potreros || []).map((p: any) => p.nombre);
    let q = texto;
    if (!q) { const r = "Mandame un mensaje de texto o un audio contándome qué pasó, por ejemplo: «Llovieron 25 mm»."; await enviar(chat, r); await log(r); return; }
    if (/^\/(start|ayuda|help)\b/i.test(q)) { const r = AYUDA_TG(cp.nombre, pots); await enviar(chat, r); await log("(ayuda)"); return; }
    if (/^\/deshacer\b/i.test(q)) {
      if (!link.undo || link.undo.campo !== campoId) { const r = "No tengo nada tuyo para deshacer."; await enviar(chat, r); await log(r); return; }
      const data = { ...cp.data };
      for (const k of E.DATA) data[k] = link.undo.snap[k];
      const { data: ok } = await db.from("campos").update({ data, version: cp.version + 1, updated_at: new Date().toISOString(), updated_by: (link.nombre || quien) + " (Telegram)" }).eq("id", cp.id).eq("version", cp.version).select("id");
      if (!ok?.length) continue;
      await db.from("tg_links").update({ undo: null }).eq("chat_id", chat);
      const r = "Listo, deshice tu último registro."; await enviar(chat, r); await log(r); return;
    }
    if (/^\/resumen\b/i.test(q)) q = "resumen";
    q = q.replace(/^\/\w+(@\w+)?\s*/, "") || q;
    const a = E.responder(q);
    let r = aTexto(a.html).replace(/^Listo, quedó registrado\.\s*/, "✅ Listo, quedó registrado.\n");
    if (a.html === E.AYUDA) r = "No llegué a entender eso. Mandá /ayuda para ver ejemplos de lo que puedo registrar y responder.";
    if (a.undo) {
      const { data: ok } = await db.from("campos").update({ data: E.S, version: cp.version + 1, updated_at: new Date().toISOString(), updated_by: (link.nombre || quien) + " (Telegram)" }).eq("id", cp.id).eq("version", cp.version).select("id");
      if (!ok?.length) continue; // otro dispositivo guardó justo antes: reintento con los datos nuevos
      await db.from("tg_links").update({ undo: { campo: cp.id, snap: JSON.parse(a.undo) } }).eq("chat_id", chat);
    }
    if ((campos?.length || 0) > 1 && a.undo) r = `[${cp.nombre}] ` + r;
    if (oido) r = `🎙️ Escuché: «${oido}»\n\n` + r;
    await enviar(chat, r, a.undo ? BOTON_DESHACER : {}); await log(r); return;
  }
  await enviar(chat, "Hubo muchos cambios al mismo tiempo en este campo. Probá de nuevo en un momento.");
}

// activar plan con un código firmado por el vendedor
const b64dec = (t: string) => { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return Uint8Array.from(atob(t), (c) => c.charCodeAt(0)); };
async function licencia(req: Request) {
  const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: u } = await db.auth.getUser(jwt);
  if (!u?.user) return json({ error: "Iniciá sesión para activar un plan." }, 401);
  const { org, code } = await req.json().catch(() => ({}));
  const { data: mi } = await db.from("miembros").select("rol").eq("org_id", org).eq("user_id", u.user.id).maybeSingle();
  if (!mi || !["Administrador", "Administrador con finanzas"].includes(mi.rol)) return json({ error: "Solo un administrador de la empresa puede activar el plan." }, 403);
  const m = String(code || "").trim().replace(/\s+/g, "").match(/^TQ1\.([\w-]+)\.([\w-]+)$/);
  if (!m) return json({ error: "El código no tiene el formato correcto. Copialo completo, empieza con TQ1." }, 400);
  const key = await crypto.subtle.importKey("jwk", { ...LIC_PUB, ext: true }, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, b64dec(m[2]), new TextEncoder().encode(m[1]));
  if (!ok) return json({ error: "El código no es válido." }, 400);
  const P = JSON.parse(new TextDecoder().decode(b64dec(m[1])));
  if (String(P.e).toLowerCase() !== String(u.user.email).toLowerCase()) return json({ error: `Este código es para ${P.e}. Tu cuenta es ${u.user.email}.` }, 400);
  if (P.h < hoyAR()) return json({ error: `Este código venció el ${fD(P.h)}. Pedí uno nuevo.` }, 400);
  const lic = { p: P.p, h: P.h, i: P.i, e: P.e };
  await db.from("orgs").update({ lic }).eq("id", org);
  return json({ ok: true, lic });
}

async function configurarWebhook() {
  if (!TOKEN) return { ok: false, error: "Falta cargar el secreto TELEGRAM_TOKEN en Supabase." };
  const me = await tg("getMe", {});
  if (!me.ok) return { ok: false, error: "Telegram rechazó el token: " + (me.description || "") };
  const info = await tg("getWebhookInfo", {});
  const quiero = ["message", "callback_query"];
  if (info.result?.url !== FN_URL || quiero.some((u) => !(info.result?.allowed_updates || ["message"]).includes(u))) {
    const r = await tg("setWebhook", { url: FN_URL, secret_token: await secreto(), allowed_updates: quiero, drop_pending_updates: false, max_connections: 20 });
    if (!r.ok) return { ok: false, error: r.description };
    await tg("setMyCommands", { commands: [{ command: "ayuda", description: "Qué puedo registrar y preguntar" }, { command: "resumen", description: "Resumen del campo" }, { command: "deshacer", description: "Deshacer tu último registro" }, { command: "campo", description: "Cambiar de campo" }] });
  }
  return { ok: true, bot: me.result.username, webhook: FN_URL, audios: GROQ ? "Groq" : OPENAI ? "OpenAI" : "sin configurar (falta GROQ_API_KEY)" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  try {
    if (req.method === "GET") return json(await configurarWebhook());
    if (url.pathname.endsWith("/licencia")) return await licencia(req);
    if (req.headers.get("x-telegram-bot-api-secret-token") !== (await secreto())) return new Response("no", { status: 401 });
    const upd = await req.json();
    if (upd.callback_query) await boton(upd.callback_query);
    else await procesar(upd.message);
    return new Response("ok");
  } catch (e) {
    console.error("era", e);
    return url.pathname.endsWith("/licencia") ? json({ error: "Error del servidor." }, 500) : new Response("ok");
  }
});
