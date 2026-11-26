/**
 * Illustrations propres à Hometastic, dessinées dans le style Fluent Emoji Flat (aplats, 32 × 32) pour les
 * objets sans emoji : quincaillerie, bricolage, ménage, hygiène et beauté. Même licence que le dépôt.
 * Préfixe « nid- » ; elles rejoignent le sprite des illustrations Fluent (`installerSprite`).
 */

// Teintes reprises de Fluent Emoji Flat.
const METAL_CLAIR = '#E1D8EC';
const METAL = '#CDC4D6';
const METAL_MOYEN = '#B4ACBC';
const METAL_FONCE = '#998EA4';
const ARDOISE = '#635994';
const NUIT = '#433B6B';
const BLANC = '#F4F4F4';
const ROUGE = '#F8312F';
const ROUGE_FONCE = '#CA0B4A';
const ORANGE = '#FF822D';
const JAUNE = '#FCD53F';
const MIEL = '#FFB02E';
const VERT = '#00D26A';
const VERT_FONCE = '#008463';
const BLEU = '#00A6ED';
const BLEU_FONCE = '#0074BA';
const BLEU_CLAIR = '#AEDDFF';
const ROSE = '#F70A8D';
const ROSE_MOYEN = '#FF6DC6';
const ROSE_CLAIR = '#FFC5E5';
const VIOLET = '#8D65C5';
const BRUN = '#6D4534';
const BOIS = '#A56953';
const CARAMEL = '#D3883E';
const SABLE = '#F3AD61';
const CREME = '#FFDEA7';

/** Contour discret pour les objets blancs, lisibles aussi sur une tuile blanche. */
const CONTOUR = `stroke="${METAL}" stroke-width="1"`;
const clair = (c: string) => [BLANC, CREME, ROSE_CLAIR, BLEU_CLAIR, METAL_CLAIR].includes(c);
const bord = (c: string) => (clair(c) ? ` ${CONTOUR}` : '');

// ---------- Gabarits (une forme, plusieurs couleurs) ----------

/** Tube souple en biais : colle, dentifrice, crème, gel. */
const tube = (corps: string, bouchon: string, bande: string) =>
  `<g transform="rotate(38 16 16)"><rect x="13.5" y="2" width="5" height="5" rx="1" fill="${bouchon}"/>` +
  `<path fill="${corps}"${bord(corps)} d="M12.2 7h7.6l2.2 3.6V26.5H10V10.6z"/>` +
  `<rect x="10.6" y="14" width="10.8" height="6.5" fill="${bande}"/>` +
  `<rect x="9.4" y="26" width="13.2" height="3.2" rx=".8" fill="${METAL_MOYEN}"/>` +
  `<path fill="${METAL_FONCE}" d="M11 26.6h1v2h-1zm2.3 0h1v2h-1zm2.2 0h1v2h-1zm2.3 0h1v2h-1zm2.2 0h1v2h-1z"/></g>`;

/** Bombe aérosol : déodorant, laque, dégrippant, peinture. */
const aerosol = (corps: string, bouchon: string, etiquette: string) =>
  `<rect x="13" y="2.5" width="4.5" height="3.5" rx="1" fill="${METAL}"/>` +
  `<circle cx="18.6" cy="4.2" r="1" fill="${ARDOISE}"/>` +
  `<path fill="${bouchon}" d="M11 6h10l1.2 4.8H9.8z"/>` +
  `<rect x="9" y="10.5" width="14" height="19" rx="3" fill="${corps}"/>` +
  `<rect x="9" y="15.5" width="14" height="8" fill="${etiquette}"/>` +
  `<path fill="#fff" fill-opacity=".35" d="M11 12.5h2v15h-2z"/>`;

/** Pulvérisateur à gâchette : nettoyants ménagers. */
const pulverisateur = (liquide: string, tete: string) =>
  `<path fill="${tete}" d="M9 3.5h11a3 3 0 0 1 3 3v.5h3.2a.8.8 0 0 1 .7 1.2l-1 1.8H9z"/>` +
  `<path fill="${METAL_FONCE}" d="m14.5 10 3 0-2.6 5.2h-2.4z"/>` +
  `<rect x="12" y="10" width="6" height="3.2" fill="${METAL}"/>` +
  `<path fill="${liquide}" d="M11 13h8c1.5 0 2.6 1 2.8 2.5L23 27a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 7 27l1.2-11.5C8.4 14 9.5 13 11 13z"/>` +
  `<rect x="9.5" y="18" width="11" height="7" rx="1.2" fill="#fff" fill-opacity=".75"/>` +
  `<rect x="11.5" y="20.4" width="7" height="1.4" rx=".7" fill="${liquide}"/>`;

/** Flacon en plastique : javel, adoucissant, gel WC, démaquillant. */
const flacon = (corps: string, bouchon: string) =>
  `<rect x="12" y="2.5" width="8" height="5" rx="1.2" fill="${bouchon}"/>` +
  `<path fill="${corps}"${bord(corps)} d="M12.5 7.5h7l1 2.4c2.6.9 4 2.5 4 5.1V27a2.5 2.5 0 0 1-2.5 2.5h-12A2.5 2.5 0 0 1 7.5 27V15c0-2.6 1.4-4.2 4-5.1z"/>` +
  `<rect x="10" y="16" width="12" height="8" rx="1.5" fill="#fff" fill-opacity=".85"/>` +
  `<rect x="12" y="18.4" width="8" height="1.6" rx=".8" fill="${bouchon}"/>` +
  `<rect x="12" y="21.1" width="5" height="1.2" rx=".6" fill="${METAL}"/>`;

