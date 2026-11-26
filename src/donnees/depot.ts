import {
  chiffrer,
  dechiffrer,
  estBlocChiffre,
  exporterCle,
  genererCle,
  importerCle,
} from '../chiffrement/chiffrement';
import type { Collections, Foyer, NomCollection } from '../domaine/types';
import { COLLECTIONS } from '../domaine/types';
import type { Document, NomTable, Stockage } from './stockage';

/** Champs chiffrés quand un document porte `sante: true` (tâches et entrées d’historique). */
const CHAMPS_SANTE: Partial<Record<NomCollection, readonly string[]>> = {
  taches: ['titre', 'note'],
  entrees: ['titre', 'note', 'prestataire'],
};

const ILLISIBLE = 'Contenu chiffré illisible sur ce téléphone';

export const FORMAT_SAUVEGARDE = 'nid';
export const VERSION_SAUVEGARDE = 1;

export interface Sauvegarde {
  format: typeof FORMAT_SAUVEGARDE;
  version: number;
  exporteLe: string;
  /** Documents tels que stockés : la santé y reste chiffrée. */
  tables: Partial<Record<NomTable, Document[]>>;
}

/**
 * Dépôt du foyer : la seule porte d’accès aux données pour l’interface.
 * Il chiffre la santé avant d’écrire et la déchiffre en lisant (ADR 0004), quel que soit le stockage.
 */
export class Depot {
  private cle: CryptoKey | undefined;

  constructor(private readonly stockage: Stockage) {}

  /** Charge la clé santé de l’appareil, ou en crée une. */
  async ouvrir(): Promise<void> {
    const doc = await this.stockage.lire('cles', 'sante');
    if (doc && doc.cle instanceof CryptoKey) this.cle = doc.cle;
    else if (doc && typeof doc.code === 'string') this.cle = await importerCle(doc.code);
    else {
      this.cle = await genererCle();
      await this.enregistrerCle();
    }
  }

  private async enregistrerCle() {
    if (!this.cle) return;
    // La clé reste sur l’appareil ; un stockage qui ne sait pas garder un CryptoKey garde le code brut.
    try {
      await this.stockage.mettre('cles', { id: 'sante', cle: this.cle });
    } catch {
      await this.stockage.mettre('cles', { id: 'sante', code: await exporterCle(this.cle) });
    }
  }

  async codeDeSecours(): Promise<string> {
    if (!this.cle) await this.ouvrir();
    return exporterCle(this.cle as CryptoKey);
  }

  /** Remplace la clé de l’appareil par celle du foyer (code de secours ou QR code d’invitation). */
  async utiliserCode(code: string): Promise<void> {
    this.cle = await importerCle(code);
    await this.enregistrerCle();
  }

  private async cleOuverte(): Promise<CryptoKey> {
    if (!this.cle) await this.ouvrir();
    return this.cle as CryptoKey;
  }

  // ---------- Chiffrement transparent ----------

  private async versStockage<C extends NomCollection>(nom: C, objet: Collections[C]): Promise<Document> {
    let doc: Document = { ...(objet as unknown as Document) };
    const champs = CHAMPS_SANTE[nom];
    if (champs && doc.sante === true) {
      const secret = Object.fromEntries(champs.map((c) => [c, doc[c]]));
      doc = Object.fromEntries(Object.entries(doc).filter(([c]) => !champs.includes(c))) as Document;
      doc.titre = '';
      doc.chiffre = await chiffrer(await this.cleOuverte(), JSON.stringify(secret));
    }
    if (nom === 'fiches' && doc.sante) {
      const { sante, ...reste } = doc;
      doc = { ...reste, santeChiffree: await chiffrer(await this.cleOuverte(), JSON.stringify(sante)) };
    }
    return doc;
  }

  private async depuisStockage<C extends NomCollection>(nom: C, doc: Document): Promise<Collections[C]> {
    const objet: Record<string, unknown> = { ...doc };
    try {
      if (estBlocChiffre(objet.chiffre)) {
        Object.assign(objet, JSON.parse(await dechiffrer(await this.cleOuverte(), objet.chiffre)));
        delete objet.chiffre;
      }
      if (nom === 'fiches' && estBlocChiffre(objet.santeChiffree)) {
        objet.sante = JSON.parse(await dechiffrer(await this.cleOuverte(), objet.santeChiffree));
        delete objet.santeChiffree;
      }
    } catch {
      if (objet.chiffre) objet.titre = ILLISIBLE;
      objet.illisible = true;
    }
    return objet as unknown as Collections[C];
  }

  // ---------- Collections ----------

  async tout<C extends NomCollection>(nom: C): Promise<Collections[C][]> {
    const docs = await this.stockage.tout(nom);
    return Promise.all(docs.map((d) => this.depuisStockage(nom, d)));
  }

  async mettre<C extends NomCollection>(nom: C, objet: Collections[C]): Promise<void> {
    await this.stockage.mettre(nom, await this.versStockage(nom, objet));
  }

  supprimer(nom: NomCollection, id: string): Promise<void> {
    return this.stockage.supprimer(nom, id);
  }

  ecouter<C extends NomCollection>(nom: C, rappel: (objets: Collections[C][]) => void): () => void {
    let version = 0;
    return this.stockage.ecouter(nom, (docs) => {
      const courante = ++version;
      void Promise.all(docs.map((d) => this.depuisStockage(nom, d))).then((objets) => {
        if (courante === version) rappel(objets);
      });
    });
  }

  // ---------- Foyer ----------

  async lireFoyer(): Promise<Foyer | undefined> {
    return (await this.stockage.lire('foyer', 'foyer')) as Foyer | undefined;
  }

  ecrireFoyer(foyer: Foyer): Promise<void> {
    return this.stockage.mettre('foyer', foyer as unknown as Document);
  }

  ecouterFoyer(rappel: (foyer: Foyer | undefined) => void): () => void {
    return this.stockage.ecouter('foyer', (docs) => rappel(docs[0] as Foyer | undefined));
  }

  // ---------- Sauvegarde ----------

  async exporter(maintenant = new Date()): Promise<Sauvegarde> {
    const tables: Sauvegarde['tables'] = { foyer: await this.stockage.tout('foyer') };
    for (const c of COLLECTIONS) tables[c] = await this.stockage.tout(c);
    return {
      format: FORMAT_SAUVEGARDE,
      version: VERSION_SAUVEGARDE,
      exporteLe: maintenant.toISOString(),
      tables,
    };
  }

  /** Remplace toutes les données par une sauvegarde ; une sauvegarde invalide est refusée sans rien écraser. */
  async importer(donnees: unknown): Promise<void> {
    const s = donnees as Partial<Sauvegarde> | null;
    if (
      !s ||
      s.format !== FORMAT_SAUVEGARDE ||
      s.version !== VERSION_SAUVEGARDE ||
      typeof s.tables !== 'object'
    )
      throw new Error('Ce fichier n’est pas une sauvegarde de Hometastic lisible par cette version.');
    const noms: NomTable[] = ['foyer', ...COLLECTIONS];
    for (const n of noms) {
      const docs = s.tables[n] ?? [];
      if (!Array.isArray(docs) || docs.some((d) => !d || typeof (d as Document).id !== 'string'))
        throw new Error(`Sauvegarde abîmée (${n}).`);
    }
    for (const n of noms) {
      for (const d of await this.stockage.tout(n)) await this.stockage.supprimer(n, d.id);
      for (const d of s.tables[n] ?? []) await this.stockage.mettre(n, d);
    }
  }

  async toutEffacer(): Promise<void> {
    await this.stockage.vider();
    this.cle = undefined;
  }
}
