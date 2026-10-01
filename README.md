# Sitio web CIDATEL S.A.S.

Página corporativa de CIDATEL S.A.S. publicada en **https://cidatel.co**, con un panel para editar el contenido sin tocar código en **https://cidatel.co/admin/**.

Este documento explica cómo está armado el sitio, cómo se edita y qué hacer cuando algo deja de funcionar.

---

## 1. Cómo funciona

```
 Editor (navegador)                     Visitantes
        │                                    │
        ▼                                    ▼
 cidatel.co/admin  ──login──►  DecapBridge   cidatel.co  (DNS en GoDaddy)
   (Decap CMS)                     │              │
        │      guarda cambios      │              ▼
        └──────────────────────────┴──►  GitHub ──►  Netlify (publica el sitio)
                                     repo        (deploy automático en cada cambio)
```

1. El código y el contenido viven en GitHub: **jcamachoc01/Pagina-Citadel**, rama `main`.
2. **Netlify** publica el sitio automáticamente cada vez que hay un cambio en `main`. Tarda 1 o 2 minutos.
3. **Decap CMS** (`/admin`) es el panel de edición. Cada vez que alguien guarda, se crea un commit en GitHub y Netlify vuelve a publicar.
4. **DecapBridge** maneja el inicio de sesión del panel (Google, Microsoft o contraseña) y le escribe a GitHub con un token de acceso.
5. **GoDaddy** es donde está registrado el dominio `cidatel.co`. Ahí se manejan los DNS, que apuntan a Netlify. El correo de @cidatel.co (Microsoft 365 / Outlook) usa ese mismo DNS.

No hay base de datos ni servidor propio. Todo el contenido editable está en un solo archivo: `content/site.json`.

---

## 2. Servicios y cuentas

Ninguna contraseña ni token se guarda en este repositorio.

| Servicio | Para qué | Cuenta / ubicación |
|---|---|---|
| **GitHub** | Código y contenido | Usuario `jcamachoc01`, repo `Pagina-Citadel` |
| **Netlify** | Publicación y certificado HTTPS | Proyecto `clever-cuchufli-c00cce` (inicia sesión con GitHub `jcamachoc01`) |
| **DecapBridge** | Login del panel `/admin` | https://decapbridge.com (sitio "CIDATEL") |
| **GoDaddy** | Dominio `cidatel.co` y DNS | Cuenta de GoDaddy de CIDATEL |
| **Microsoft 365** | Correo @cidatel.co | No depende del sitio, pero comparte los DNS de GoDaddy |

**Direcciones útiles**

- Sitio: https://cidatel.co
- Panel de edición: https://cidatel.co/admin/
- Dirección alterna de Netlify (siempre funciona, aunque falle el dominio): https://clever-cuchufli-c00cce.netlify.app
- Repositorio: https://github.com/jcamachoc01/Pagina-Citadel

---

## 3. Editar el contenido (uso diario)

1. Entra a **https://cidatel.co/admin/** y presiona **Login**.
2. Inicia sesión con tu cuenta (tienes que haber recibido una invitación de DecapBridge).
3. Abre **Contenido del sitio → Contenido principal**.
4. Cambia lo que necesites y presiona **Publish → Publish now**.
5. En 1 o 2 minutos el cambio aparece en https://cidatel.co. Si no lo ves, recarga con `Ctrl + F5`.

**Qué se puede editar:** datos de la empresa (nombre, eslogan, NIT), portada (título, subtítulo y texto de los botones), "Quiénes somos", misión, visión, servicios (imagen, ícono, título y descripción) y contacto.

**Reglas a tener en cuenta**

- **Correo principal:** un solo correo. Los demás van en **Correos adicionales**, cada uno con su etiqueta (por ejemplo "Correo alterno").
- **WhatsApp:** solo números, con el código de país y sin espacios ni `+`. Ejemplo: `573153539092`.
- **Imágenes de servicios:** usa fotos horizontales, idealmente de unos 1200 × 730 px y menos de 400 KB. Se guardan en `assets/img/`.

**Agregar o quitar editores:** desde el panel del sitio en DecapBridge, opción de invitar usuarios por correo.

---

## 4. Renovar el token de GitHub (cuando vence)

DecapBridge usa un **token de acceso personal (fine-grained)** de la cuenta `jcamachoc01` para guardar los cambios en GitHub. Los tokens tienen fecha de vencimiento.

**Síntoma de que venció:** puedes entrar a `/admin`, pero al guardar sale un error (por ejemplo *"Failed to persist entry"*, *"Bad credentials"* o *"401"*), o el panel no carga el contenido. El sitio público sigue funcionando normal: solo se bloquea la edición.

**Fecha de vencimiento del token actual:** se consulta en GitHub → *Settings → Developer settings → Personal access tokens → Fine-grained tokens*. Conviene tener un recordatorio en el calendario una semana antes.

### Pasos para renovarlo

1. Inicia sesión en GitHub con la cuenta **jcamachoc01**.
2. Abre https://github.com/settings/personal-access-tokens.
3. Tienes dos opciones:
   - **Regenerar el token existente** (`Pagina DecapBridge`): ábrelo y usa **Regenerate token**. Mantiene la configuración.
   - **Crear uno nuevo** con **Generate new token**, configurado así:
     - **Token name:** `Pagina DecapBridge`
     - **Resource owner:** `jcamachoc01`
     - **Expiration:** *Custom*, 1 año
     - **Repository access:** *Only select repositories* → `jcamachoc01/Pagina-Citadel`
     - **Permissions → Repositories:**
       - **Contents:** Read and write
       - **Pull requests:** Read and write
       - **Metadata:** Read-only (viene obligatorio)
