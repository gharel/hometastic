/** Catalogue de base des courses : nom, icône Fluent Emoji Flat (MIT) et rayon. */

export interface Produit {
  id: string;
  nom: string;
  /** Nom de l’icône Fluent Emoji Flat, ou `null` : pastille à initiales. */
  icone: string | null;
  rayon: string;
  synonymes: readonly string[];
}

export const RAYONS: readonly (readonly [string, string])[] = [
  ['fruits', 'Fruits et légumes'],
  ['boulangerie', 'Boulangerie'],
  ['cremerie', 'Crèmerie et œufs'],
  ['frais', 'Boucherie, poissonnerie'],
  ['sale', 'Épicerie salée'],
  ['sucre', 'Épicerie sucrée'],
  ['boissons', 'Boissons'],
  ['surgeles', 'Surgelés'],
  ['hygiene', 'Hygiène et beauté'],
  ['entretien', 'Entretien'],
  ['bebe', 'Bébé'],
  ['animaux', 'Animaux'],
  ['bricolage', 'Bricolage et maison'],
  ['pharmacie', 'Pharmacie'],
  ['divers', 'Divers'],
];

type Ligne = readonly [id: string, nom: string, icone: string | null, rayon: string, synonymes?: string];

const LIGNES: readonly Ligne[] = [
  ['pommes', 'Pommes', 'red-apple', 'fruits', 'pomme'],
  ['poires', 'Poires', 'pear', 'fruits', 'poire'],
  ['bananes', 'Bananes', 'banana', 'fruits', 'banane'],
  ['oranges', 'Oranges', 'tangerine', 'fruits', 'orange'],
  ['mandarines', 'Mandarines', 'tangerine', 'fruits', 'mandarine clementine clémentines'],
  ['citrons', 'Citrons', 'lemon', 'fruits', 'citron citron vert'],
  ['raisin', 'Raisin', 'grapes', 'fruits', 'raisins'],
  ['fraises', 'Fraises', 'strawberry', 'fruits', 'fraise'],
  ['cerises', 'Cerises', 'cherries', 'fruits', 'cerise'],
  ['peches', 'Pêches', 'peach', 'fruits', 'pêche nectarines'],
  ['kiwis', 'Kiwis', 'kiwi-fruit', 'fruits', 'kiwi'],
  ['mangues', 'Mangues', 'mango', 'fruits', 'mangue'],
  ['ananas', 'Ananas', 'pineapple', 'fruits'],
  ['pasteque', 'Pastèque', 'watermelon', 'fruits'],
  ['melon', 'Melon', 'melon', 'fruits'],
  ['coco', 'Noix de coco', 'coconut', 'fruits', 'coco'],
  ['myrtilles', 'Myrtilles', 'blueberries', 'fruits'],
  ['avocats', 'Avocats', 'avocado', 'fruits', 'avocat'],
  ['tomates', 'Tomates', 'tomato', 'fruits', 'tomate'],
  ['concombre', 'Concombre', 'cucumber', 'fruits', 'concombres'],
  ['courgettes', 'Courgettes', null, 'fruits', 'courgette'],
  ['salade', 'Salade', 'leafy-green', 'fruits', 'laitue'],
  ['brocolis', 'Brocolis', 'broccoli', 'fruits', 'brocoli'],
  ['carottes', 'Carottes', 'carrot', 'fruits', 'carotte'],
  ['pommes-de-terre', 'Pommes de terre', 'potato', 'fruits', 'patates'],
  ['patates-douces', 'Patates douces', 'roasted-sweet-potato', 'fruits', 'patate douce'],
  ['oignons', 'Oignons', 'onion', 'fruits', 'oignon'],
  ['ail', 'Ail', 'garlic', 'fruits'],
  ['champignons', 'Champignons', 'mushroom', 'fruits', 'champignon'],
  ['poivrons', 'Poivrons', 'bell-pepper', 'fruits', 'poivron'],
  ['piments', 'Piments', 'hot-pepper', 'fruits', 'piment'],
  ['aubergines', 'Aubergines', 'eggplant', 'fruits', 'aubergine'],
  ['mais', 'Maïs', 'ear-of-corn', 'fruits'],
  ['haricots', 'Haricots verts', null, 'fruits', 'haricots'],
  ['herbes', 'Herbes fraîches', 'herb', 'fruits', 'persil coriandre basilic menthe ciboulette'],
  ['olives', 'Olives', 'olive', 'fruits'],
  ['pain', 'Pain', 'bread', 'boulangerie'],
  ['baguette', 'Baguette', 'baguette-bread', 'boulangerie', 'baguettes'],
  ['croissants', 'Croissants', 'croissant', 'boulangerie', 'croissant viennoiseries'],
  ['pain-de-mie', 'Pain de mie', 'bread', 'boulangerie'],
  ['galettes', 'Galettes', 'flatbread', 'boulangerie', 'tortillas wraps'],
  ['gateau', 'Gâteau', 'shortcake', 'boulangerie', 'gateau'],
  ['lait', 'Lait', 'glass-of-milk', 'cremerie'],
  ['oeufs', 'Œufs', 'egg', 'cremerie', 'oeufs oeuf œuf'],
  ['beurre', 'Beurre', 'butter', 'cremerie'],
  ['fromage', 'Fromage', 'cheese-wedge', 'cremerie', 'fromages gruyère emmental'],
  ['yaourts', 'Yaourts', null, 'cremerie', 'yaourt yogourts'],
  ['creme', 'Crème fraîche', null, 'cremerie', 'crème'],
  ['poulet', 'Poulet', 'poultry-leg', 'frais', 'cuisses de poulet'],
  ['viande', 'Viande', 'cut-of-meat', 'frais', 'boeuf bœuf porc agneau'],
  ['steak-hache', 'Steaks hachés', 'hamburger', 'frais', 'steak haché'],
  ['jambon', 'Jambon', 'cut-of-meat', 'frais'],
  ['lardons', 'Lardons', 'bacon', 'frais', 'bacon'],
  ['saucisses', 'Saucisses', 'hot-dog', 'frais', 'saucisse'],
  ['poisson', 'Poisson', 'fish', 'frais', 'saumon thon frais'],
  ['crevettes', 'Crevettes', 'shrimp', 'frais', 'crevette'],
  ['crabe', 'Crabe', 'crab', 'frais'],
  ['huitres', 'Huîtres', 'oyster', 'frais', 'huitres'],
  ['pates', 'Pâtes', 'spaghetti', 'sale', 'pates spaghetti'],
  ['riz', 'Riz', 'cooked-rice', 'sale'],
  ['nouilles', 'Nouilles', 'steaming-bowl', 'sale', 'ramen'],
  ['farine', 'Farine', null, 'sale'],
  ['huile', 'Huile', null, 'sale', "huile d'olive"],
  ['vinaigre', 'Vinaigre', null, 'sale'],
  ['sel', 'Sel', 'salt', 'sale'],
  ['poivre', 'Poivre', null, 'sale'],
  ['conserves', 'Conserves', 'canned-food', 'sale', 'boîtes thon en boîte'],
  ['soupe', 'Soupe', 'pot-of-food', 'sale', 'bouillon'],
  ['cereales', 'Céréales', 'bowl-with-spoon', 'sale', 'cereales muesli flocons'],
  ['sauce-tomate', 'Sauce tomate', null, 'sale', 'coulis'],
  ['moutarde', 'Moutarde', null, 'sale'],
  ['mayonnaise', 'Mayonnaise', null, 'sale', 'mayo'],
  ['chips', 'Chips', null, 'sale'],
  ['cafe', 'Café', 'hot-beverage', 'sucre', 'cafe capsules'],
  ['the', 'Thé', 'teacup-without-handle', 'sucre', 'the infusion tisane'],
  ['chocolat', 'Chocolat', 'chocolate-bar', 'sucre'],
  ['biscuits', 'Biscuits', 'cookie', 'sucre', 'gâteaux secs'],
  ['bonbons', 'Bonbons', 'candy', 'sucre'],
  ['miel', 'Miel', 'honey-pot', 'sucre'],
  ['confiture', 'Confiture', null, 'sucre'],
  ['sucre', 'Sucre', null, 'sucre'],
  ['compotes', 'Compotes', null, 'sucre', 'compote'],
  ['pop-corn', 'Pop-corn', 'popcorn', 'sucre'],
  ['eau', 'Eau', 'droplet', 'boissons', 'bouteilles d’eau'],
  ['jus', 'Jus de fruits', 'beverage-box', 'boissons', 'jus'],
  ['soda', 'Soda', 'cup-with-straw', 'boissons', 'coca limonade'],
  ['biere', 'Bière', 'beer-mug', 'boissons', 'bieres bières'],
  ['vin', 'Vin', 'wine-glass', 'boissons'],
  ['champagne', 'Champagne', 'bottle-with-popping-cork', 'boissons'],
  ['sirop', 'Sirop', 'tropical-drink', 'boissons'],
  ['glace', 'Glace', 'ice-cream', 'surgeles', 'glaces'],
  ['frites', 'Frites', 'french-fries', 'surgeles'],
  ['pizza', 'Pizza', 'pizza', 'surgeles', 'pizzas'],
  ['legumes-surgeles', 'Légumes surgelés', null, 'surgeles'],
  ['glacons', 'Glaçons', 'ice', 'surgeles', 'glacons'],
  ['papier-toilette', 'Papier toilette', 'roll-of-paper', 'hygiene', 'pq'],
  ['dentifrice', 'Dentifrice', 'toothbrush', 'hygiene'],
  ['brosses-a-dents', 'Brosses à dents', 'toothbrush', 'hygiene', 'brosse à dents'],
  ['savon', 'Savon', 'soap', 'hygiene'],
  ['gel-douche', 'Gel douche', 'lotion-bottle', 'hygiene'],
  ['shampoing', 'Shampoing', 'lotion-bottle', 'hygiene', 'shampooing'],
  ['creme-solaire', 'Crème solaire', 'lotion-bottle', 'hygiene'],
  ['deodorant', 'Déodorant', null, 'hygiene', 'deodorant'],
  ['mouchoirs', 'Mouchoirs', null, 'hygiene'],
  ['coton', 'Coton', null, 'hygiene', 'cotons'],
  ['lessive', 'Lessive', 'bubbles', 'entretien'],
  ['liquide-vaisselle', 'Liquide vaisselle', 'bubbles', 'entretien', 'produit vaisselle'],
  ['eponges', 'Éponges', 'sponge', 'entretien', 'eponges éponge'],
  ['sacs-poubelle', 'Sacs poubelle', 'wastebasket', 'entretien'],
  ['essuie-tout', 'Essuie-tout', 'roll-of-paper', 'entretien', 'sopalin'],
  ['javel', 'Javel', null, 'entretien', 'eau de javel'],
  ['nettoyant', 'Nettoyant', null, 'entretien', 'produit ménager'],
  ['couches', 'Couches', null, 'bebe', 'couche'],
  ['lait-infantile', 'Lait infantile', 'baby-bottle', 'bebe', 'lait bébé'],
  ['lingettes', 'Lingettes', null, 'bebe'],
  ['biberons', 'Biberons', 'baby-bottle', 'bebe', 'biberon'],
  ['petits-pots', 'Petits pots', null, 'bebe'],
  ['croquettes-chien', 'Croquettes chien', 'dog-face', 'animaux', 'chien'],
  ['croquettes-chat', 'Croquettes chat', 'cat-face', 'animaux', 'chat'],
  ['litiere', 'Litière', null, 'animaux', 'litiere'],
  ['piles', 'Piles', 'battery', 'bricolage', 'pile'],
  ['ampoules', 'Ampoules', 'light-bulb', 'bricolage', 'ampoule'],
  ['bougies', 'Bougies', 'candle', 'bricolage', 'bougie'],
  ['lampe-torche', 'Lampe torche', 'flashlight', 'bricolage', 'lampe'],
  ['peinture', 'Peinture', 'paintbrush', 'bricolage'],
  ['medicaments', 'Médicaments', 'pill', 'pharmacie', 'medicaments doliprane paracétamol'],
  ['pansements', 'Pansements', 'adhesive-bandage', 'pharmacie', 'pansement'],
  ['thermometre', 'Thermomètre', 'thermometer', 'pharmacie'],
  ['anti-moustique', 'Anti-moustique', null, 'pharmacie', 'repulsif répulsif'],
  ['fleurs', 'Fleurs', 'bouquet', 'divers', 'bouquet'],
  ['plantes', 'Plantes', 'potted-plant', 'divers', 'plante'],
];

