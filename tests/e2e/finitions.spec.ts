import { expect, test, type Page } from '@playwright/test';
import { aller, creerFoyer, dansJours, enregistrer, ouvrirAjout } from './aide';

/** Défilements horizontaux, contours restés affichés, contrôles cachés par un autre élément. */
async function controlerFinitions(page: Page, ecran: string) {
  const constats = await page.evaluate(() => {
    const problemes: string[] = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth)
      problemes.push(`page : débordement de ${doc.scrollWidth - doc.clientWidth} px`);
    const nom = (e: Element) =>
      `${e.tagName.toLowerCase()}.${[...e.classList].join('.')} « ${(e.textContent ?? '').trim().slice(0, 30)} »`;
    for (const e of document.querySelectorAll<HTMLElement>('body *')) {
      const s = getComputedStyle(e);
      if (
        ['auto', 'scroll'].includes(s.overflowX) &&
        e.scrollWidth > e.clientWidth + 1 &&
        e.tagName !== 'DIALOG'
      )
        problemes.push(`ascenseur horizontal : ${nom(e)}`);
      if (e !== document.activeElement && s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0)
        problemes.push(`contour affiché hors focus : ${nom(e)}`);
    }
    // Contrôles visibles dans la zone de contenu (hors barre du haut, barre d’onglets et bouton Ajouter).
    const haut = document.querySelector('.barre')?.getBoundingClientRect().bottom ?? 0;
    const bas = document.querySelector('.navigation')?.getBoundingClientRect().top ?? innerHeight;
    const fab = document.querySelector('.fab')?.getBoundingClientRect();
    for (const e of document.querySelectorAll<HTMLElement>('main button, main a, main input, main select')) {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (y < haut + 4 || y > bas - 4 || x < 0 || x > innerWidth) continue;
      if (fab && x >= fab.left - 4 && x <= fab.right + 4 && y >= fab.top - 4 && y <= fab.bottom + 4) continue;
      const dessus = document.elementFromPoint(x, y);
      if (dessus && dessus !== e && !e.contains(dessus) && !dessus.contains(e) && !dessus.closest('.toast'))
        problemes.push(`caché : ${nom(e)} sous ${nom(dessus)}`);
    }
    return problemes;
  });
  expect(constats, ecran).toEqual([]);
}

test.use({ viewport: { width: 360, height: 760 } });

test('finitions à 360 px : ni ascenseur horizontal, ni contour qui traîne, ni contrôle caché', async ({
  page,
}) => {
  await creerFoyer(page);
  await aller(page, 'Courses');
  const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
  for (const a of [
    '2 l lait',
    'bananes',
    'pain',
    'café',
    'yaourts',
    'papier toilette',
    'liquide vaisselle',
  ]) {
    await saisie.fill(a);
    await saisie.press('Enter');
  }
  await saisie.fill('po');
  await controlerFinitions(page, 'courses avec suggestions');
  await saisie.fill('');
  await page.locator('.tuile.sur-liste[data-article="Pain"]').click();
  await page.locator('h1').click();
  await controlerFinitions(page, 'courses après un article coché');

  await page.getByRole('button', { name: 'Liste', exact: true }).first().click();
  await page.getByLabel('Nom').fill('Valise pour les vacances de fin d’année');
  await page.getByRole('radio', { name: 'À cocher (valise, préparatifs)' }).check();
  await enregistrer(page);
  await controlerFinitions(page, 'pastilles de listes nombreuses');

  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Rappeler l’assurance habitation pour le sinistre de la terrasse');
  await page.getByLabel('Quand').fill(dansJours(0));
  await enregistrer(page);
  await aller(page, 'À faire');
  await page
    .getByRole('button', { name: /^Terminer.*Rappeler l’assurance/ })
    .first()
    .click();
  await page.locator('h1').click();
  await controlerFinitions(page, 'à faire après une tâche cochée');

  for (const ecran of ['Aujourd’hui', 'Foyer', 'Nous'] as const) {
    await aller(page, ecran);
    await controlerFinitions(page, ecran);
  }
  await page.getByRole('link', { name: /Qui fait quoi, charge mentale/ }).click();
  await controlerFinitions(page, 'analyse');
});
