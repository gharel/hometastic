import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { aller, enregistrer, ouvrirAjout } from './aide';

test('premier lancement : seul au départ, puis « Ajouter une personne » ; une tâche pour l’ado', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByLabel('Votre prénom').fill('Guillaume');
  // Aucun champ « autre personne » d’office.
  await expect(page.getByLabel(/^Prénom de la personne/)).toHaveCount(0);
  const ajouter = page.getByRole('button', { name: 'Ajouter une personne' });
  await ajouter.click();
  await expect(page.getByLabel('Prénom de la personne 2')).toBeFocused();
  await page.getByLabel('Prénom de la personne 2').fill('Hélène');
  await ajouter.click();
  await page.getByLabel('Prénom de la personne 3').fill('Léo');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Créer le foyer' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible();
  await expect(page.locator('.barre .duo .avatar')).toHaveText(['G', 'H', 'L']);

  await ouvrirAjout(page, 'Tâche');
  const feuille = page.getByRole('dialog');
  await feuille.getByLabel('Quoi').fill('Sortir les poubelles');
  await expect(feuille.getByRole('radio', { name: 'Tout le monde' })).toBeAttached();
  await feuille.getByRole('radio', { name: 'Léo' }).check();
  await enregistrer(page);

  await aller(page, 'À faire');
  const filtres = page.getByRole('group', { name: 'Filtrer les tâches' });
  await expect(filtres.getByRole('button')).toHaveText([
    'Tout',
    'Guillaume',
    'Hélène',
    'Léo',
    'Tout le monde',
    'Au premier libre',
  ]);
  await filtres.getByRole('button', { name: 'Léo' }).click();
  await expect(page.getByText('Sortir les poubelles')).toBeVisible();
  await expect(page.getByText('Pour Léo')).toBeAttached();
});

test('seul : le foyer se crée avec une personne', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Votre prénom').fill('Camille');
  await page.getByRole('button', { name: 'Créer le foyer' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible();
  await expect(page.locator('.barre .duo .avatar')).toHaveText(['C']);
});

test('colocation : quatre personnes, en retirer une puis en ajouter une', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Votre prénom').fill('Sam');
  const ajouter = page.getByRole('button', { name: 'Ajouter une personne' });
  for (const [n, prenom] of [
    [2, 'Alex'],
    [3, 'Charlie'],
    [4, 'Dominique'],
  ] as const) {
    await ajouter.click();
    await page.getByLabel(`Prénom de la personne ${n}`).fill(prenom);
  }
  const largeur = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(largeur).toBe(0);
  await page.getByRole('button', { name: 'Créer le foyer' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible();
  // En-tête : deux avatars puis « +2 ».
  await expect(page.locator('.barre .duo .avatar')).toHaveText(['S', 'A', '+2']);

  await aller(page, 'Nous');
  await expect(
    page.getByRole('group', { name: 'Membre qui utilise ce téléphone' }).getByRole('button'),
  ).toHaveCount(4);
  await page.getByRole('button', { name: 'Foyer', exact: true }).click();
  const feuille = page.getByRole('dialog');
  await expect(feuille.getByRole('button', { name: 'Retirer Sam' })).toHaveCount(0); // ce téléphone
  page.once('dialog', (d) => void d.accept());
  await feuille.getByRole('button', { name: 'Retirer Charlie' }).click();
  await feuille.getByRole('button', { name: 'Ajouter une personne' }).click();
  await feuille.getByLabel('Prénom de la personne 4').fill('Eden');
  expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([]);
  await enregistrer(page);
  await expect(
    page.getByRole('group', { name: 'Membre qui utilise ce téléphone' }).getByRole('button'),
  ).toHaveText(['SSam', 'AAlex', 'DDominique', 'EEden']);
});