/** Bidon à poignée : lessive, huile moteur. */
const bidon = (corps: string, bouchon: string) =>
  `<rect x="12" y="2.5" width="6" height="3.5" rx="1" fill="${bouchon}"/>` +
  `<path fill="${corps}" fill-rule="evenodd" d="M9.5 7H12V5.5h6V7h5.5A2.5 2.5 0 0 1 26 9.5V27a2.5 2.5 0 0 1-2.5 2.5h-14A2.5 2.5 0 0 1 7 27V9.5A2.5 2.5 0 0 1 9.5 7zm9.5 3v4h4.2v-4z"/>` +
  `<rect x="10" y="17" width="13" height="8.5" rx="1.5" fill="#fff" fill-opacity=".85"/>` +
  `<rect x="12" y="19.6" width="9" height="1.6" rx=".8" fill="${bouchon}"/>` +
  `<rect x="12" y="22.2" width="5" height="1.2" rx=".6" fill="${METAL}"/>`;

/** Bouteille en verre : huile, vinaigre. */
const bouteille = (liquide: string, bouchon: string) =>
  `<rect x="13.5" y="2" width="5" height="3.6" rx="1" fill="${bouchon}"/>` +
  `<path fill="${liquide}" d="M14 5.5h4v4.2c2.8 1.2 4.5 3.3 4.5 6.3V27a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 9.5 27V16c0-3 1.7-5.1 4.5-6.3z"/>` +
  `<rect x="9.5" y="18" width="13" height="6.5" fill="#FFF6E5"/>` +
  `<rect x="12" y="20.4" width="8" height="1.6" rx=".8" fill="${bouchon}"/>` +
  `<path fill="#fff" fill-opacity=".35" d="M11.5 11.5h1.6v5h-1.6z"/>`;

/** Bocal : confiture, moutarde, sauce, petits pots. */
const bocal = (contenu: string, couvercle: string) =>
  `<rect x="9" y="4" width="14" height="5" rx="1.5" fill="${couvercle}"/>` +
  `<path fill="#D3EDFF" d="M9.5 9h13l1.5 2.5V26a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V11.5z"/>` +
  `<path fill="${contenu}" d="M8 14h16v12a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z"/>` +
  `<rect x="10" y="17" width="12" height="7" rx="1" fill="${BLANC}"/>` +
  `<rect x="12" y="19.6" width="8" height="1.6" rx=".8" fill="${couvercle}"/>`;

/** Pot : yaourt, crème fraîche, compote. */
const pot = (corps: string, couvercle: string) =>
  `<rect x="6.5" y="7" width="19" height="3.6" rx="1.2" fill="${couvercle}"/>` +
  `<path fill="${corps}"${bord(corps)} d="M8 10.6h16l-1.9 16.8a2 2 0 0 1-2 1.8h-8.2a2 2 0 0 1-2-1.8z"/>` +
  `<path fill="${couvercle}" d="M9.2 15h13.6l-.6 5.2H9.8z"/>`;

/** Sachet souple : chips, farine, surgelés. */
const sachet = (couleur: string, fonce: string, motif: string) =>
  `<path fill="${fonce}" d="M8 3h16v3.6H8z"/>` +
  `<path fill="${fonce}" d="M8 3h2l-1 1.2 1 1.2-1 1.2H8zm16 0h-2l1 1.2-1 1.2 1 1.2h1z"/>` +
  `<path fill="${couleur}"${bord(couleur)} d="M8.3 6.6h15.4l-.7 3 1.6 17a2.2 2.2 0 0 1-2.2 2.4H9.6a2.2 2.2 0 0 1-2.2-2.4l1.6-17z"/>` +
  `<ellipse cx="16" cy="18.5" rx="5.6" ry="4.8" fill="${motif}"/>`;

/** Grand sac : ciment, enduit, terreau, litière. */
const sac = (couleur: string, bande: string, trait: string) =>
  `<path fill="${couleur}"${bord(couleur)} d="M8.6 4h14.8l1.6 3-1.3 2.8 1.8 16.8a2.4 2.4 0 0 1-2.4 2.6H8.9a2.4 2.4 0 0 1-2.4-2.6l1.8-16.8L7 7z"/>` +
  `<path fill="none" stroke="${trait}" stroke-width="1" stroke-dasharray="1.6 1.2" d="M8.4 7.4h15.2"/>` +
  `<rect x="9.5" y="13.5" width="13" height="9.5" rx="1.5" fill="${bande}"/>` +
  `<rect x="12" y="16.4" width="8" height="1.6" rx=".8" fill="${trait}"/>` +
  `<rect x="12" y="19.2" width="5" height="1.2" rx=".6" fill="${trait}" fill-opacity=".6"/>`;

/** Boîte à rouleau dentelé : aluminium, film, papier cuisson. */
const boiteRouleau = (boite: string, feuille: string) =>
  `<path fill="${feuille}"${bord(feuille)} d="M6 19h20l-1.6 9H7.6z"/>` +
  `<rect x="2.5" y="10" width="27" height="10" rx="1.6" fill="${boite}"/>` +
  `<rect x="2.5" y="10" width="27" height="3" rx="1.2" fill="#000" fill-opacity=".15"/>` +
  `<path fill="${METAL_FONCE}" d="M5 20h22l-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4-1-1.4-1 1.4z"/>`;

