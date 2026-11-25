import { analyserArticle, normaliser, produit, trouverProduit } from '../domaine/catalogue';
import { nouvelId } from '../domaine/id';
import { modelePour, tachesDuModele } from '../domaine/modeles';
import { rouvrirTache, terminerTache } from '../domaine/recurrence';
import { dateAchatBillets, devinerCategorie } from '../domaine/sorties';
import type { Article, Depense, Entree, Fiche, Foyer, Liste, Membre, Projet, Tache } from '../domaine/types';
import {
  annoncer,
  articles,
  choisirMembre,
  depenses,
  depot,
  entrees,
  fiches,
  foyer,
  listes,
  moi,
  taches,
} from './etat';

const maintenant = () => new Date().toISOString();
const ENREGISTRE = 'enregistré sur ce téléphone';

// ---------- Foyer ----------
export async function creerFoyer(
  nom: string,
  prenomMoi: string,
  prenomAutre: string,
  devise: Foyer['devise'],
) {
  const m1: Membre = { id: nouvelId(), nom: prenomMoi.trim(), couleur: 'a' };
  const membres: Membre[] = [m1];
  if (prenomAutre.trim()) membres.push({ id: nouvelId(), nom: prenomAutre.trim(), couleur: 'b' });
  choisirMembre(m1.id);
  const creeLe = maintenant();
  await depot().mettre('listes', { id: nouvelId(), nom: 'Supermarché', type: 'courses', ordre: 0, creeLe });
  await depot().mettre('listes', { id: nouvelId(), nom: 'À voir', type: 'sorties', ordre: 1, creeLe });
  await depot().mettre('fiches', { id: nouvelId(), type: 'maison', nom: 'Maison', infos: {}, creeLe });
  await depot().ecrireFoyer({ id: 'foyer', nom: nom.trim() || 'Notre foyer', membres, devise, creeLe });
}

export async function modifierFoyer(foyer: Foyer) {
  await depot().ecrireFoyer(foyer);
  annoncer('Foyer mis à jour');
}

// ---------- Liste ----------
export async function enregistrerListe(liste: Liste) {
  await depot().mettre('listes', liste);
  annoncer(`Liste « ${liste.nom} » ${ENREGISTRE}`);
}

export async function supprimerListe(liste: Liste) {
  for (const a of articles.value.filter((a) => a.listeId === liste.id))
    await depot().supprimer('articles', a.id);
  await depot().supprimer('listes', liste.id);
  annoncer(`Liste « ${liste.nom} » supprimée`);
}

export const nouvelleListe = (defauts: Partial<Liste> = {}): Liste => ({
  id: nouvelId(),
  nom: '',
  type: 'courses',
  ordre: listes.value.length,
  creeLe: maintenant(),
  ...defauts,
});

/** Ajoute un article saisi (« 2 l lait »). Un article déjà acheté revient sur la liste au lieu d’être dupliqué. */
export async function ajouterArticle(
  listeId: string,
  saisie: string,
  produitId?: string,
): Promise<Article | undefined> {
  const { nom, precision } = analyserArticle(saisie);
  if (!nom) return undefined;
  const p = produitId ? produit(produitId) : trouverProduit(nom);
  const nomFinal = p?.nom ?? nom;
  const existant = articles.value.find(
    (a) =>
      a.listeId === listeId &&
      (p ? a.produitId === p.id : !a.produitId && normaliser(a.nom) === normaliser(nomFinal)),
  );
  if (existant && !existant.coche) {
    if (precision && precision !== existant.precision) {
      await depot().mettre('articles', { ...existant, precision });
      annoncer(`${nomFinal} : ${precision}`);
    } else annoncer(`${nomFinal} est déjà sur la liste`);
    return existant;
  }
  // Illustration et rayon choisis une fois pour ce nom : réappliqués à chaque ajout.
  const appris = foyer.value?.appris?.[normaliser(nomFinal)];
  const article: Article = {
    ...(existant ?? { id: nouvelId(), listeId }),
    nom: nomFinal,
    produitId: p?.id,
    icone: appris?.icone ?? existant?.icone,
    rayon: appris?.rayon ?? existant?.rayon,
    precision: precision ?? existant?.precision,
    ajoutePar: moi.value?.id,
    ajouteLe: maintenant(),
    coche: undefined,
  };
  await depot().mettre('articles', article);
  annoncer(`${nomFinal} ajouté`);
  return article;
}

export async function cocherArticle(article: Article) {
  await depot().mettre('articles', { ...article, coche: { par: moi.value?.id, le: maintenant() } });
}

export async function decocherArticle(article: Article) {
  await depot().mettre('articles', {
    ...article,
    coche: undefined,
    ajoutePar: moi.value?.id,
    ajouteLe: maintenant(),
  });
}

