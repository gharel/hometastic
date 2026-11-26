/**
 * Catalogue de base des courses : nom, illustration et rayon.
 * Illustrations Fluent Emoji Flat (Microsoft, MIT) ou propres à Hometastic (préfixe « nid- »,
 * `src/icones/nid.ts`) pour les objets sans emoji.
 */

export interface Produit {
  id: string;
  nom: string;
  /** Nom de l’illustration, ou `null` : pastille à initiales. */
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
  ['entretien', 'Entretien et ménage'],
  ['bebe', 'Bébé'],
  ['animaux', 'Animaux'],
  ['bricolage', 'Bricolage et maison'],
  ['jardin', 'Jardin et piscine'],
  ['auto', 'Auto et moto'],
  ['pharmacie', 'Pharmacie'],
  ['divers', 'Divers'],
];

/** id, nom, illustration, rayon, synonymes séparés par des virgules. */
type Ligne = readonly [id: string, nom: string, icone: string | null, rayon: string, synonymes?: string];

const LIGNES: readonly Ligne[] = [
  // Fruits et légumes
  ['pommes', 'Pommes', 'red-apple', 'fruits', 'pomme'],
  ['poires', 'Poires', 'pear', 'fruits', 'poire'],
  ['bananes', 'Bananes', 'banana', 'fruits', 'banane'],
  ['oranges', 'Oranges', 'tangerine', 'fruits', 'orange'],
  ['mandarines', 'Mandarines', 'tangerine', 'fruits', 'mandarine, clémentines, clémentine'],
  ['citrons', 'Citrons', 'lemon', 'fruits', 'citron, citron vert, citrons verts'],
  ['raisin', 'Raisin', 'grapes', 'fruits', 'raisins'],
  ['fraises', 'Fraises', 'strawberry', 'fruits', 'fraise'],
  ['cerises', 'Cerises', 'cherries', 'fruits', 'cerise'],
  ['peches', 'Pêches', 'peach', 'fruits', 'pêche, nectarines, nectarine'],
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
  ['courgettes', 'Courgettes', 'nid-courgette', 'fruits', 'courgette'],
  ['salade', 'Salade', 'leafy-green', 'fruits', 'laitue'],
  ['brocolis', 'Brocolis', 'broccoli', 'fruits', 'brocoli'],
  ['carottes', 'Carottes', 'carrot', 'fruits', 'carotte'],
  ['pommes-de-terre', 'Pommes de terre', 'potato', 'fruits', 'patates, patate'],
  ['patates-douces', 'Patates douces', 'roasted-sweet-potato', 'fruits', 'patate douce'],
  ['oignons', 'Oignons', 'onion', 'fruits', 'oignon'],
  ['ail', 'Ail', 'garlic', 'fruits'],
  ['gingembre', 'Gingembre', 'ginger-root', 'fruits'],
  ['champignons', 'Champignons', 'mushroom', 'fruits', 'champignon'],
  ['poivrons', 'Poivrons', 'bell-pepper', 'fruits', 'poivron'],
  ['piments', 'Piments', 'hot-pepper', 'fruits', 'piment'],
  ['aubergines', 'Aubergines', 'eggplant', 'fruits', 'aubergine'],
  ['mais', 'Maïs', 'ear-of-corn', 'fruits'],
  ['haricots', 'Haricots verts', 'pea-pod', 'fruits', 'haricots, petits pois'],
  ['herbes', 'Herbes fraîches', 'herb', 'fruits', 'persil, coriandre, basilic, menthe, ciboulette'],
  ['olives', 'Olives', 'olive', 'fruits'],

  // Boulangerie
  ['pain', 'Pain', 'bread', 'boulangerie'],
  ['baguette', 'Baguette', 'baguette-bread', 'boulangerie', 'baguettes'],
  ['croissants', 'Croissants', 'croissant', 'boulangerie', 'croissant, viennoiseries'],
  ['pain-de-mie', 'Pain de mie', 'bread', 'boulangerie'],
  ['galettes', 'Galettes', 'flatbread', 'boulangerie', 'tortillas, wraps'],
  ['gateau', 'Gâteau', 'shortcake', 'boulangerie'],

  // Crèmerie et œufs
  ['lait', 'Lait', 'glass-of-milk', 'cremerie'],
  ['oeufs', 'Œufs', 'egg', 'cremerie', 'oeufs, oeuf, œuf'],
  ['beurre', 'Beurre', 'butter', 'cremerie'],
  ['fromage', 'Fromage', 'cheese-wedge', 'cremerie', 'fromages, gruyère, emmental'],
  ['yaourts', 'Yaourts', 'nid-yaourt', 'cremerie', 'yaourt, yogourts'],
  ['creme', 'Crème fraîche', 'nid-creme-fraiche', 'cremerie', 'crème'],

  // Boucherie, poissonnerie
  ['poulet', 'Poulet', 'poultry-leg', 'frais', 'cuisses de poulet'],
  ['viande', 'Viande', 'cut-of-meat', 'frais', 'bœuf, boeuf, porc, agneau'],
  ['steak-hache', 'Steaks hachés', 'hamburger', 'frais', 'steak haché'],
  ['jambon', 'Jambon', 'cut-of-meat', 'frais'],
  ['lardons', 'Lardons', 'bacon', 'frais', 'bacon'],
  ['saucisses', 'Saucisses', 'hot-dog', 'frais', 'saucisse'],
  ['poisson', 'Poisson', 'fish', 'frais', 'saumon, thon frais'],
  ['crevettes', 'Crevettes', 'shrimp', 'frais', 'crevette'],
  ['crabe', 'Crabe', 'crab', 'frais'],
  ['huitres', 'Huîtres', 'oyster', 'frais', 'huitres'],

  // Épicerie salée
  ['pates', 'Pâtes', 'spaghetti', 'sale', 'pates, spaghetti'],
  ['riz', 'Riz', 'cooked-rice', 'sale'],
  ['nouilles', 'Nouilles', 'steaming-bowl', 'sale', 'ramen'],
  ['lentilles', 'Lentilles', 'beans', 'sale', 'haricots secs, pois chiches'],
  ['farine', 'Farine', 'nid-farine', 'sale'],
  ['huile', 'Huile', 'nid-huile', 'sale', 'huile d’olive, huile de tournesol'],
  ['vinaigre', 'Vinaigre', 'nid-vinaigre', 'sale'],
  ['sel', 'Sel', 'salt', 'sale'],
  ['poivre', 'Poivre', 'nid-poivre', 'sale'],
  ['conserves', 'Conserves', 'canned-food', 'sale', 'boîtes de conserve, thon en boîte'],
  ['soupe', 'Soupe', 'pot-of-food', 'sale', 'bouillon'],
  ['cereales', 'Céréales', 'bowl-with-spoon', 'sale', 'cereales, muesli, flocons d’avoine'],
  ['sauce-tomate', 'Sauce tomate', 'nid-sauce-tomate', 'sale', 'coulis'],
  ['moutarde', 'Moutarde', 'nid-moutarde', 'sale'],
  ['mayonnaise', 'Mayonnaise', 'nid-mayonnaise', 'sale', 'mayo'],
  ['chips', 'Chips', 'nid-chips', 'sale'],

  // Épicerie sucrée
  ['cafe', 'Café', 'hot-beverage', 'sucre', 'cafe, capsules'],
  ['filtres-cafe', 'Filtres à café', 'nid-filtre', 'sucre', 'filtres, filtre à café'],
  ['the', 'Thé', 'teacup-without-handle', 'sucre', 'the, infusion, tisane'],
  ['chocolat', 'Chocolat', 'chocolate-bar', 'sucre'],
  ['biscuits', 'Biscuits', 'cookie', 'sucre', 'gâteaux secs'],
  ['bonbons', 'Bonbons', 'candy', 'sucre'],
  ['miel', 'Miel', 'honey-pot', 'sucre'],
  ['confiture', 'Confiture', 'nid-confiture', 'sucre'],
  ['sucre', 'Sucre', 'nid-sucre', 'sucre'],
  ['compotes', 'Compotes', 'nid-compote', 'sucre', 'compote'],
  ['pop-corn', 'Pop-corn', 'popcorn', 'sucre'],

  // Boissons
  ['eau', 'Eau', 'droplet', 'boissons', 'bouteilles d’eau'],
  ['jus', 'Jus de fruits', 'beverage-box', 'boissons', 'jus'],
  ['soda', 'Soda', 'cup-with-straw', 'boissons', 'coca, limonade'],
  ['biere', 'Bière', 'beer-mug', 'boissons', 'bieres, bières'],
  ['vin', 'Vin', 'wine-glass', 'boissons'],
  ['champagne', 'Champagne', 'bottle-with-popping-cork', 'boissons'],
  ['sirop', 'Sirop', 'tropical-drink', 'boissons'],

  // Surgelés
  ['glace', 'Glace', 'ice-cream', 'surgeles', 'glaces'],
  ['frites', 'Frites', 'french-fries', 'surgeles'],
  ['pizza', 'Pizza', 'pizza', 'surgeles', 'pizzas'],
  ['legumes-surgeles', 'Légumes surgelés', 'nid-surgeles', 'surgeles', 'poêlée'],
  ['glacons', 'Glaçons', 'ice', 'surgeles', 'glacons'],

  // Hygiène et beauté
  ['papier-toilette', 'Papier toilette', 'roll-of-paper', 'hygiene', 'pq, papier wc'],
  ['dentifrice', 'Dentifrice', 'nid-dentifrice', 'hygiene'],
  ['brosses-a-dents', 'Brosses à dents', 'toothbrush', 'hygiene', 'brosse à dents'],
  ['fil-dentaire', 'Fil dentaire', 'tooth', 'hygiene'],
  ['bain-de-bouche', 'Bain de bouche', 'nid-bain-bouche', 'hygiene'],
  ['savon', 'Savon', 'soap', 'hygiene', 'savon liquide'],
  ['gel-douche', 'Gel douche', 'nid-gel-douche', 'hygiene'],
  ['shampoing', 'Shampoing', 'lotion-bottle', 'hygiene', 'shampooing'],
  [
    'apres-shampoing',
    'Après-shampoing',
    'nid-apres-shampoing',
    'hygiene',
    'après-shampooing, masque cheveux',
  ],
  ['deodorant', 'Déodorant', 'nid-deodorant', 'hygiene', 'deodorant, déo, deo'],
  ['rasoirs', 'Rasoirs', 'razor', 'hygiene', 'rasoir, lames de rasoir'],
  ['mousse-a-raser', 'Mousse à raser', 'nid-mousse-raser', 'hygiene', 'gel à raser'],
  ['creme-hydratante', 'Crème hydratante', 'nid-pot-creme', 'hygiene', 'crème visage, crème de jour'],
  ['creme-mains', 'Crème pour les mains', 'nid-creme-mains', 'hygiene', 'crème mains'],
  ['lait-corps', 'Lait pour le corps', 'lotion-bottle', 'hygiene', 'lait corporel'],
  ['creme-solaire', 'Crème solaire', 'nid-creme-solaire', 'hygiene', 'écran total, protection solaire'],
  ['mouchoirs', 'Mouchoirs', 'nid-mouchoirs', 'hygiene', 'mouchoirs en papier, kleenex'],
  ['coton', 'Cotons', 'nid-cotons', 'hygiene', 'coton, cotons démaquillants'],
  ['cotons-tiges', 'Cotons-tiges', 'nid-cotons-tiges', 'hygiene', 'coton-tige, cotons-tige'],
  ['demaquillant', 'Démaquillant', 'nid-demaquillant', 'hygiene', 'eau micellaire, dissolvant'],
  ['maquillage', 'Maquillage', 'lipstick', 'hygiene', 'rouge à lèvres, fond de teint'],
  ['mascara', 'Mascara', 'nid-mascara', 'hygiene'],
  ['vernis', 'Vernis', 'nail-polish', 'hygiene', 'vernis à ongles'],
  ['parfum', 'Parfum', 'nid-parfum', 'hygiene', 'eau de toilette, eau de parfum'],
  ['peigne', 'Peigne', 'hair-pick', 'hygiene'],
  ['brosse-cheveux', 'Brosse à cheveux', 'nid-brosse-cheveux', 'hygiene'],
  ['gel-coiffant', 'Gel coiffant', 'nid-gel-coiffant', 'hygiene', 'gel cheveux, cire'],
  ['laque', 'Laque', 'nid-laque', 'hygiene', 'spray coiffant'],
  ['coupe-ongles', 'Ciseaux à ongles', 'scissors', 'hygiene', 'coupe-ongles, lime à ongles'],
  ['serviettes-hygieniques', 'Serviettes hygiéniques', 'nid-serviette', 'hygiene', 'protège-slips'],
  ['tampons', 'Tampons', 'nid-tampon', 'hygiene', 'tampon'],

  // Entretien et ménage
  ['lessive', 'Lessive', 'nid-lessive', 'entretien', 'lessive liquide'],
  ['adoucissant', 'Adoucissant', 'nid-adoucissant', 'entretien'],
  ['liquide-vaisselle', 'Liquide vaisselle', 'nid-liquide-vaisselle', 'entretien', 'produit vaisselle'],
  [
    'pastilles-lave-vaisselle',
    'Pastilles lave-vaisselle',
    'nid-pastilles',
    'entretien',
    'tablettes lave-vaisselle, capsules lave-vaisselle',
  ],
  ['sel-lave-vaisselle', 'Sel lave-vaisselle', 'salt', 'entretien'],
  ['eponges', 'Éponges', 'sponge', 'entretien', 'éponge, eponges'],
  ['sacs-poubelle', 'Sacs poubelle', 'wastebasket', 'entretien', 'sac poubelle'],
  ['essuie-tout', 'Essuie-tout', 'roll-of-paper', 'entretien', 'sopalin'],
  ['javel', 'Javel', 'nid-javel', 'entretien', 'eau de javel'],
  ['nettoyant', 'Nettoyant', 'nid-nettoyant', 'entretien', 'produit ménager, nettoyant multi-usage'],
  ['produit-vitres', 'Produit vitres', 'nid-vitres', 'entretien', 'nettoyant vitres, lave-vitres'],
  ['anticalcaire', 'Anticalcaire', 'nid-anticalcaire', 'entretien', 'détartrant, vinaigre ménager'],
  ['degraissant', 'Dégraissant', 'nid-degraissant', 'entretien', 'dégraissant cuisine'],
  ['gel-wc', 'Gel WC', 'nid-gel-wc', 'entretien', 'nettoyant wc, bloc wc'],
  ['desodorisant', 'Désodorisant', 'nid-desodorisant', 'entretien', 'parfum d’intérieur'],
  ['balai', 'Balai', 'broom', 'entretien', 'balayette'],
  ['serpilliere', 'Serpillière', 'bucket', 'entretien', 'serpilliere, seau'],
  ['gants-menage', 'Gants de ménage', 'gloves', 'entretien'],
  ['alu', 'Papier alu', 'nid-alu', 'entretien', 'papier aluminium, aluminium'],
  ['film', 'Film alimentaire', 'nid-film', 'entretien', 'film étirable'],
  ['papier-cuisson', 'Papier cuisson', 'nid-papier-cuisson', 'entretien', 'papier sulfurisé'],
  ['sacs-congelation', 'Sacs congélation', 'nid-sac-zip', 'entretien', 'sachets congélation, sacs zip'],
  ['allumettes', 'Allumettes', 'nid-allumettes', 'entretien', 'allume-feu, briquet'],
  ['insecticide', 'Insecticide', 'cockroach', 'entretien', 'anti-cafards, anti-fourmis'],
  ['tapette-souris', 'Piège à souris', 'mouse-trap', 'entretien', 'tapette, raticide'],

  // Bébé
  ['couches', 'Couches', 'nid-couche', 'bebe', 'couche'],
  ['lait-infantile', 'Lait infantile', 'baby-bottle', 'bebe', 'lait bébé'],
  ['lingettes', 'Lingettes', 'nid-lingettes', 'bebe', 'lingette'],
  ['biberons', 'Biberons', 'baby-bottle', 'bebe', 'biberon'],
  ['petits-pots', 'Petits pots', 'nid-petits-pots', 'bebe'],

  // Animaux
  ['croquettes-chien', 'Croquettes chien', 'dog-face', 'animaux', 'chien'],
  ['croquettes-chat', 'Croquettes chat', 'cat-face', 'animaux', 'chat'],
  ['litiere', 'Litière', 'nid-litiere', 'animaux', 'litiere'],

  // Bricolage et maison
  ['vis', 'Vis', 'nid-vis', 'bricolage', 'visserie, vis à bois'],
  ['clous', 'Clous', 'nid-clou', 'bricolage', 'clou, pointes'],
  ['chevilles', 'Chevilles', 'nid-cheville', 'bricolage', 'cheville'],
  ['boulons', 'Boulons et écrous', 'nut-and-bolt', 'bricolage', 'boulon, écrous, écrou, rondelles'],
  ['colle', 'Colle', 'nid-colle', 'bricolage', 'colle forte, colle à bois, super glue'],
  ['mastic', 'Mastic', 'nid-mastic', 'bricolage', 'silicone, joint silicone, cartouche de mastic, acrylique'],
  ['enduit', 'Enduit', 'nid-enduit', 'bricolage', 'enduit de rebouchage, plâtre'],
  ['ciment', 'Ciment', 'nid-ciment', 'bricolage', 'mortier, béton'],
  ['bois', 'Bois', 'wood', 'bricolage', 'planche, planches, tasseau, tasseaux, contreplaqué'],
  ['briques', 'Briques', 'brick', 'bricolage', 'brique, parpaing, parpaings'],
  ['embouts', 'Embouts', 'nid-embout', 'bricolage', 'embout, embouts de vissage'],
  ['forets', 'Forets', 'nid-foret', 'bricolage', 'foret, mèche, mèches'],
  ['perceuse', 'Perceuse', 'nid-perceuse', 'bricolage', 'visseuse, perceuse-visseuse'],
  ['tournevis', 'Tournevis', 'screwdriver', 'bricolage'],
  ['marteau', 'Marteau', 'hammer', 'bricolage'],
  ['cle-molette', 'Clé à molette', 'wrench', 'bricolage', 'clé plate, clés plates'],
  ['scie', 'Scie', 'carpentry-saw', 'bricolage', 'scie égoïne'],
  ['pince', 'Pince', 'nid-pince', 'bricolage', 'pinces, pince coupante'],
  ['metre', 'Mètre', 'straight-ruler', 'bricolage', 'mètre ruban, règle'],
  ['equerre', 'Équerre', 'triangular-ruler', 'bricolage', 'equerre'],
  ['niveau', 'Niveau', 'nid-niveau', 'bricolage', 'niveau à bulle'],
  ['serre-joints', 'Serre-joints', 'clamp', 'bricolage', 'serre-joint'],
  ['papier-de-verre', 'Papier de verre', 'nid-papier-verre', 'bricolage', 'papier abrasif, ponçage'],
  ['spatule', 'Couteau à enduire', 'nid-spatule', 'bricolage', 'spatule'],
  ['grille', 'Grille', 'nid-grille', 'bricolage', 'grille de ventilation, grille d’aération, aération'],
  ['grillage', 'Grillage', 'nid-grillage', 'bricolage', 'clôture'],
  ['ruban-adhesif', 'Ruban adhésif', 'nid-ruban', 'bricolage', 'scotch, ruban de masquage, adhésif'],
  ['chatterton', 'Chatterton', 'nid-chatterton', 'bricolage', 'ruban isolant, ruban électricien'],
  ['peinture', 'Peinture', 'nid-pot-peinture', 'bricolage', 'pot de peinture'],
  ['pinceaux', 'Pinceaux', 'paintbrush', 'bricolage', 'pinceau'],
  ['rouleau-peinture', 'Rouleau de peinture', 'nid-rouleau', 'bricolage', 'rouleau'],
  ['bombe-peinture', 'Bombe de peinture', 'nid-bombe-peinture', 'bricolage', 'peinture en bombe, aérosol'],
  ['degrippant', 'Dégrippant', 'nid-degrippant', 'bricolage', 'wd-40, wd40, lubrifiant'],
  ['crochets', 'Crochets', 'hook', 'bricolage', 'crochet, patère'],
  ['chaine', 'Chaîne', 'chains', 'bricolage', 'chaine'],
  ['cadenas', 'Cadenas', 'locked', 'bricolage', 'serrure'],
  ['cles', 'Double de clés', 'key', 'bricolage', 'clés, clé'],
  ['multiprise', 'Multiprise', 'nid-multiprise', 'bricolage', 'rallonge, prise multiple'],
  ['prises', 'Prise électrique', 'electric-plug', 'bricolage', 'prise, adaptateur'],
  ['interrupteur', 'Interrupteur', 'nid-interrupteur', 'bricolage'],
  ['detecteur', 'Détecteur de fumée', 'nid-detecteur', 'bricolage', 'détecteur'],
  ['joints', 'Joints', 'nid-joint', 'bricolage', 'joint, joints de robinet'],
  ['deboucheur', 'Déboucheur', 'plunger', 'bricolage', 'ventouse'],
  ['escabeau', 'Escabeau', 'ladder', 'bricolage', 'échelle'],
  ['gants-travail', 'Gants de travail', 'gloves', 'bricolage', 'gants de bricolage, gants de jardinage'],
  ['lunettes-protection', 'Lunettes de protection', 'goggles', 'bricolage'],
  ['boite-outils', 'Boîte à outils', 'toolbox', 'bricolage', 'caisse à outils'],
  ['extincteur', 'Extincteur', 'fire-extinguisher', 'bricolage'],
  ['cartons', 'Cartons', 'package', 'bricolage', 'carton, cartons de déménagement'],
  ['piles', 'Piles', 'battery', 'bricolage', 'pile'],
  ['ampoules', 'Ampoules', 'light-bulb', 'bricolage', 'ampoule'],
  ['bougies', 'Bougies', 'candle', 'bricolage', 'bougie'],
  ['lampe-torche', 'Lampe torche', 'flashlight', 'bricolage', 'lampe'],

  // Jardin et piscine
  ['terreau', 'Terreau', 'nid-terreau', 'jardin', 'substrat'],
  ['graines', 'Graines', 'seedling', 'jardin', 'semences'],
  ['plantes', 'Plantes', 'potted-plant', 'jardin', 'plante'],
  ['tuyau-arrosage', 'Tuyau d’arrosage', 'nid-tuyau', 'jardin', 'tuyau, arrosage'],
  ['charbon', 'Charbon de bois', 'fire', 'jardin', 'charbon, barbecue'],
  ['chlore', 'Chlore', 'nid-chlore', 'jardin', 'chlore piscine, galets de chlore'],

  // Auto et moto
  ['huile-moteur', 'Huile moteur', 'nid-huile-moteur', 'auto', 'vidange'],
  ['lave-glace', 'Lave-glace', 'nid-lave-glace', 'auto', 'liquide lave-glace'],
  ['liquide-refroidissement', 'Liquide de refroidissement', 'nid-refroidissement', 'auto'],
  ['graisse-chaine', 'Graisse chaîne', 'nid-graisse-chaine', 'auto', 'graisse, lubrifiant chaîne'],
  ['pneus', 'Pneus', 'nid-pneu', 'auto', 'pneu'],
  ['essence', 'Essence', 'fuel-pump', 'auto', 'carburant, plein'],

  // Pharmacie
  ['medicaments', 'Médicaments', 'pill', 'pharmacie', 'medicaments, doliprane, paracétamol'],
  ['pansements', 'Pansements', 'adhesive-bandage', 'pharmacie', 'pansement'],
  ['thermometre', 'Thermomètre', 'thermometer', 'pharmacie'],
  ['anti-moustique', 'Anti-moustique', 'mosquito', 'pharmacie', 'répulsif, repulsif'],
  ['gel-hydroalcoolique', 'Gel hydroalcoolique', 'lotion-bottle', 'pharmacie', 'gel désinfectant'],
  ['masques', 'Masques', 'face-with-medical-mask', 'pharmacie', 'masque'],

  // Divers
  ['fleurs', 'Fleurs', 'bouquet', 'divers', 'bouquet'],
];