4. Presiona **Generate token** y **copia el token** (empieza por `github_pat_`). GitHub lo muestra una sola vez.
5. Entra a https://decapbridge.com, abre el sitio **CIDATEL** y en la configuración pega el token nuevo en **Github access token**. Guarda.
6. Prueba: entra a https://cidatel.co/admin/, haz un cambio pequeño y publícalo.
7. Si creaste un token nuevo, borra el anterior en GitHub.
8. Pon en el calendario la nueva fecha de vencimiento.

**Nunca** pegues el token en este repositorio, en correos ni en chats. Solo va en DecapBridge.

---

## 5. Configuración de DNS (GoDaddy)

En GoDaddy, en **Mis productos → cidatel.co → DNS**, el sitio depende solo de estos dos registros:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `clever-cuchufli-c00cce.netlify.app` |

**No modifiques** estos registros, que son del correo de Microsoft 365: `MX`, `autodiscover`, `lyncdiscover`, `sip`, los `TXT`, ni los `NS`/`SOA`. Si se cambian, el correo @cidatel.co deja de funcionar.

**No uses Netlify DNS ni cambies los nameservers** a Netlify: se perderían los registros del correo.

---

## 6. Si algo falla

| Problema | Qué revisar |
|---|---|
| **El sitio no carga en cidatel.co** | Abre https://clever-cuchufli-c00cce.netlify.app. Si esa sí carga, el problema es del dominio: revisa en GoDaddy que el dominio no se haya vencido y que los registros de la sección 5 sigan iguales. |
| **Tampoco carga la dirección de Netlify** | En Netlify, revisa **Deploys**: el último deploy debe estar en *Published*. Si falló, abre el log. Puedes volver a una versión anterior con **Publish deploy** en un deploy previo. |
| **Netlify pide login o da error 401** | Se activó la protección de visitantes. En Netlify: **Web security** (o *Project configuration → Access & security*) → **Visitor access** → *No protection*. |
| **Error de certificado / "No seguro"** | En Netlify: **Domain management → HTTPS → Renew certificate**. Se renueva solo cada 3 meses; solo falla si los DNS cambiaron. |
| **No puedo entrar a /admin** | Revisa que tu correo esté invitado en DecapBridge. En DecapBridge, la *login URL* debe ser `https://cidatel.co/admin/index.html`. |
| **Entro a /admin pero no guarda** | Casi siempre es el **token vencido**: ver la sección 4. |
| **Al guardar dice "… is required"** | Hay un campo obligatorio vacío. Llénalo. Si el campo no tiene que ver con lo que estás editando, puede ser un campo nuevo que no existe en `content/site.json` y hay que agregarlo. |
| **Hice un cambio por error en el contenido** | En GitHub, abre el historial de `content/site.json` (**History**), busca la versión anterior y restáurala, o pídeselo a quien mantenga el código. Cada guardado del panel queda como un commit, así que nada se pierde. |
| **El correo @cidatel.co dejó de funcionar** | Alguien tocó los registros del correo en GoDaddy (sección 5). Compáralos con lo que indica Microsoft 365 en *Admin center → Configuración → Dominios*. |

---

## 7. Formulario de contacto

El formulario de la sección Contacto usa **Netlify Forms** (formulario `contacto`). Para recibir los mensajes:

1. En Netlify: **Forms → Enable form detection**, y después un nuevo deploy (**Deploys → Trigger deploy**).
2. En **Forms → Form notifications → Add notification → Email notification**, escribe el correo que debe recibir los mensajes.

Los mensajes también se pueden ver en Netlify, en **Forms → contacto**. El plan gratuito tiene un límite mensual de envíos.

---

## 8. Para desarrolladores

**Estructura**

```
index.html          Página principal (estructura)
css/styles.css      Estilos
js/main.js          Carga content/site.json y lo pinta en la página
content/site.json   Todo el contenido editable
admin/index.html    Carga Decap CMS
admin/config.yml    Configuración del CMS: login (DecapBridge) y campos editables
assets/img/         Logo e imágenes de servicios (y las que se suban desde el CMS)
netlify.toml        Configuración de Netlify (sin build; cabeceras de seguridad)
```

No hay paso de compilación: Netlify publica los archivos tal cual.

**Correr el sitio en local:** la página lee `content/site.json` con `fetch`, así que no funciona abriendo el `index.html` con doble clic. Hay que usar un servidor local, por ejemplo:

```bash
npx serve .
# o
python -m http.server 8000
```

**Agregar un campo editable nuevo** requiere tres cambios:

1. Agregar el campo en `admin/config.yml`, dentro de la colección `sitio`.
2. Agregar el valor inicial en `content/site.json`. Si el CMS lo exige y no existe, nadie podrá guardar.
3. Mostrarlo en la página desde `js/main.js` (y agregar el elemento en `index.html` si hace falta).

**Antes de hacer `git push`, haz `git pull`:** el CMS también hace commits en `main`.

**Autor de los commits:** el repositorio usa como autor `jcamachoc01` con el correo noreply de GitHub (configuración local del repo). Los commits que hace el CMS incluyen en el mensaje el nombre y correo de quien editó.
