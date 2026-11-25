import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { aller, aujourdhui, creerFoyer, dansJours, enregistrer, ouvrirAjout } from './aide';

/** Un foyer fictif avec au moins un élément de chaque brique. */
async function remplir(page: Page) {
  await creerFoyer(page);
  await aller(page, 'Courses');
  for (const a of ['2 l lait', 'bananes', 'pain', 'café', 'yaourts']) {
    await page.getByRole('textbox', { name: 'Ajouter un article' }).fill(a);
    await page.getByRole('textbox', { name: 'Ajouter un article' }).press('Enter');
  }
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Payer la facture d’eau');
  await page.getByLabel('Quand').fill(aujourdhui());
  await enregistrer(page);
  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Véhicule' }).check();
  await page.getByLabel('Nom').fill('Voiture de Guillaume');
  await page.getByLabel('Kilométrage actuel').fill('48250');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Échéance' }).click();
  await page.getByLabel('Quoi').fill('Contrôle technique');
  await page.getByLabel('Quand').fill(dansJours(12));
  await enregistrer(page);
  await ouvrirAjout(page, 'Projet');
  await page.getByLabel('Nom').fill('Vacances aux îles');
  await page.getByLabel('Début').fill(dansJours(25));
  await enregistrer(page);
}

const ECRANS = ['Aujourd’hui', 'Courses', 'À faire', 'Foyer', 'Nous'] as const;

for (const theme of ['light', 'dark'] as const) {
  test(`écrans sans erreur d’accessibilité ni débordement (${theme})`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: theme });
    await remplir(page);
    const vues: string[] = [...ECRANS];
    for (const ecran of ECRANS) {
      await aller(page, ecran);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await controler(page, `${ecran}-${theme}`, info.project.name);
    }
    // Détail d’une fiche et d’un projet.
    await aller(page, 'Foyer');
    await page.getByRole('link', { name: /Voiture de Guillaume/ }).click();
    await controler(page, `fiche-${theme}`, info.project.name);
    await aller(page, 'Foyer');
    await page.getByRole('link', { name: /Vacances aux îles/ }).click();
    await controler(page, `projet-${theme}`, info.project.name);
    // Une feuille ouverte.
    await ouvrirAjout(page, 'Tâche');
    await controler(page, `feuille-${theme}`, info.project.name);
    expect(vues.length).toBe(5);
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`usages : à voir, compte, animal (${theme})`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: theme });
    await creerFoyer(page);
    await ouvrirAjout(page, 'À voir');
    await page.getByLabel('Quoi').fill('Concert au Dock');
    await page.getByRole('radio', { name: 'Concert' }).check();
    await page.getByLabel('Date (facultatif)').fill(dansJours(20));
    await page.getByRole('radio', { name: 'À acheter' }).check();
    await enregistrer(page);
    await aller(page, 'Courses');
    await page.getByRole('link', { name: /À voir/ }).click();
    const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
    for (const s of ['Dune 3', 'Série The Bear saison 4', 'Expo photo au musée']) {
      await saisie.fill(s);
      await saisie.press('Enter');
    }
    await controler(page, `a-voir-${theme}`, info.project.name);

    await ouvrirAjout(page, 'Fiche');
    await page.getByRole('radio', { name: 'Compte' }).check();
    await page.getByLabel('Nom').fill('Compte commun');
    await enregistrer(page);
    await controler(page, `compte-${theme}`, info.project.name);

    await ouvrirAjout(page, 'Fiche');
    await page.getByRole('radio', { name: 'Animal' }).check();
    await page.getByLabel('Nom').fill('Rookie');
    await page.getByLabel('Espèce').fill('Chien');
    await enregistrer(page);
    await controler(page, `animal-${theme}`, info.project.name);

    await ouvrirAjout(page, 'Fiche');
    await controler(page, `nouvelle-fiche-${theme}`, info.project.name);
  });
}

async function controler(page: Page, nom: string, projet: string) {
  await page.evaluate(() => document.fonts.ready);
  const debord = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(debord, `${nom} : débordement horizontal`).toBeLessThanOrEqual(0);
  const resultats = await new AxeBuilder({ page }).analyze();
  expect(
    resultats.violations.map((v) => `${v.id} : ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    nom,
  ).toEqual([]);
  const fichier = nom
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w-]+/g, '-')
    .toLowerCase();
  await page.screenshot({ path: `docs/captures/app-${projet}-${fichier}.png` });
}
