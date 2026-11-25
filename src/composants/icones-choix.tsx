import { useState } from 'preact/hooks';
import { Illustration } from '../app/icones';
import {
  CATALOGUE,
  CHOIX_ICONES,
  RAYONS,
  normaliser,
  type ChoixIcone,
  type Produit,
} from '../domaine/catalogue';

/** Mots qui retrouvent une illustration : noms et synonymes de tous les produits qui l’utilisent. */
const MOTS_PAR_ICONE = new Map<string, string>();
for (const p of CATALOGUE)
  if (p.icone)
    MOTS_PAR_ICONE.set(
      p.icone,
      `${MOTS_PAR_ICONE.get(p.icone) ?? ''} ${normaliser([p.nom, ...p.synonymes].join(' '))}`,
    );

const correspond = (mots: string, recherche: string) =>
  !recherche || recherche.split(' ').every((m) => mots.includes(m));

/** Regroupe par rayon, dans l’ordre des rayons, en gardant les rayons non vides. */
function parRayon<T extends { rayon: string }>(elements: readonly T[]) {
  return RAYONS.map(([cle, titre]) => [cle, titre, elements.filter((e) => e.rayon === cle)] as const).filter(
    ([, , liste]) => liste.length > 0,
  );
}

function Recherche({ id, valeur, changer }: { id: string; valeur: string; changer: (v: string) => void }) {
  return (
    <>
      <label class="vh" for={id}>
        Chercher une icône
      </label>
      <input
        id={id}
        type="search"
        class="champ"
        autoComplete="off"
        placeholder="Chercher : vis, colle, savon, mascara…"
        value={valeur}
        onInput={(e) => changer(e.currentTarget.value)}
      />
    </>
  );
}

/** Choix d’une illustration dans une feuille : chaque icône une fois, rangées par rayon. */
export function ChoixIcones({
  choisie,
  choisir,
}: {
  choisie: string | null;
  choisir: (icone: string) => void;
}) {
  const [texte, setTexte] = useState('');
  const recherche = normaliser(texte);
  const visibles = CHOIX_ICONES.filter((c: ChoixIcone) =>
    correspond(`${normaliser(c.nom)} ${MOTS_PAR_ICONE.get(c.icone) ?? ''}`, recherche),
  );
  return (
    <div class="choix-icones">
      <Recherche id="chercher-icone" valeur={texte} changer={setTexte} />
      {visibles.length === 0 && <p class="aide">Aucune icône pour « {texte} ».</p>}
      {parRayon(visibles).map(([cle, titre, liste]) => (
        <section key={cle} class="choix-rayon" aria-label={titre}>
          <h3>{titre}</h3>
          <ul class="grille-icones">
            {liste.map((c) => (
              <li key={c.icone}>
                <button
                  type="button"
                  class="icone-choix"
                  aria-pressed={c.icone === choisie ? 'true' : 'false'}
                  onClick={() => choisir(c.icone)}
                >
                  <Illustration nom={c.icone} />
                  <span>{c.nom}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Tout le catalogue, rayon par rayon : chaque produit avec son icône (galerie et ajout rapide). */
export function GalerieProduits({ toucher }: { toucher?: ((p: Produit) => void) | undefined }) {
  const [texte, setTexte] = useState('');
  const recherche = normaliser(texte);
  const visibles = CATALOGUE.filter((p) =>
    correspond(normaliser([p.nom, ...p.synonymes].join(' ')), recherche),
  );
  return (
    <div class="choix-icones">
      <Recherche id="chercher-produit" valeur={texte} changer={setTexte} />
      {visibles.length === 0 && <p class="aide">Aucun produit pour « {texte} ».</p>}
      {parRayon(visibles).map(([cle, titre, liste]) => (
        <section key={cle} class="bloc choix-rayon" aria-labelledby={`g-${cle}`}>
          <h2 id={`g-${cle}`}>
            {titre} <span class="mono">{liste.length}</span>
          </h2>
          <ul class="grille-icones">
            {liste.map((p) => (
              <li key={p.id}>
                {toucher ? (
                  <button type="button" class="icone-choix" onClick={() => toucher(p)}>
                    {p.icone ? <Illustration nom={p.icone} /> : null}
                    <span>{p.nom}</span>
                  </button>
                ) : (
                  <span class="icone-choix">
                    {p.icone ? <Illustration nom={p.icone} /> : null}
                    <span>{p.nom}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
