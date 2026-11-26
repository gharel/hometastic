import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { instantLocal, rappelsDus, type TacheARappeler } from '../../src/domaine/rappels';
import { lireAncre, ancre } from '../../src/app/routage';
import { decoderInvitation, encoderInvitation, nouveauSecret } from '../../src/donnees/synchro/invitation';

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const chaine = (min: number, max: number) =>
  fc.string({ unit: fc.constantFrom(...B64.split('')), minLength: min, maxLength: max });

describe('invitation', () => {
  const cle = 'a'.repeat(43);

  it('fait l’aller-retour code ↔ invitation', () => {
    fc.assert(
      fc.property(chaine(10, 40), chaine(22, 30), chaine(43, 43), (foyerId, secret, c) => {
        expect(decoderInvitation(encoderInvitation({ foyerId, secret, cle: c }))).toEqual({
          foyerId,
          secret,
          cle: c,
        });
      }),
    );
  });

  it('accepte le lien complet', () => {
    const code = encoderInvitation({ foyerId: 'AbCdEfGhIjKlMnOpQrSt', secret: nouveauSecret(), cle });
    expect(decoderInvitation(` https://gharel.github.io/hometastic/#/rejoindre/${code} `)?.foyerId).toBe(
      'AbCdEfGhIjKlMnOpQrSt',
    );
  });

  it('refuse un lien incomplet ou abîmé', () => {
    const secret = nouveauSecret();
    expect(decoderInvitation('')).toBeUndefined();
    expect(decoderInvitation(`AbCdEfGhIjKl.${secret}`)).toBeUndefined();
    expect(decoderInvitation(`AbCdEfGhIjKl.${secret}.${cle.slice(1)}`)).toBeUndefined();
    expect(decoderInvitation(`AbCdEfGhIjKl.${secret}.${cle}.x`)).toBeUndefined();
    expect(decoderInvitation(`Ab/dEfGhIjKl.${secret}.${cle}`)).toBeUndefined();
    expect(decoderInvitation(`court.${secret}.${cle}`)).toBeUndefined();
  });

  it('tire des secrets de 128 bits en base64url', () => {
    const a = nouveauSecret();
    expect(a).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(nouveauSecret()).not.toBe(a);
  });

  it('route #/rejoindre/<code> vers l’écran d’invitation', () => {
    const code = encoderInvitation({ foyerId: 'AbCdEfGhIjKl', secret: nouveauSecret(), cle });
    expect(lireAncre(`#/rejoindre/${code}`)).toEqual({ ecran: 'rejoindre', code });
    expect(ancre({ ecran: 'rejoindre', code })).toBe(`#/rejoindre/${code}`);
  });
});

describe('heure locale des rappels', () => {
  it('Nouméa (UTC+11, sans heure d’été)', () => {
    expect(instantLocal('2026-11-26', '08:00', 'Pacific/Noumea')).toBe(Date.UTC(2026, 10, 25, 21, 0));
  });

  it('Paris, heure d’hiver et heure d’été', () => {
    expect(instantLocal('2026-01-15', '08:00', 'Europe/Paris')).toBe(Date.UTC(2026, 0, 15, 7, 0));
    expect(instantLocal('2026-07-01', '08:00', 'Europe/Paris')).toBe(Date.UTC(2026, 6, 1, 6, 0));
    // Jour du passage à l’heure d’été (29 mars 2026, 2 h → 3 h).
    expect(instantLocal('2026-03-29', '08:00', 'Europe/Paris')).toBe(Date.UTC(2026, 2, 29, 6, 0));
    expect(instantLocal('2026-03-28', '08:00', 'Europe/Paris')).toBe(Date.UTC(2026, 2, 28, 7, 0));
  });
});

describe('rappels dus', () => {
  const NOUMEA = 'Pacific/Noumea';
  const huitHeures = Date.UTC(2026, 10, 25, 21, 0); // 26 novembre, 8 h à Nouméa
  const minute = 60_000;
  const tache = (t: Partial<TacheARappeler>): TacheARappeler => ({
    id: 't1',
    titre: 'Sortir les poubelles',
    echeance: '2026-11-26',
    assignation: 'nous',
    ...t,
  });

  it('rappelle à 8 h par défaut, une fois l’heure passée', () => {
    expect(rappelsDus([tache({})], huitHeures - 5 * minute, NOUMEA, new Set())).toEqual([]);
    const [r] = rappelsDus([tache({})], huitHeures + 5 * minute, NOUMEA, new Set());
    expect(r).toEqual({
      cle: 't1_2026-11-26_08h00',
      titre: 'Sortir les poubelles',
      corps: 'Prévu aujourd’hui',
      pour: 'tous',
    });
  });

  it('respecte l’heure de la tâche et la personne assignée', () => {
    const t = tache({ heure: '18:30', assignation: 'm1' });
    expect(rappelsDus([t], huitHeures + 10 * 60 * minute, NOUMEA, new Set())).toEqual([]);
    const [r] = rappelsDus([t], huitHeures + 10 * 60 * minute + 31 * minute, NOUMEA, new Set());
    expect(r?.corps).toBe('À 18 h 30');
    expect(r?.pour).toEqual(['m1']);
  });

  it('ne rappelle ni une tâche faite, ni deux fois, ni plus de 24 h après', () => {
    const apres = huitHeures + 15 * minute;
    expect(rappelsDus([tache({ faite: { par: 'm1', le: '2026-11-26' } })], apres, NOUMEA, new Set())).toEqual(
      [],
    );
    expect(rappelsDus([tache({})], apres, NOUMEA, new Set(['t1_2026-11-26_08h00']))).toEqual([]);
    expect(rappelsDus([tache({})], huitHeures + 25 * 60 * minute, NOUMEA, new Set())).toEqual([]);
    expect(rappelsDus([tache({ echeance: undefined })], apres, NOUMEA, new Set())).toEqual([]);
  });

  it('ne dit rien du contenu d’un rappel de santé', () => {
    const [r] = rappelsDus(
      [tache({ titre: undefined, sante: true })],
      huitHeures + minute,
      NOUMEA,
      new Set(),
    );
    expect(r?.titre).toBe('Rappel santé');
    expect(JSON.stringify(r)).not.toMatch(/poubelles/i);
  });

  it('chaque rappel dû part dans la fenêtre de 24 h, quel que soit le retard de GitHub Actions', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 24 * 60 - 1 }), (retard) => {
        const r = rappelsDus([tache({})], huitHeures + retard * minute, NOUMEA, new Set());
        expect(r).toHaveLength(1);
      }),
    );
  });
});