export async function modifierArticle(article: Article) {
  await depot().mettre('articles', article);
}

/** Retient l’illustration et le rayon choisis pour ce nom d’article (partagé avec l’autre téléphone). */
export async function retenirHabillage(
  nom: string,
  habillage: { icone?: string | undefined; rayon?: string | undefined },
) {
  const f = foyer.value;
  if (!f) return;
  const cle = normaliser(nom);
  // Revenir à l’icône et au rayon d’origine efface ce qui avait été retenu.
  const autres = Object.entries(f.appris ?? {}).filter(([k]) => k !== cle);
  const garde =
    habillage.icone || habillage.rayon ? [[cle, { icone: habillage.icone, rayon: habillage.rayon }]] : [];
  await depot().ecrireFoyer({ ...f, appris: Object.fromEntries([...autres, ...garde]) });
}

export async function supprimerArticle(article: Article) {
  await depot().supprimer('articles', article.id);
  const tache = article.tacheId ? taches.value.find((t) => t.id === article.tacheId) : undefined;
  if (tache && !tache.faite) await depot().supprimer('taches', tache.id);
  annoncer(`${article.nom} retiré`);
}

// ---------- Liste « À voir » ----------
export async function ajouterSortie(listeId: string, texte: string) {
  const nom = texte.trim();
  if (!nom) return undefined;
  const sortie: Article = {
    id: nouvelId(),
    listeId,
    nom: nom.charAt(0).toUpperCase() + nom.slice(1),
    categorie: devinerCategorie(nom),
    billet: 'aucun',
    ajoutePar: moi.value?.id,
    ajouteLe: maintenant(),
  };
  await depot().mettre('articles', sortie);
  annoncer(`${sortie.nom} ajouté à voir`);
  return sortie;
}

/**
 * Enregistre une sortie. Billets « à acheter » : une tâche « Acheter les billets » est créée ou mise à jour
 * (échéance `achatAvant`) ; billets « achetés » : cette tâche est marquée faite.
 */
export async function enregistrerSortie(sortie: Article, achatAvant: string | undefined, aujourdhui: string) {
  let tacheId = sortie.tacheId;
  const tache = tacheId ? taches.value.find((t) => t.id === tacheId) : undefined;
  if (sortie.billet === 'a-acheter') {
    const base = tache ?? nouvelleTache({ assignation: moi.value?.id ?? 'nous' });
    tacheId = base.id;
    await depot().mettre('taches', {
      ...base,
      titre: `Acheter les billets : ${sortie.nom}`,
      echeance: achatAvant || dateAchatBillets(sortie.date, aujourdhui),
      faite: undefined,
    });
  } else if (tache && sortie.billet === 'achete' && !tache.faite) {
    await depot().mettre('taches', { ...tache, faite: { par: moi.value?.id, le: aujourdhui } });
  } else if (tache && sortie.billet === 'aucun' && !tache.faite) {
    await depot().supprimer('taches', tache.id);
    tacheId = undefined;
  }
  await depot().mettre('articles', { ...sortie, tacheId });
  annoncer(
    sortie.billet === 'a-acheter'
      ? `${sortie.nom} : rappel pour acheter les billets`
      : `${sortie.nom} ${ENREGISTRE}`,
  );
}

/** Liste à cocher : tout remettre à zéro (valise d’un nouveau voyage). */
export async function toutDecocher(listeId: string) {
  for (const a of articles.value.filter((a) => a.listeId === listeId && a.coche))
    await depot().mettre('articles', { ...a, coche: undefined });
  annoncer('Tout est décoché');
}

// ---------- Tâche ----------
export const nouvelleTache = (defauts: Partial<Tache> = {}): Tache => ({
  id: nouvelId(),
  titre: '',
  assignation: moi.value?.id ?? 'nous',
  creeePar: moi.value?.id,
  creeeLe: maintenant(),
  historique: [],
  ...defauts,
});

export async function enregistrerTache(tache: Tache) {
  await depot().mettre('taches', tache);
  annoncer(`Tâche ${ENREGISTRE}`);
}

export async function basculerTache(tache: Tache, aujourdhui: string) {
  if (tache.faite) {
    await depot().mettre('taches', rouvrirTache(tache));
    annoncer(`« ${tache.titre} » à refaire`);
    return;
  }
  const km = tache.ficheId ? fiches.value.find((f) => f.id === tache.ficheId)?.km?.valeur : undefined;
  const suite = terminerTache(tache, aujourdhui, moi.value?.id, km);
  await depot().mettre('taches', suite);
  // Un virement ou un paiement fait laisse une trace datée dans l’historique de la fiche.
  if (tache.ficheId && tache.montant !== undefined)
    await depot().mettre('entrees', {
      id: nouvelId(),
      ficheId: tache.ficheId,
      date: aujourdhui,
      titre: tache.titre,
      cout: tache.montant,
      sante: tache.sante,
      par: moi.value?.id,
    });
  // Billets achetés : la sortie liée passe à « acheté ».
  const sortie = articles.value.find((a) => a.tacheId === tache.id);
  if (sortie) await depot().mettre('articles', { ...sortie, billet: 'achete' });
  annoncer(
    tache.recurrence ? `« ${tache.titre} » fait, prochaine fois programmée` : `« ${tache.titre} » fait`,
  );
}

