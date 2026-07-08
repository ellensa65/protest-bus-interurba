## Funcionalitats de l'aplicació

L'objectiu de l'aplicació és per una banda poder rebre les queixes dels usuaris i quantificar els retards de les diferents operadores de bus interurbà a les comarques de Girona. Per l'altra banda s'utilitza aquesta informació per elaborar gràfics interpretatius dels retards acumulats i exposar els comentaris dels usuaris.

### 1. Inserció d'incidències per part dels usuaris

Les incidències s'introdueixen pels usuaris mitjançant un formulari clicant el botó "ESTIC A LA PARADA I EL BUS NO VE". Els camps del formulari són: operadora, minuts de retard i un camp addicional per afegir un comentari.

### 2. Quantificació dels minuts de retard

La quantificació dels minuts de retard es fa mitjançant les incidències introduïdes pels usuaris. 

### 3. Mur de comentaris dels usuaris

Els comentaris introduits pels usuaris són exposats a el mur instantàniament perquè altres ho puguin veure i llegir. Es publiquen els últims 10 comentaris. Els comentaris només es publiquen si han passat un filtratge de paraules i termes inapropiats prèviament. Els comentaris són guardats i publicats de forma totalment anònima.
**Més informació a la secció de privadesa.**

## 🛡️ Seguretat, antispam i privadesa

Aquesta aplicació està pensada per ser accessible de forma totalment oberta a la ciutadania mitjançant codis QR col·locats a l'espai públic. Per aquest motiu, s'ha implementat un model de seguretat que protegeix la plataforma contra el vandalisme digital i el spam automatitzat, garantint alhora l'anonimat absolut de l'usuari.

### 1. Protecció contra bots (anti-spam)
Per evitar la inserció massiva de dades falses o atacs de denegació de servei (DoS) en els formularis, s'utilitzen les següents mesures:

*   **Cloudflare Turnstile (Implementat):** S'ha integrat el sistema Turnstile al formulari d'incidències. Funciona de manera intel·ligent i invisible al frontend (analitzant el comportament) i es valida de forma asíncrona al backend mitjançant un *Next.js Server Action* abans de permetre qualsevol inserció a la base de dades de Supabase. Això atura els bots sense necessitat de molestar l'usuari amb reptes de codi o imatges (CAPTCHAs clàssics)optimitzant l'experiència en dispositius mòbils.

*   **Filtre de contingut i paraules ofensives (Pendent d'implementació):** S'afegirà un sistema de filtratge (*profanity filter*) en el backend de l'aplicació. Abans de publicar qualsevol comentari a **El Mur**, el text passarà per una llista de control de vocabulari no acceptat (en català i castellà). Si es detecten insults o contingut inapropiat l'enviament serà rebutjat de manera automàtica per protegir la integritat pública de la plataforma.

### 2. Privadesa de l'usuari
D'acord amb el principi de *Privacy by Design*, l'aplicació està dissenyada per recollir el mínim d'informació possible per al seu funcionament:

*   **Sense registre ni dades personals:** No es demana el nom, correu electrònic, telèfon ni cap altra dada d'identificació personal. Al sistema (i visualment a **El Mur**) tots els reports queden registrats sota la identitat única d'**"Usuari Anònim" (UA)**.
*   **Sense traçabilitat d'adreces IP:** Les adreces IP dels usuaris només es processen de manera efímera en memòria per a controls estrictes de seguretat en el servidor (com evitar peticions massives en pocs segons). **Mai es guarden a la base de dades** ni s'associen amb els comentaris o retards enviats.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