export const CATALOGUE: readonly Produit[] = LIGNES.map(([id, nom, icone, rayon, syn]) => ({
  id,
  nom,
  icone,
  rayon,
  synonymes: syn ? syn.split(/\s*,\s*/) : [],
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

/** Produits dont un nom (ou un de ses mots) commence par le texte saisi, puis ceux qui le contiennent. */
export function chercherProduits(texte: string, limite = 8): Produit[] {
  const cible = normaliser(texte);
  if (!cible) return [];
  const debut: Produit[] = [];
  const mot: Produit[] = [];
  const dedans: Produit[] = [];
  for (const p of CATALOGUE) {
    const noms = [p.nom, ...p.synonymes].map(normaliser);
    if (noms.some((n) => n.startsWith(cible))) debut.push(p);
    else if (noms.some((n) => n.split(' ').some((m) => m.startsWith(cible)))) mot.push(p);
    else if (noms.some((n) => n.includes(cible))) dedans.push(p);
  }
  return [...debut, ...mot, ...dedans].slice(0, limite);
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

/** Ce qui décide de l’illustration et du rayon d’un article : choix explicite, sinon le produit. */
export interface Habillage {
  produitId?: string | undefined;
  icone?: string | undefined;
  rayon?: string | undefined;
}

/** Rayon d’un article : celui choisi, sinon celui du produit, sinon « Divers ». */
export const rayonDe = (a: Habillage): string => a.rayon ?? produit(a.produitId)?.rayon ?? 'divers';

/** Illustration d’un article : celle choisie, sinon celle du produit (ou `null` : initiales). */
export const iconeDe = (a: Habillage): string | null => a.icone ?? produit(a.produitId)?.icone ?? null;

/** Initiales d’un article sans icône (« Yaourts » → « Ya »). */
export const initiales = (nom: string): string => nom.trim().slice(0, 2) || '?';

/** Une illustration proposée au choix : la première fois qu’elle apparaît dans le catalogue. */
export interface ChoixIcone {
  icone: string;
  nom: string;
  rayon: string;
}

/** Toutes les illustrations du catalogue, une seule fois chacune, rangées par rayon. */
export const CHOIX_ICONES: readonly ChoixIcone[] = (() => {
  const vues = new Set<string>();
  const choix: ChoixIcone[] = [];
  for (const [rayon] of RAYONS)
    for (const p of CATALOGUE)
      if (p.rayon === rayon && p.icone && !vues.has(p.icone)) {
        vues.add(p.icone);
        choix.push({ icone: p.icone, nom: p.nom, rayon });
      }
  return choix;
})();