export async function supprimerTache(tache: Tache) {
  await depot().supprimer('taches', tache.id);
  annoncer('Tâche supprimée');
}

// ---------- Fiche ----------
export const nouvelleFiche = (type: Fiche['type'] = 'maison'): Fiche => ({
  id: nouvelId(),
  type,
  nom: '',
  infos: {},
  creeLe: maintenant(),
});

/** Enregistre une fiche ; à la création, `avecModele` ajoute les échéances habituelles de son type. */
export async function enregistrerFiche(
  fiche: Fiche,
  avecModele = false,
  aujourdhui = maintenant().slice(0, 10),
) {
  await depot().mettre('fiches', fiche);
  const modele = avecModele ? modelePour(fiche.type, fiche.infos.genre) : undefined;
  if (modele) {
    const assignation = fiche.type === 'compte' ? 'nous' : (moi.value?.id ?? 'nous');
    for (const t of tachesDuModele(modele, aujourdhui, assignation, fiche.km?.valeur))
      await depot().mettre('taches', {
        ...nouvelleTache(),
        ...t,
        titre: fiche.type === 'animal' ? `${t.titre} (${fiche.nom})` : t.titre,
        ficheId: fiche.id,
      });
  }
  annoncer(
    modele
      ? `Fiche « ${fiche.nom} » créée avec ${
          modele.taches.length > 1
            ? `${modele.taches.length} échéances habituelles`
            : 'son échéance habituelle'
        }`
      : `Fiche « ${fiche.nom} » ${ENREGISTRE}`,
  );
}

/** Supprime une fiche et son historique ; ses tâches et listes restent, sans rattachement. */
export async function supprimerFiche(fiche: Fiche) {
  for (const e of entrees.value.filter((e) => e.ficheId === fiche.id))
    await depot().supprimer('entrees', e.id);
  for (const t of taches.value.filter((t) => t.ficheId === fiche.id))
    await depot().mettre('taches', { ...t, ficheId: undefined });
  for (const l of listes.value.filter((l) => l.ficheId === fiche.id))
    await depot().mettre('listes', { ...l, ficheId: undefined });
  await depot().supprimer('fiches', fiche.id);
  annoncer(`Fiche « ${fiche.nom} » supprimée`);
}

export async function releverKm(fiche: Fiche, valeur: number) {
  await depot().mettre('fiches', {
    ...fiche,
    km: { valeur, le: maintenant().slice(0, 10), par: moi.value?.id },
  });
  annoncer(`Kilométrage ${ENREGISTRE}`);
}

export async function enregistrerEntree(entree: Entree) {
  await depot().mettre('entrees', entree);
  annoncer(`Historique ${ENREGISTRE}`);
}

export async function supprimerEntree(entree: Entree) {
  await depot().supprimer('entrees', entree.id);
  annoncer('Entrée supprimée');
}

// ---------- Projet ----------
export const nouveauProjet = (type: Projet['type'] = 'voyage'): Projet => ({
  id: nouvelId(),
  type,
  nom: '',
  archive: false,
  creeLe: maintenant(),
});

export async function enregistrerProjet(projet: Projet) {
  await depot().mettre('projets', projet);
  annoncer(`Projet « ${projet.nom} » ${ENREGISTRE}`);
}

/** Supprime un projet et ses dépenses ; ses tâches et listes restent, sans rattachement. */
export async function supprimerProjet(projet: Projet) {
  for (const d of depenses.value.filter((d) => d.projetId === projet.id))
    await depot().supprimer('depenses', d.id);
  for (const t of taches.value.filter((t) => t.projetId === projet.id))
    await depot().mettre('taches', { ...t, projetId: undefined });
  for (const l of listes.value.filter((l) => l.projetId === projet.id))
    await depot().mettre('listes', { ...l, projetId: undefined });
  await depot().supprimer('projets', projet.id);
  annoncer(`Projet « ${projet.nom} » supprimé`);
}

export async function enregistrerDepense(depense: Depense) {
  await depot().mettre('depenses', depense);
  annoncer(`Dépense ${ENREGISTRE}`);
}

export async function supprimerDepense(depense: Depense) {
  await depot().supprimer('depenses', depense.id);
  annoncer('Dépense supprimée');
}
