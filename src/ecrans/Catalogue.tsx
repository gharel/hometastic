import { ajouterArticle } from '../app/actions';
import { listes } from '../app/etat';
import { Retour } from '../composants/communs';
import { GalerieProduits } from '../composants/icones-choix';
import { CATALOGUE, CHOIX_ICONES } from '../domaine/catalogue';

/** Toutes les icônes du catalogue, rayon par rayon ; toucher un produit l’ajoute à la liste. */
export function Catalogue({ listeId }: { listeId?: string | undefined }) {
  const courses = listes.value.filter((l) => l.type === 'courses');
  const liste = courses.find((l) => l.id === listeId) ?? courses[0];
  return (
    <section class="vue" aria-labelledby="titre-catalogue">
      <Retour href={liste ? `#/courses/${liste.id}` : '#/courses'} libelle={liste?.nom ?? 'Courses'} />
      <h1 id="titre-catalogue" tabIndex={-1}>
        Toutes les icônes
      </h1>
      <p class="chapeau">
        {CATALOGUE.length} produits, {CHOIX_ICONES.length} icônes.
        {liste ? ` Touchez un produit pour l’ajouter à « ${liste.nom} ».` : ''} Pour changer l’icône d’un
        article : Courses, « Modifier les articles ».
      </p>
      <GalerieProduits toucher={liste ? (p) => void ajouterArticle(liste.id, p.nom, p.id) : undefined} />
    </section>
  );
}
