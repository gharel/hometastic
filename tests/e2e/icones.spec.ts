import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { aller, creerFoyer, enregistrer, ouvrirAjout } from './aide';

test.beforeEach(async ({ page }) => {
  await creerFoyer(page);
});

async function ajouter(page: Page, texte: string) {
  const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
  await saisie.fill(texte);
  await saisie.press('Enter');
}

const tuile = (page: Page, nom: string) => page.locator(`.tuile.sur-liste[data-article="${nom}"]`);

test('Article : « Modifier les articles », icône et rayon changés puis retenus', async ({ page }) => {
  await aller(page, 'Courses');
  await ajouter(page, 'mastic');
  await expect(tuile(page, 'Mastic').locator('use')).toHaveAttribute('href', '#f-nid-mastic');

  // Mode modification bien visible : un crayon sur chaque article.
  await page.getByRole('button', { name: 'Modifier les articles' }).click();
  await expect(tuile(page, 'Mastic').locator('.tuile-crayon')).toBeVisible();
  await tuile(page, 'Mastic').click();
  const feuille = page.getByRole('dialog', { name: 'Modifier l’article' });
  await expect(feuille).toBeVisible();

  // Choisir une autre icône parmi toutes, en cherchant.
  await feuille.getByRole('button', { name: 'Changer l’icône' }).click();
  await feuille.getByRole('searchbox', { name: 'Chercher une icône' }).fill('pistolet silicone colle');
  await expect(feuille.getByText(/Aucune icône/)).toBeVisible();
  await feuille.getByRole('searchbox', { name: 'Chercher une icône' }).fill('colle');
  await feuille.getByRole('button', { name: 'Colle', exact: true }).click();
  await feuille.getByLabel('Rayon').selectOption({ label: 'Divers' });
  await expect(feuille.getByText(/Nid s’en souviendra/)).toBeVisible();
  await enregistrer(page);

  await expect(tuile(page, 'Mastic').locator('use')).toHaveAttribute('href', '#f-nid-colle');
  await expect(page.getByRole('region', { name: /^Divers/ }).getByText('Mastic')).toBeVisible();

  // Supprimé puis rajouté : l’icône et le rayon choisis reviennent.
  await tuile(page, 'Mastic').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Supprimer' }).click();
  await expect(tuile(page, 'Mastic')).toHaveCount(0);
  await page.getByRole('button', { name: 'Terminer' }).click();
  await ajouter(page, 'mastic');
  await expect(tuile(page, 'Mastic').locator('use')).toHaveAttribute('href', '#f-nid-colle');
  await expect(page.getByRole('region', { name: /^Divers/ }).getByText('Mastic')).toBeVisible();
});

test('Appui long au doigt : la modification s’ouvre au relâcher et reste ouverte', async ({ page }) => {
  await aller(page, 'Courses');
  await ajouter(page, 'vis');
  const t = tuile(page, 'Vis');
  await t.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true });
  await page.waitForTimeout(650);
  await expect(t).toHaveClass(/appui-long/);
  await t.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true });
  await t.dispatchEvent('click');
  const feuille = page.getByRole('dialog', { name: 'Modifier l’article' });
  await expect(feuille).toBeVisible();
  await page.waitForTimeout(400);
  await expect(feuille).toBeVisible();
  await feuille.getByRole('button', { name: 'Fermer' }).click();
  // Le clic qui suit l’appui long n’a pas coché l’article.
  await expect(tuile(page, 'Vis')).toBeVisible();
});

test('Tâche et élément de liste : un crayon visible pour modifier', async ({ page }) => {
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Changer le joint du robinet');
  await enregistrer(page);
  await aller(page, 'À faire');
  await page.getByRole('button', { name: 'Modifier : Changer le joint du robinet' }).click();
  await expect(page.getByRole('dialog', { name: 'Modifier la tâche' })).toBeVisible();
  await page.getByLabel('Quoi').fill('Changer le joint de la douche');
  await enregistrer(page);
  await expect(page.getByText('Changer le joint de la douche')).toBeVisible();
});

test('Toutes les icônes : galerie par rayon, recherche, ajout d’un geste', async ({ page }) => {
  await aller(page, 'Courses');
  await page.getByRole('link', { name: 'Toutes les icônes du catalogue' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Toutes les icônes' })).toBeVisible();

  const bricolage = page.getByRole('region', { name: /^Bricolage et maison/ });
  for (const nom of ['Vis', 'Clous', 'Chevilles', 'Colle', 'Mastic', 'Bois', 'Embouts', 'Grille'])
    await expect(bricolage.getByRole('button', { name: nom, exact: true })).toBeVisible();
  const beaute = page.getByRole('region', { name: /^Hygiène et beauté/ });
  for (const nom of ['Déodorant', 'Mascara', 'Parfum', 'Cotons-tiges'])
    await expect(beaute.getByRole('button', { name: nom, exact: true })).toBeVisible();

  const resultats = await new AxeBuilder({ page }).analyze();
  expect(resultats.violations).toEqual([]);

  await page.getByRole('searchbox', { name: 'Chercher une icône' }).fill('scotch');
  await expect(page.getByRole('button', { name: 'Ruban adhésif', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Vis', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Ruban adhésif', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Ruban adhésif ajouté');

  await page.getByRole('link', { name: 'Supermarché' }).click();
  await expect(tuile(page, 'Ruban adhésif')).toBeVisible();
});
