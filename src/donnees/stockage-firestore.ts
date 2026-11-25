import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { Document, NomTable, Stockage } from './stockage';

/**
 * Stockage partagé du foyer dans Firestore : foyers/{foyerId}/{table}/{id}. Les écritures partent
 * dans le cache local tout de suite (hors ligne compris) et se synchronisent quand le réseau revient.
 * La table « cles » (clé de santé) ne quitte jamais le téléphone : elle reste dans le stockage local.
 */
export class StockageFirestore implements Stockage {
  constructor(
    private readonly db: Firestore,
    private readonly foyerId: string,
    private readonly local: Stockage,
    private readonly signalerErreur: (e: unknown) => void = (e) => console.error(e),
  ) {}

  private collection(table: NomTable) {
    return collection(this.db, 'foyers', this.foyerId, table);
  }

  async tout(table: NomTable): Promise<Document[]> {
    if (table === 'cles') return this.local.tout(table);
    const instantane = await getDocs(this.collection(table));
    return instantane.docs.map((d) => ({ ...d.data(), id: d.id }));
  }

  async lire(table: NomTable, id: string): Promise<Document | undefined> {
    if (table === 'cles') return this.local.lire(table, id);
    const d = await getDoc(doc(this.collection(table), id));
    return d.exists() ? { ...d.data(), id: d.id } : undefined;
  }

  async mettre(table: NomTable, document: Document): Promise<void> {
    if (table === 'cles') return this.local.mettre(table, document);
    // Pas d’attente du serveur : hors ligne, la promesse ne se résoudrait qu’au retour du réseau.
    void setDoc(doc(this.collection(table), document.id), document).catch(this.signalerErreur);
  }

  async supprimer(table: NomTable, id: string): Promise<void> {
    if (table === 'cles') return this.local.supprimer(table, id);
    void deleteDoc(doc(this.collection(table), id)).catch(this.signalerErreur);
  }

  ecouter(table: NomTable, rappel: (docs: Document[]) => void): () => void {
    if (table === 'cles') return this.local.ecouter(table, rappel);
    return onSnapshot(
      this.collection(table),
      (instantane) => rappel(instantane.docs.map((d) => ({ ...d.data(), id: d.id }))),
      this.signalerErreur,
    );
  }

  /** « Effacer » sur un téléphone relié : n’efface que ce téléphone ; les données du foyer restent partagées. */
  async vider(): Promise<void> {
    await this.local.vider();
  }
}
