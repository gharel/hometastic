import Dexie, { liveQuery } from 'dexie';
import { TABLES, type Document, type NomTable, type Stockage } from './stockage';

/** Stockage sur le téléphone (IndexedDB via Dexie) : fonctionne hors ligne, survit aux redémarrages. */
export class StockageDexie implements Stockage {
  private readonly base: Dexie;

  constructor(nom = 'nid') {
    this.base = new Dexie(nom);
    this.base.version(1).stores(Object.fromEntries(TABLES.map((t) => [t, 'id'])));
  }

  private t(nom: NomTable) {
    return this.base.table<Document, string>(nom);
  }

  tout(nom: NomTable) {
    return this.t(nom).toArray();
  }

  lire(nom: NomTable, id: string) {
    return this.t(nom).get(id);
  }

  async mettre(nom: NomTable, doc: Document) {
    await this.t(nom).put(doc);
  }

  async supprimer(nom: NomTable, id: string) {
    await this.t(nom).delete(id);
  }

  ecouter(nom: NomTable, rappel: (docs: Document[]) => void) {
    const abonnement = liveQuery(() => this.t(nom).toArray()).subscribe({
      next: rappel,
      error: (e: unknown) => console.error(`Lecture de ${nom} impossible`, e),
    });
    return () => abonnement.unsubscribe();
  }

  async vider() {
    await this.base.transaction('rw', TABLES as NomTable[], async () => {
      for (const t of TABLES) await this.t(t).clear();
    });
  }
}
