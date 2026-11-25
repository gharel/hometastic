import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { aller, creerFoyer } from './aide';

// Les tests tournent sur un build sans projet Firebase : la synchronisation est « à brancher ».

test('Nous : la synchronisation attend le projet Firebase, l’app reste locale', async ({ page }) => {
  await creerFoyer(page);
  await expect(page.locator('header .synchro')).toContainText('Non partagé');
  await aller(page, 'Nous');
  const synchro = page.getByRole('region', { name: 'Synchronisation' });
  await expect(synchro.getByText('Téléphone d’Hélène')).toBeVisible();
  await expect(synchro.getByText('À venir')).toBeVisible();
  await expect(synchro.getByText(/projet Firebase du foyer sera branché/)).toBeVisible();
  await expect(synchro.getByRole('button', { name: 'Activer la synchronisation' })).toHaveCount(0);
});

test('Lien d’invitation ouvert avant le branchement : message clair, sans plantage', async ({ page }) => {
  await page.goto('./#/rejoindre/AbCdEfGhIjKl.AAAAAAAAAAAAAAAAAAAAAA.' + 'a'.repeat(43));
  await expect(page.getByRole('heading', { level: 1, name: 'Rejoindre le foyer' })).toBeVisible();
  await expect(page.getByText(/pas encore branchée/)).toBeVisible();
  const resultats = await new AxeBuilder({ page }).analyze();
  expect(resultats.violations).toEqual([]);

  // Retour à Nid : premier lancement habituel.
  await page.getByRole('link', { name: 'Retour à Nid' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Bienvenue dans Nid' })).toBeVisible();
});
