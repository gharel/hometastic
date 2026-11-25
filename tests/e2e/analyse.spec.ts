import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { aller, creerFoyer, enregistrer, ouvrirAjout } from './aide';

async function nouvelleTache(
  page: Page,
  titre: string,
  options: { duree?: string; pour?: string; repeter?: string } = {},
) {
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill(titre);
  if (options.duree) await page.getByLabel(/^Durée \(min\)/).fill(options.duree);
  if (options.pour) await page.getByRole('radio', { name: options.pour, exact: true }).check();
  if (options.repeter) await page.getByLabel('Répéter').selectOption(options.repeter);
  await enregistrer(page);
}

async function ceTelephoneEst(page: Page, prenom: string) {
  await aller(page, 'Nous');
  await page
    .getByRole('group', { name: 'Membre qui utilise ce téléphone' })
    .getByRole('button', { name: prenom })
    .click();
}

test('Analyse : durée estimée, qui fait quoi, charge mentale, rééquilibrage', async ({ page }) => {
  await creerFoyer(page);

  // La durée est estimée d’après le titre.
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Lancer une machine');
  await expect(page.getByLabel(/^Durée \(min\)\s:\sestimée à 20\smin \(linge\)/)).toBeVisible();
  await page.getByRole('button', { name: 'Fermer' }).click();

  // Sam fait beaucoup : grand ménage (3 h) et lessive ; Alex prépare un repas.
  await nouvelleTache(page, 'Grand ménage', { duree: '180' });
  await nouvelleTache(page, 'Lessive', { pour: 'Sam', repeter: 'semaine' });
  await nouvelleTache(page, 'Repassage', { pour: 'Sam', repeter: 'semaine' });
  await nouvelleTache(page, 'Préparer le repas');
  await ceTelephoneEst(page, 'Sam');
  await aller(page, 'À faire');
  await page.getByRole('button', { name: 'Terminer : Grand ménage' }).click();
  await page.getByRole('button', { name: 'Terminer : Lessive' }).click();
  await ceTelephoneEst(page, 'Alex');
  await aller(page, 'À faire');
  await page.getByRole('button', { name: 'Terminer : Préparer le repas' }).click();

  await aller(page, 'Nous');
  await page.getByRole('link', { name: /Qui fait quoi, charge mentale/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Analyse' })).toBeVisible();

  const quiFait = page.getByRole('region', { name: 'Qui fait quoi' });
  await expect(quiFait.getByText(/Sam\s3\sh\s20/)).toBeVisible();
  await expect(quiFait.getByText(/Alex\s45\smin/)).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Charge mentale' }).getByText(/Alex\s4\stâches prévues/),
  ).toBeVisible();

  const equilibre = page.getByRole('region', { name: 'Équilibre' });
  await expect(equilibre.getByText(/Sam a passé 2\sh\s35 de plus que Alex/)).toBeVisible();
  await equilibre.getByRole('button', { name: 'Confier à Alex' }).first().click();
  await expect(page.getByRole('status')).toContainText('confiée à Alex');

  await expect(page.getByRole('region', { name: 'Par domaine' }).getByText('Ménage')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Six derniers mois' }).getByRole('link')).toHaveCount(6);

  const resultats = await new AxeBuilder({ page }).analyze();
  expect(resultats.violations.map((v) => v.id)).toEqual([]);
  const debord = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(debord).toBeLessThanOrEqual(0);
  await page.screenshot({ path: 'docs/captures/app-telephone-analyse-light.png', fullPage: true });

  // Mois précédent : vide.
  await page.getByRole('link', { name: /Mois précédent/ }).click();
  await expect(page.getByText(/Rien de coché ce mois-ci/)).toBeVisible();
});