export const CATALOGUE: readonly Produit[] = LIGNES.map(([id, nom, icone, rayon, syn]) => ({
  id,
  nom,
  icone,
  rayon,
  synonymes: syn ? syn.split(/\s(?=\S)/) : [],
}));

const PAR_ID = new Map(CATALOGUE.map((p) => [p.id, p]));

export const produit = (id: string | undefined): Produit | undefined => (id ? PAR_ID.get(id) : undefined);

/** Minuscules, sans accents, « œ » en « oe », espaces simples. */
export function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[’']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const singulier = (mot: string) => mot.replace(/(s|x)$/, '');

/** Le produit correspondant exactement à un nom saisi (pluriel et accents tolérés). */
export function trouverProduit(nom: string): Produit | undefined {
  const cible = normaliser(nom);
  if (!cible) return undefined;
  return CATALOGUE.find((p) =>
    [p.nom, ...p.synonymes].some((n) => {
      const v = normaliser(n);
      return v === cible || singulier(v) === singulier(cible);
    }),
  );
}

/** Produits qui commencent par (puis contiennent) le texte saisi. */
export function chercherProduits(texte: string, limite = 8): Produit[] {
  const cible = normaliser(texte);
  if (!cible) return [];
  const debut: Produit[] = [];
  const dedans: Produit[] = [];
  for (const p of CATALOGUE) {
    const noms = [p.nom, ...p.synonymes].map(normaliser);
    if (noms.some((n) => n.startsWith(cible))) debut.push(p);
    else if (noms.some((n) => n.includes(cible))) dedans.push(p);
  }
  return [...debut, ...dedans].slice(0, limite);
}

/** « 2 l lait » → précision « 2 l », nom « lait » ; « lait x2 » → « x2 » ; « 3 bananes » → « x3 ». */
export function analyserArticle(saisie: string): { nom: string; precision?: string | undefined } {
  let reste = saisie.trim().replace(/\s+/g, ' ');
  let precision: string | undefined;
  const debut = /^(\d+(?:[.,]\d+)?)\s*(kg|g|l|cl|ml|x)?\s+(.+)$/i.exec(reste);
  if (debut) {
    const [, q = '', unite, nom = ''] = debut;
    precision = unite && unite.toLowerCase() !== 'x' ? `${q} ${unite.toLowerCase()}` : `x${q}`;
    reste = nom;
  } else {
    const fin = /^(.+?)\s*x\s?(\d+)$/i.exec(reste);
    if (fin) {
      const [, nom = '', q = ''] = fin;
      precision = `x${q}`;
      reste = nom;
    }
  }
  const nom = reste.charAt(0).toUpperCase() + reste.slice(1);
  return { nom, precision };
}

/** Rayon d’un article : celui du produit, sinon « Divers ». */
export const rayonDe = (produitId: string | undefined): string => produit(produitId)?.rayon ?? 'divers';

/** Initiales d’un article sans icône (« Yaourts » → « Ya »). */
export const initiales = (nom: string): string => nom.trim().slice(0, 2) || '?';
