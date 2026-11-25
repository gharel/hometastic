import { expect, type Page } from '@playwright/test';

export const aujourdhui = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const dansJours = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Premier lancement : crée le foyer « Alex et Sam » (données fictives). */
export async function creerFoyer(page: Page) {
  await page.goto('./');
  await page.getByLabel('Votre prénom').fill('Alex');
  await page.getByLabel('Prénom de l’autre personne du foyer').fill('Sam');
  await page.getByRole('button', { name: 'Créer le foyer' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible();
}

export async function ouvrirAjout(
  page: Page,
  brique: 'Article' | 'Tâche' | 'Fiche' | 'Projet' | 'À voir' | 'Virement',
) {
  await page.getByRole('button', { name: 'Ajouter un article, une tâche, une fiche ou un projet' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: new RegExp(`^${brique}`) })
    .click();
}

export async function enregistrer(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

export async function aller(page: Page, onglet: 'Aujourd’hui' | 'Courses' | 'À faire' | 'Foyer' | 'Nous') {
  await page
    .getByRole('navigation', { name: 'Navigation principale' })
    .getByRole('link', { name: onglet, exact: true })
    .click();
}
