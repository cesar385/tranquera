# Tranquera — cómo publicarla en GitHub Pages

## Archivos
- `index.html`: la app completa.
- `manifest.webmanifest`, `sw.js` y la carpeta `icons/`: permiten instalarla en el celular y usarla sin señal.
- **`vendedor.html` NO va en este repositorio.** Tiene la clave que firma los códigos de activación. Guardalo solo en tu computadora.

## Publicar
1. Creá un repositorio en GitHub (por ejemplo `tranquera`) y subí todos los archivos de esta carpeta, respetando la carpeta `icons/`.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, elegí `main` y la carpeta `/ (root)`, y guardá.
3. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/tranquera/`.

## Antes de vender: configurá precios y contacto
Abrí `index.html`, buscá `const VENTA=` y completá:
- `prueba`: días de prueba gratis (hoy 15).
- `contacto.whatsapp` (con código de país, sin +: `549345…`) y `contacto.email`.
- En cada plan: `precio` (los actuales son de ejemplo) y `link`, el link de suscripción del plan que creás en Mercado Pago (Tu negocio → Suscripciones → Crear plan).
- Si cambiás los nombres o ids de los planes, cambialos igual en `vendedor.html` (`const PLANES=`).

## Cobro mensual, paso a paso
1. El cliente crea su cuenta y usa la app gratis durante la prueba.
2. Se suscribe con el link de Mercado Pago de su plan y te avisa con el email de su cuenta.
3. Vos abrís `vendedor.html`, generás el código (por 1 mes, con días de gracia) y se lo mandás por WhatsApp con el mensaje armado.
4. El cliente lo pega en **Preferencias → Plan y suscripción**.
5. Cada mes, cuando Mercado Pago te avisa el cobro, tocás **Renovar +1 mes** en `vendedor.html` y le mandás el código nuevo.

Si no renueva, la cuenta pasa a solo lectura: puede ver y exportar sus datos, pero no cargar nuevos.

## Límites de esta versión
- Los datos y las cuentas se guardan en el navegador de cada cliente. Recomendales hacer copias de seguridad (Preferencias → Copia de seguridad).
- Los códigos se verifican en el navegador. Alcanzan para empezar con pocos clientes, pero alguien con conocimientos técnicos podría saltearlos. Para cobrar a escala conviene pasar a Firebase con los avisos automáticos de Mercado Pago.
- Era responde en Telegram mientras la app esté abierta en algún dispositivo.

## Bot de Telegram con audios (versión en la nube)
El bot único (@EraTranqueraBot) vive en Supabase, en la carpeta `supabase/` de este paquete (`schema.sql` y la función `era`).
Secretos que se cargan en Supabase → Edge Functions → Secrets:
- `TELEGRAM_TOKEN`: el token que te dio BotFather.
- `GROQ_API_KEY`: para que Era entienda audios. Se saca gratis en https://console.groq.com → API Keys. Usa el modelo de transcripción whisper-large-v3-turbo, que es muy barato (unos centavos de dólar por hora de audio) y tiene un cupo gratuito diario.
  Alternativa: `OPENAI_API_KEY` (si no está la de Groq, usa la de OpenAI).

Después de cargar o cambiar secretos, abrí una vez `https://<tu-proyecto>.supabase.co/functions/v1/era`: tiene que decir `"ok":true` y `"audios":"Groq"`.

Cómo funciona: el productor manda una nota de voz → Era la pasa a texto (con los nombres de sus potreros e insumos como pista) → la registra igual que un mensaje escrito → responde «🎙️ Escuché: …» con el registro y un botón «Deshacer este registro». Audios de hasta 2 minutos. Entiende números dichos en palabras («doscientos veinte terneros», «veinticinco milímetros»).
