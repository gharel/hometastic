import { describe, expect, it } from 'vitest';
import { modeInstallation } from '../../src/domaine/installation';

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1';
const IPAD =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Safari/605.1.15';
const ANDROID =
  'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36';
const FIREFOX_ANDROID = 'Mozilla/5.0 (Android 15; Mobile; rv:145.0) Gecko/145.0 Firefox/145.0';

describe('installation sur l’écran d’accueil (spec 006)', () => {
  it('rien à proposer quand l’app est ouverte depuis l’écran d’accueil', () => {
    expect(modeInstallation({ autonome: true, fenetreDisponible: true, agent: ANDROID })).toBe('installee');
    expect(modeInstallation({ autonome: true, fenetreDisponible: false, agent: IPHONE })).toBe('installee');
  });

  it('la fenêtre du navigateur dès qu’elle est disponible', () => {
    expect(modeInstallation({ autonome: false, fenetreDisponible: true, agent: ANDROID })).toBe('fenetre');
  });

  it('iPhone et iPad : la marche à suivre par Partager', () => {
    expect(modeInstallation({ autonome: false, fenetreDisponible: false, agent: IPHONE })).toBe('ios');
    expect(
      modeInstallation({
        autonome: false,
        fenetreDisponible: false,
        agent: IPAD,
        plateforme: 'MacIntel',
        pointsTactiles: 5,
      }),
    ).toBe('ios');
  });

  it('les autres : par le menu du navigateur (un Mac sans écran tactile n’est pas un iPad)', () => {
    expect(modeInstallation({ autonome: false, fenetreDisponible: false, agent: FIREFOX_ANDROID })).toBe(
      'menu',
    );
    expect(
      modeInstallation({
        autonome: false,
        fenetreDisponible: false,
        agent: IPAD,
        plateforme: 'MacIntel',
        pointsTactiles: 0,
      }),
    ).toBe('menu');
  });
});