/** Rouleau d’adhésif : ruban de masquage, chatterton. */
const ruban = (bande: string, ombre: string, mandrin: string) =>
  `<path fill="${bande}" d="M24 16h4.2v13.6l-1.05-.9-1.05.9-1.05-.9-1.05.9z"/>` +
  `<path fill="${bande}" fill-rule="evenodd" d="M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/>` +
  `<circle cx="16" cy="16" r="10.8" fill="none" stroke="${ombre}" stroke-width="1.2"/>` +
  `<path fill="${mandrin}" fill-rule="evenodd" d="M16 10.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>`;

const cube = (x: number, y: number) =>
  `<path fill="#fff" stroke="${METAL}" stroke-width=".8" stroke-linejoin="round" d="M${x} ${y - 3.5}l6 3.5-6 3.5-6-3.5z"/>` +
  `<path fill="${METAL_CLAIR}" stroke="${METAL}" stroke-width=".8" stroke-linejoin="round" d="M${x - 6} ${y}l6 3.5v7l-6-3.5z"/>` +
  `<path fill="${METAL}" stroke="${METAL}" stroke-width=".8" stroke-linejoin="round" d="M${x + 6} ${y}l-6 3.5v7l6-3.5z"/>`;

// ---------- Illustrations ----------

export const ICONES_NID: Record<string, string> = {
  // Quincaillerie et outillage
  'nid-vis':
    `<path fill="${METAL_FONCE}" d="M7 5.5A2.5 2.5 0 0 1 9.5 3h13A2.5 2.5 0 0 1 25 5.5V8H7z"/>` +
    `<path fill="${METAL_MOYEN}" d="M7 8h18v1.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 7 9.5z"/>` +
    `<path fill="${ARDOISE}" d="M15 3h2v5h-2z"/>` +
    `<path fill="${METAL}" d="M12 11h8l-.6 13L16 30l-3.4-6z"/>` +
    `<path fill="${METAL_FONCE}" d="m12.05 13.6 7.9-1.7.06 2-7.9 1.7zm.16 4 7.6-1.65.07 2-7.6 1.65zm.17 4 7.27-1.55-.08 2-7.1 1.5zm.5 3.9 6-1.3-.6 2.2-4.6 1z"/>`,
  'nid-clou':
    `<rect x="7" y="3" width="18" height="4" rx="2" fill="${METAL_FONCE}"/>` +
    `<path fill="${METAL}" d="M14.2 7h3.6v17.5L16 30l-1.8-5.5z"/>` +
    `<path fill="${METAL_CLAIR}" d="M14.2 7h1.4v18.8l-1.4-1.3z"/>` +
    `<path fill="${METAL_MOYEN}" d="M14.2 7h3.6v1.6h-3.6z"/>`,
  'nid-cheville':
    `<rect x="9.5" y="3" width="13" height="4" rx="1.2" fill="${MIEL}"/>` +
    `<path fill="${JAUNE}" d="M11.5 7h9v15.5L16 30l-4.5-7.5z"/>` +
    `<path fill="${MIEL}" d="M15.3 7h1.4v21.5l-.7 1.5-.7-1.5z"/>` +
    `<path fill="${MIEL}" d="M11.5 10h3.8v1.6h-3.8zm5.2 0h3.8v1.6h-3.8zm-5.2 4h3.8v1.6h-3.8zm5.2 0h3.8v1.6h-3.8zm-5.2 4h3.8v1.6h-3.8zm5.2 0h3.8v1.6h-3.8z"/>`,
  'nid-colle': tube(JAUNE, ROUGE, BLANC),
  'nid-mastic':
    `<path fill="${METAL}" d="M14.7 1.5h2.6l1.2 8.5h-5z"/>` +
    `<rect x="10" y="9" width="12" height="2" rx="1" fill="${METAL_MOYEN}"/>` +
    `<rect x="10" y="10.5" width="12" height="17" fill="${BLANC}" ${CONTOUR}/>` +
    `<rect x="10" y="13.5" width="12" height="9" fill="${BLEU}"/>` +
    `<rect x="12" y="16.6" width="8" height="1.6" rx=".8" fill="${BLANC}"/>` +
    `<rect x="12" y="19.2" width="5" height="1.2" rx=".6" fill="${BLEU_CLAIR}"/>` +
    `<rect x="9.4" y="27" width="13.2" height="3" rx="1" fill="${METAL_MOYEN}"/>`,
  'nid-embout':
    `<g transform="rotate(40 16 16)"><path fill="${METAL}" d="M14.5 8.5 16 2.5l1.5 6z"/>` +
    `<path fill="${METAL_FONCE}" d="M15.6 3.5h.8v5h-.8z"/>` +
    `<rect x="14.5" y="8.5" width="3" height="6" fill="${METAL_MOYEN}"/>` +
    `<rect x="12.8" y="14.5" width="6.4" height="15" rx=".8" fill="${METAL_FONCE}"/>` +
    `<rect x="12.8" y="14.5" width="2.2" height="15" fill="${METAL_MOYEN}"/>` +
    `<rect x="12.8" y="21" width="6.4" height="1.6" fill="${ARDOISE}"/></g>`,
  'nid-foret':
    `<g transform="rotate(40 16 16)"><path fill="${METAL}" d="M14 6 16 1.5 18 6z"/>` +
    `<rect x="14" y="6" width="4" height="12" fill="${METAL_MOYEN}"/>` +
    `<path fill="${ARDOISE}" d="m14 8.6 4-2.1v1.7l-4 2.1zm0 3.6 4-2.1v1.7l-4 2.1zm0 3.6 4-2.1v1.7l-4 2.1z"/>` +
    `<rect x="14" y="18" width="4" height="12" rx=".6" fill="${METAL_FONCE}"/></g>`,
  'nid-perceuse':
    `<path fill="${ORANGE}" d="M10 16h7l-1.2 9h-5z"/>` +
    `<path fill="${ORANGE}" d="M4.5 11A4.5 4.5 0 0 1 9 6.5h11.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9A4.5 4.5 0 0 1 4.5 13z"/>` +
    `<rect x="7.5" y="9" width="11" height="2.2" rx="1.1" fill="${MIEL}"/>` +
    `<rect x="22.5" y="9" width="3.6" height="6" rx="1" fill="${ARDOISE}"/>` +
    `<rect x="26" y="11.1" width="4.5" height="1.8" rx=".9" fill="${METAL_MOYEN}"/>` +
    `<path fill="${NUIT}" d="M17 18h2.4a.9.9 0 0 1 .8 1.3l-.9 1.7H17z"/>` +
    `<rect x="7" y="24" width="12.5" height="5.5" rx="1.5" fill="${NUIT}"/>` +
    `<rect x="9" y="26" width="3" height="1.4" rx=".7" fill="${VERT}"/>`,
  'nid-pince':
    `<path fill="none" stroke="${METAL_MOYEN}" stroke-width="3" stroke-linecap="round" d="M15.1 13.5 13.6 3.8M16.9 13.5l1.5-9.7"/>` +
    `<path fill="none" stroke="${ROUGE}" stroke-width="3.4" stroke-linecap="round" d="M15 17.5 9.6 28.6M17 17.5l5.4 11.1"/>` +
    `<circle cx="16" cy="15.4" r="2.7" fill="${ARDOISE}"/>` +
    `<circle cx="16" cy="15.4" r="1" fill="${METAL}"/>`,
  'nid-niveau':
    `<rect x="2" y="11" width="28" height="10" rx="2" fill="${JAUNE}"/>` +
    `<path fill="${NUIT}" d="M2 13a2 2 0 0 1 2-2h1.6v10H4a2 2 0 0 1-2-2zm28 0a2 2 0 0 0-2-2h-1.6v10H28a2 2 0 0 0 2-2z"/>` +
    `<rect x="11" y="13" width="10" height="6" rx="3" fill="${VERT}"/>` +
    `<circle cx="17.4" cy="16" r="1.7" fill="#E8FFF2"/>` +
    `<path fill="${VERT_FONCE}" d="M13.8 13h.9v6h-.9zm3.6 0h.9v6h-.9z"/>`,
  'nid-spatule':
    `<path fill="${METAL}" d="M5.5 3.5h21L23.4 16H8.6z"/>` +
    `<path fill="${METAL_CLAIR}" d="M5.5 3.5h21l-.6 2.4H6.1z"/>` +
    `<rect x="12.6" y="15.5" width="6.8" height="3.2" rx=".6" fill="${METAL_FONCE}"/>` +
    `<rect x="13.3" y="18.5" width="5.4" height="11.5" rx="2.7" fill="${MIEL}"/>`,
  'nid-rouleau':
    `<path fill="none" stroke="${METAL_FONCE}" stroke-width="2" stroke-linejoin="round" d="M22.5 7.3H26V15H16v4.2"/>` +
    `<rect x="4" y="3" width="19" height="8.6" rx="2.5" fill="${BLEU}"/>` +
    `<rect x="5.5" y="4.4" width="16" height="2" rx="1" fill="${BLEU_CLAIR}"/>` +
    `<rect x="13.5" y="18.5" width="5" height="11.5" rx="2.5" fill="${ROUGE}"/>`,
  'nid-papier-verre':
    `<g transform="rotate(-10 16 16)"><rect x="6" y="5" width="20" height="22" rx="1.5" fill="${CARAMEL}"/>` +
    `<path fill="${SABLE}" d="M26 20.5V25.5A1.5 1.5 0 0 1 24.5 27H19.5z"/>` +
    `<g fill="${BOIS}"><circle cx="9.5" cy="8.5" r=".8"/><circle cx="14" cy="10" r=".8"/><circle cx="19" cy="8" r=".8"/><circle cx="23" cy="11" r=".8"/><circle cx="11" cy="13.5" r=".8"/><circle cx="16.5" cy="15" r=".8"/><circle cx="21.5" cy="15.5" r=".8"/><circle cx="9" cy="19" r=".8"/><circle cx="14" cy="20.5" r=".8"/><circle cx="18.5" cy="21" r=".8"/><circle cx="11.5" cy="24" r=".8"/></g></g>`,
  'nid-grille':
    `<rect x="3.5" y="3.5" width="25" height="25" rx="3.5" fill="${METAL}"/>` +
    `<rect x="7" y="7" width="18" height="18" rx="1.5" fill="${ARDOISE}"/>` +
    `<path fill="${METAL_CLAIR}" d="M7 9.6h18v2.2H7zm0 4.2h18V16H7zm0 4.2h18v2.2H7zm0 4.2h18v2.2H7z"/>` +
    `<g fill="${METAL_FONCE}"><circle cx="5.3" cy="5.3" r="1"/><circle cx="26.7" cy="5.3" r="1"/><circle cx="5.3" cy="26.7" r="1"/><circle cx="26.7" cy="26.7" r="1"/></g>`,
  'nid-grillage':
    `<rect x="4" y="5" width="24" height="21" fill="#E8FFF2"/>` +
    `<path fill="none" stroke="${VERT_FONCE}" stroke-width="1.3" d="M4 9l17 17M4 17l9 9M12 5l16 16M20 5l8 8M28 9 11 26M28 17l-9 9M20 5 4 21M12 5l-8 8"/>` +
    `<rect x="2.5" y="3" width="3" height="27" rx="1" fill="${BOIS}"/>` +
    `<rect x="26.5" y="3" width="3" height="27" rx="1" fill="${BOIS}"/>`,
  'nid-ruban': ruban(CREME, SABLE, CARAMEL),
  'nid-chatterton': ruban(NUIT, '#2B2350', METAL_FONCE),
  'nid-multiprise':
    `<path fill="none" stroke="${ARDOISE}" stroke-width="2" stroke-linecap="round" d="M3.5 18C1.5 18 1.5 27 6 27h7"/>` +
    `<rect x="3" y="11" width="26" height="10" rx="3" fill="${BLANC}" ${CONTOUR}/>` +
    `<g fill="${METAL_CLAIR}"><circle cx="9.5" cy="16" r="3"/><circle cx="17.5" cy="16" r="3"/></g>` +
    `<g fill="${ARDOISE}"><circle cx="8.4" cy="16" r=".75"/><circle cx="10.6" cy="16" r=".75"/><circle cx="16.4" cy="16" r=".75"/><circle cx="18.6" cy="16" r=".75"/></g>` +
    `<rect x="23" y="13.5" width="3.6" height="5" rx="1" fill="${ROUGE}"/>`,
  'nid-interrupteur':
    `<rect x="5" y="5" width="22" height="22" rx="4" fill="${BLANC}" ${CONTOUR}/>` +
    `<rect x="11" y="9" width="10" height="14" rx="2" fill="${METAL_CLAIR}"/>` +
    `<rect x="11" y="9" width="10" height="7" rx="2" fill="#fff" ${CONTOUR}/>` +
    `<circle cx="16" cy="19.5" r="1.1" fill="${VERT}"/>`,
  'nid-detecteur':
    `<circle cx="16" cy="16" r="12.5" fill="${BLANC}" ${CONTOUR}/>` +
    `<circle cx="16" cy="16" r="8" fill="${METAL_CLAIR}"/>` +
    `<path fill="none" stroke="${METAL_MOYEN}" stroke-width="1.6" stroke-linecap="round" d="M16 9.5v2.5M16 20v2.5M9.5 16H12M20 16h2.5M11.4 11.4l1.8 1.8M18.8 18.8l1.8 1.8M20.6 11.4l-1.8 1.8M13.2 18.8l-1.8 1.8"/>` +
    `<circle cx="16" cy="16" r="2.5" fill="${BLANC}"/>` +
    `<circle cx="24" cy="8.6" r="1.6" fill="${ROUGE}"/>`,
  'nid-joint':
    `<circle cx="16" cy="16" r="10" fill="none" stroke="${NUIT}" stroke-width="5"/>` +
    `<path fill="none" stroke="${ARDOISE}" stroke-width="1.4" stroke-linecap="round" d="M9.2 10.6a9.4 9.4 0 0 1 6.3-3.6"/>`,
  'nid-tuyau':
    `<circle cx="14.5" cy="14.5" r="10" fill="none" stroke="${VERT}" stroke-width="3.2"/>` +
    `<circle cx="14.5" cy="14.5" r="5.6" fill="none" stroke="${VERT_FONCE}" stroke-width="3.2"/>` +
    `<path fill="none" stroke="${VERT}" stroke-width="3.2" stroke-linecap="round" d="M24.5 14.5v9"/>` +
    `<rect x="22" y="22.5" width="5" height="7" rx="1.2" fill="${MIEL}"/>`,
  'nid-allumettes':
    `<path fill="none" stroke="${SABLE}" stroke-width="1.8" stroke-linecap="round" d="M11.5 17 15 5.5M17 17l1.6-11.2"/>` +
    `<ellipse cx="15.2" cy="4.8" rx="1.7" ry="2.3" transform="rotate(17 15.2 4.8)" fill="${ROUGE_FONCE}"/>` +
    `<ellipse cx="18.7" cy="5" rx="1.7" ry="2.3" transform="rotate(8 18.7 5)" fill="${ROUGE_FONCE}"/>` +
    `<rect x="4" y="15.5" width="24" height="13" rx="1.5" fill="${ROUGE}"/>` +
    `<rect x="4" y="15.5" width="24" height="3" fill="${ROUGE_FONCE}"/>` +
    `<rect x="8" y="21" width="16" height="4" rx="1" fill="${JAUNE}"/>`,
  'nid-pastilles':
    `<g transform="rotate(8 21 13)"><rect x="13.5" y="5.5" width="15" height="15" rx="2" fill="${BLANC}" ${CONTOUR}/>` +
    `<path fill="${VERT}" d="M13.5 13.5h15v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z"/></g>` +
    `<rect x="3.5" y="11.5" width="15" height="15" rx="2" fill="${BLANC}" ${CONTOUR}/>` +
    `<path fill="${BLEU}" d="M3.5 19.5h15v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z"/>` +
    `<circle cx="11" cy="19" r="3" fill="${ROUGE}"/>`,
  'nid-filtre':
    `<path fill="${CREME}" d="M4 7h24l-8.6 20.5h-6.8z"/>` +
    `<path fill="none" stroke="${SABLE}" stroke-width="1" d="M9 7.2l4.4 20M14 7.2l1.4 20M18 7.2l-1.4 20M23 7.2l-4.4 20"/>` +
    `<path fill="${SABLE}" d="M4 7h24v1.8H4z"/>`,
  'nid-sac-zip':
    `<path fill="#E6F4FF" stroke="${BLEU_CLAIR}" stroke-width="1.2" d="M6 7.5h20V26a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/>` +
    `<rect x="6" y="7" width="20" height="3" rx="1" fill="${BLEU}"/>` +
    `<rect x="9.5" y="14" width="10" height="6" rx="1" fill="#fff" ${CONTOUR}/>` +
    `<rect x="11" y="16.4" width="7" height="1.2" rx=".6" fill="${METAL_MOYEN}"/>`,

  // Ménage, cuisine
  'nid-javel': flacon(BLANC, BLEU),
  'nid-adoucissant': flacon(VIOLET, ROSE_MOYEN),
  'nid-gel-wc': flacon(BLEU, BLEU_FONCE),
  'nid-nettoyant': pulverisateur(VERT, METAL),
  'nid-vitres': pulverisateur(BLEU, METAL),
  'nid-anticalcaire': pulverisateur(ROSE_MOYEN, METAL),
  'nid-degraissant': pulverisateur(MIEL, METAL),
  'nid-lessive': bidon(BLEU, ORANGE),
  'nid-liquide-vaisselle': flacon(JAUNE, VERT),
  'nid-desodorisant': aerosol(VERT, BLANC, '#E8FFF2'),
  'nid-alu': boiteRouleau(ROUGE, METAL),
  'nid-film': boiteRouleau(BLEU, '#E6F4FF'),
  'nid-papier-cuisson': boiteRouleau(MIEL, CREME),

  // Bricolage en pots, sacs et bombes
  'nid-degrippant': aerosol(BLEU, JAUNE, JAUNE),
  'nid-bombe-peinture': aerosol(ROUGE, ROUGE_FONCE, BLANC),
  'nid-graisse-chaine': aerosol(NUIT, ROUGE, JAUNE),
  'nid-enduit': sac(BLANC, BLEU, BLEU_FONCE),
  'nid-ciment': sac(METAL, METAL_CLAIR, ARDOISE),
  'nid-terreau': sac(BRUN, VERT, VERT_FONCE),
  'nid-litiere': sac(VIOLET, BLANC, VIOLET),
  'nid-lave-glace': flacon(BLEU_CLAIR, BLEU),
  'nid-huile-moteur': bidon(JAUNE, NUIT),
  'nid-pneu':
    `<circle cx="16" cy="16" r="13" fill="${NUIT}"/>` +
    `<path fill="none" stroke="${ARDOISE}" stroke-width="2" stroke-dasharray="2.2 2.2" d="M16 4.6a11.4 11.4 0 1 1 0 22.8 11.4 11.4 0 0 1 0-22.8z"/>` +
    `<circle cx="16" cy="16" r="7" fill="${METAL}"/>` +
    `<circle cx="16" cy="16" r="5" fill="${METAL_MOYEN}"/>` +
    `<g fill="${METAL_CLAIR}"><circle cx="16" cy="12.6" r="1"/><circle cx="19.2" cy="15" r="1"/><circle cx="18" cy="18.8" r="1"/><circle cx="14" cy="18.8" r="1"/><circle cx="12.8" cy="15" r="1"/></g>` +
    `<circle cx="16" cy="16" r="1.6" fill="${ARDOISE}"/>`,
  'nid-pot-peinture':
    `<path fill="none" stroke="${METAL_FONCE}" stroke-width="1.4" d="M6.5 11C7 3.5 25 3.5 25.5 11"/>` +
    `<path fill="${METAL}" d="M6 9h20v17.5a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 6 26.5z"/>` +
    `<path fill="${BLEU}" d="M6 10.5h20v3.5a1.4 1.4 0 0 1-2.8 0v-1a1.2 1.2 0 0 0-2.4 0v3.5a1.6 1.6 0 0 1-3.2 0v-2a1.2 1.2 0 0 0-2.4 0v.5a1.5 1.5 0 0 1-3 0V13a1 1 0 0 0-2 0v1.2A1.1 1.1 0 0 1 6 14.6z"/>` +
    `<rect x="5" y="7.5" width="22" height="3.5" rx="1.5" fill="${METAL_FONCE}"/>` +
    `<rect x="9" y="19.5" width="14" height="6" rx="1" fill="${BLANC}"/>` +
    `<rect x="11" y="21.8" width="10" height="1.6" rx=".8" fill="${BLEU}"/>`,
  'nid-refroidissement': flacon(ROSE_MOYEN, NUIT),
  'nid-chlore': flacon(BLANC, BLEU_FONCE),

  // Hygiène et beauté
  'nid-dentifrice': tube(BLANC, BLEU, ROUGE),
  'nid-creme-mains': tube(ROSE_CLAIR, ROSE, BLANC),
  'nid-gel-coiffant': tube(BLEU, BLEU_FONCE, BLEU_CLAIR),
  'nid-creme-solaire': tube(MIEL, ROUGE, JAUNE),
  'nid-deodorant': aerosol(VIOLET, BLANC, ROSE_CLAIR),
  'nid-laque': aerosol(ROSE, BLANC, ROSE_CLAIR),
  'nid-mousse-raser': aerosol(BLEU, BLANC, BLANC),
  'nid-demaquillant': flacon(ROSE_CLAIR, ROSE),
  'nid-bain-bouche': flacon(VERT, BLANC),
  'nid-apres-shampoing': flacon(VIOLET, BLANC),
  'nid-gel-douche': flacon(BLEU, BLANC),
  'nid-mouchoirs':
    `<path fill="#fff" ${CONTOUR} d="M11 13.5c-.2-4.4 2-8.4 5.2-10 1.3 2.8 4 3.4 6 3-1.2 2-1.7 4.2-1.1 7z"/>` +
    `<rect x="4" y="12" width="24" height="16" rx="2" fill="${BLEU}"/>` +
    `<rect x="10" y="12" width="12" height="2.6" rx="1.3" fill="${BLEU_FONCE}"/>` +
    `<g fill="${BLEU_CLAIR}"><circle cx="9" cy="20" r="1.2"/><circle cx="16" cy="22" r="1.2"/><circle cx="23" cy="20" r="1.2"/></g>`,
  'nid-cotons':
    `<ellipse cx="16" cy="23" rx="11" ry="5" fill="${METAL_CLAIR}" ${CONTOUR}/>` +
    `<ellipse cx="16" cy="18.5" rx="11" ry="5" fill="#fff" ${CONTOUR}/>` +
    `<ellipse cx="16" cy="14" rx="11" ry="5" fill="#fff" ${CONTOUR}/>` +
    `<g fill="${METAL}"><circle cx="11" cy="13.5" r=".7"/><circle cx="16" cy="12" r=".7"/><circle cx="21" cy="14" r=".7"/><circle cx="14" cy="15.8" r=".7"/><circle cx="19" cy="16" r=".7"/></g>`,
  'nid-cotons-tiges':
    `<path fill="none" stroke="${BLEU}" stroke-width="2" stroke-linecap="round" d="M8 24 24 8"/>` +
    `<path fill="none" stroke="${ROSE_MOYEN}" stroke-width="2" stroke-linecap="round" d="M8 8l16 16"/>` +
    `<g fill="#fff" ${CONTOUR}><ellipse cx="6.3" cy="25.7" rx="2.6" ry="3.6" transform="rotate(45 6.3 25.7)"/><ellipse cx="25.7" cy="6.3" rx="2.6" ry="3.6" transform="rotate(45 25.7 6.3)"/><ellipse cx="6.3" cy="6.3" rx="2.6" ry="3.6" transform="rotate(-45 6.3 6.3)"/><ellipse cx="25.7" cy="25.7" rx="2.6" ry="3.6" transform="rotate(-45 25.7 25.7)"/></g>`,
  'nid-parfum':
    `<rect x="13" y="3.5" width="6" height="4.5" rx="1.2" fill="${JAUNE}"/>` +
    `<rect x="14.5" y="8" width="3" height="2.6" fill="${MIEL}"/>` +
    `<path fill="${ROSE_MOYEN}" d="M8.5 13.6a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3V26a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3z"/>` +
    `<path fill="${ROSE}" d="M8.5 19h15v7a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3z"/>` +
    `<path fill="#fff" fill-opacity=".45" d="M11 13h2v12h-2z"/>`,
  'nid-pot-creme':
    `<rect x="6" y="9" width="20" height="6" rx="2" fill="${ROSE}"/>` +
    `<path fill="#fff" ${CONTOUR} d="M7 15h18v9.5a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z"/>` +
    `<rect x="7.5" y="18.5" width="17" height="4" fill="${ROSE_CLAIR}"/>`,
  'nid-mascara':
    `<g transform="rotate(40 16 16)"><rect x="13.6" y="1.5" width="4.8" height="6.5" rx="2.4" fill="${NUIT}"/>` +
    `<path fill="none" stroke="${ARDOISE}" stroke-width=".8" d="M13.6 3.2h4.8M13.6 4.8h4.8M13.6 6.4h4.8"/>` +
    `<rect x="15.3" y="8" width="1.4" height="5.5" fill="${METAL_FONCE}"/>` +
    `<rect x="13" y="13.5" width="6" height="16" rx="1.5" fill="${NUIT}"/>` +
    `<rect x="13" y="13.5" width="6" height="2" fill="${JAUNE}"/></g>`,
  'nid-brosse-cheveux':
    `<path fill="${VIOLET}" d="M14 17.5h4l1 11.2a2 2 0 0 1-2 2.2h-2a2 2 0 0 1-2-2.2z"/>` +
    `<ellipse cx="16" cy="10.5" rx="8.5" ry="9" fill="${VIOLET}"/>` +
    `<ellipse cx="16" cy="10.5" rx="6.4" ry="6.9" fill="${METAL_CLAIR}"/>` +
    `<g fill="${NUIT}"><circle cx="13" cy="7" r=".9"/><circle cx="16" cy="6" r=".9"/><circle cx="19" cy="7" r=".9"/><circle cx="12" cy="10.5" r=".9"/><circle cx="16" cy="10" r=".9"/><circle cx="20" cy="10.5" r=".9"/><circle cx="13" cy="14" r=".9"/><circle cx="16" cy="14.8" r=".9"/><circle cx="19" cy="14" r=".9"/></g>`,
  'nid-serviette':
    `<path fill="${ROSE_CLAIR}" d="M9.5 12.5H5a2.5 2.5 0 0 0 0 7h4.5zm13 0H27a2.5 2.5 0 0 1 0 7h-4.5z"/>` +
    `<rect x="9" y="3" width="14" height="26" rx="7" fill="#fff" stroke="${ROSE_CLAIR}" stroke-width="1.2"/>` +
    `<rect x="12" y="8" width="8" height="16" rx="4" fill="${ROSE_CLAIR}"/>`,
  'nid-tampon':
    `<rect x="11.5" y="3" width="9" height="15" rx="4.5" fill="${ROSE_CLAIR}"/>` +
    `<path fill="none" stroke="${ROSE_MOYEN}" stroke-width="1" d="M13 8h6M12.6 11.5h6.8M13 15h6"/>` +
    `<rect x="13.2" y="17.5" width="5.6" height="6" rx="1" fill="${ROSE_MOYEN}"/>` +
    `<path fill="none" stroke="${BLEU}" stroke-width="1.6" stroke-linecap="round" d="M16 23.5v2c0 2-2 2.6-2 4.5"/>`,
  'nid-couche':
    `<path fill="#fff" ${CONTOUR} d="M4 9h24v2.5c0 7-4.6 12.2-8 14V28h-8v-2.5c-3.4-1.8-8-7-8-14z"/>` +
    `<rect x="4" y="8" width="24" height="4" rx="1.2" fill="${BLEU_CLAIR}"/>` +
    `<path fill="${BLEU}" d="M4 10h3.2v5.5H4zm20.8 0H28v5.5h-3.2z"/>` +
    `<g fill="${JAUNE}"><circle cx="12" cy="17" r="1.2"/><circle cx="20" cy="17" r="1.2"/><circle cx="16" cy="21" r="1.2"/></g>`,
  'nid-lingettes':
    `<rect x="3" y="11" width="26" height="15" rx="6" fill="${BLEU}"/>` +
    `<rect x="9" y="12.5" width="14" height="7" rx="3.5" fill="#fff" ${CONTOUR}/>` +
    `<path fill="#fff" ${CONTOUR} d="M12.5 15.5c.6-4.3 2.8-7 5-7.6.2 2 2 3 3.6 3-1.1 1.6-1.4 3-.9 4.6z"/>` +
    `<rect x="9" y="21.5" width="14" height="1.6" rx=".8" fill="${BLEU_CLAIR}"/>`,

  // Épicerie sans emoji
  'nid-courgette':
    `<g transform="rotate(-35 16 16)"><rect x="4" y="11.5" width="23" height="9" rx="4.5" fill="${VERT_FONCE}"/>` +
    `<path fill="none" stroke="${VERT}" stroke-width="1" stroke-linecap="round" d="M7 14h17M6.5 18h17"/>` +
    `<path fill="#86D72F" d="M26 13.5h3.5v5H26z"/>` +
    `<circle cx="5.5" cy="16" r="1.4" fill="#FCD53F"/></g>`,
  'nid-yaourt': pot(BLANC, ROSE_MOYEN),
  'nid-creme-fraiche': pot(BLANC, BLEU),
  'nid-compote': pot(BLANC, VERT),
  'nid-huile': bouteille(JAUNE, VERT_FONCE),
  'nid-vinaigre': bouteille(ROUGE_FONCE, NUIT),
  'nid-confiture': bocal(ROUGE_FONCE, '#F8312F'),
  'nid-moutarde': bocal(JAUNE, MIEL),
  'nid-mayonnaise': bocal(CREME, VERT),
  'nid-sauce-tomate': bocal(ROUGE, VERT_FONCE),
  'nid-petits-pots': bocal(ORANGE, BLEU_CLAIR),
  'nid-chips': sachet(JAUNE, ROUGE, ROUGE),
  'nid-farine': sachet(BLANC, CARAMEL, CREME),
  'nid-surgeles': sachet(BLEU, BLEU_FONCE, '#86D72F'),
  'nid-sucre': cube(10.5, 19) + cube(21.5, 19) + cube(16, 11.5),
  'nid-poivre':
    `<circle cx="16" cy="4.5" r="2" fill="${BRUN}"/>` +
    `<path fill="${BOIS}" d="M12 6.5h8l-1 6 2 3-1.5 12.5h-7L11 15.5l2-3z"/>` +
    `<path fill="${BRUN}" d="M11.6 15h8.8v1.6h-8.8z"/>` +
    `<rect x="11" y="27.5" width="10" height="2.5" rx="1" fill="${BRUN}"/>`,
};

/** Toutes les illustrations propres à Hometastic (nom, corps SVG), pour la galerie et les tests. */
export const NOMS_ICONES_NID = Object.keys(ICONES_NID);
