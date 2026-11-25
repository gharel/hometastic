/**
 * Stockage brut : ce qui est réellement écrit (sur le téléphone aujourd’hui, sur le serveur de
 * synchronisation demain, ADR 0002). Il ne voit que des documents déjà chiffrés pour la santé.
 */

export type Document = { id: string } & Record<string, unknown>;

/** Tables du stockage : les collections des briques, plus le foyer et les clés de l’appareil. */
export type NomTable =
  'foyer' | 'cles' | 'listes' | 'articles' | 'taches' | 'fiches' | 'entrees' | 'projets' | 'depenses';

export const TABLES: readonly NomTable[] = [
  'foyer',
  'cles',
  'listes',
  'articles',
  'taches',
  'fiches',
  'entrees',
  'projets',
  'depenses',
];

export interface Stockage {
  tout(table: NomTable): Promise<Document[]>;
  lire(table: NomTable, id: string): Promise<Document | undefined>;
  mettre(table: NomTable, doc: Document): Promise<void>;
  supprimer(table: NomTable, id: string): Promise<void>;
  /** Appelle `rappel` avec le contenu de la table maintenant puis à chaque changement ; renvoie l’arrêt. */
  ecouter(table: NomTable, rappel: (docs: Document[]) => void): () => void;
  vider(): Promise<void>;
}

/** Stockage en mémoire : tests et repli quand IndexedDB est indisponible. */
export class StockageMemoire implements Stockage {
  private readonly tables = new Map<NomTable, Map<string, Document>>();
  private readonly auditeurs = new Map<NomTable, Set<(docs: Document[]) => void>>();

  private table(nom: NomTable) {
    let t = this.tables.get(nom);
    if (!t) this.tables.set(nom, (t = new Map()));
    return t;
  }

  private prevenir(nom: NomTable) {
    const docs = [...this.table(nom).values()].map((d) => structuredClone(d));
    this.auditeurs.get(nom)?.forEach((a) => a(docs));
  }

  async tout(nom: NomTable) {
    return [...this.table(nom).values()].map((d) => structuredClone(d));
  }

  async lire(nom: NomTable, id: string) {
    const d = this.table(nom).get(id);
    return d && structuredClone(d);
  }

  async mettre(nom: NomTable, doc: Document) {
    this.table(nom).set(doc.id, structuredClone(doc));
    this.prevenir(nom);
  }

  async supprimer(nom: NomTable, id: string) {
    this.table(nom).delete(id);
    this.prevenir(nom);
  }

  ecouter(nom: NomTable, rappel: (docs: Document[]) => void) {
    let a = this.auditeurs.get(nom);
    if (!a) this.auditeurs.set(nom, (a = new Set()));
    a.add(rappel);
    rappel([...this.table(nom).values()].map((d) => structuredClone(d)));
    return () => void a.delete(rappel);
  }

  async vider() {
    for (const nom of this.tables.keys()) {
      this.table(nom).clear();
      this.prevenir(nom);
    }
  }
}
