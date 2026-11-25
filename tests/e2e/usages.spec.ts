import { expect, test } from '@playwright/test';
import { aller, creerFoyer, dansJours, enregistrer, ouvrirAjout } from './aide';

test.beforeEach(async ({ page }) => {
  await creerFoyer(page);
});

test('Animal : fiche créée avec le modèle et ses soins récurrents', async ({ page }) => {
  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Animal' }).check();
  await page.getByLabel('Nom').fill('Filou');
  await page.getByLabel('Espèce').fill('Chat');
  await page.getByLabel('Vétérinaire').fill('Clinique du port');
  await expect(page.getByText(/Créer les échéances habituelles/)).toBeVisible();
  await enregistrer(page);

  await expect(page.getByRole('heading', { level: 1, name: 'Filou' })).toBeVisible();
  const soins = page.getByRole('region', { name: 'Soins à venir' });
  await expect(soins.getByText('Vermifuge (Filou)')).toBeVisible();
  await expect(soins.getByText('Vaccins chez le vétérinaire (Filou)')).toBeVisible();
  await expect(soins.getByText('Tous les 3 mois')).toBeVisible();

  // Un soin fait part au carnet de santé si on lui donne un coût, et se reprogramme.
  await soins.getByRole('button', { name: /^Vermifuge/ }).click();
  await page.getByLabel(/Montant/).fill('2500');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Terminer\u00a0: Vermifuge (Filou)' }).click();
  await expect(
    page.getByRole('region', { name: 'Carnet de santé' }).getByText('Vermifuge (Filou)'),
  ).toBeVisible();
  await expect(soins.getByText('Vermifuge (Filou)')).toBeVisible();
});

test('À voir : sortie avec billets à acheter, rappel en tâche, billets achetés', async ({ page }) => {
  await aller(page, 'Courses');
  await page.getByRole('link', { name: /À voir/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /À voir/ })).toBeVisible();

  const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
  await saisie.fill('Dune 3');
  await saisie.press('Enter');
  await expect(page.getByRole('region', { name: 'À voir un jour' }).getByText('Dune 3')).toBeVisible();

  await ouvrirAjout(page, 'À voir');
  await page.getByLabel('Quoi').fill('Concert au Dock');
  await page.getByRole('radio', { name: 'Concert' }).check();
  await page.getByLabel('Date (facultatif)').fill(dansJours(20));
  await page.getByRole('radio', { name: 'À acheter' }).check();
  await expect(page.getByLabel('Rappel : acheter les billets avant le')).toHaveValue(dansJours(6));
  await enregistrer(page);

  const prevu = page.getByRole('region', { name: 'Prévu' });
  await expect(prevu.getByText('Concert au Dock')).toBeVisible();
  await expect(prevu.getByText('Billets à acheter')).toBeVisible();

  await aller(page, 'À faire');
  await expect(page.getByText('Acheter les billets : Concert au Dock')).toBeVisible();
  await page.getByRole('button', { name: 'Terminer\u00a0: Acheter les billets : Concert au Dock' }).click();

  await aller(page, 'Courses');
  await page.getByRole('link', { name: /À voir/ }).click();
  await expect(page.getByRole('region', { name: 'Prévu' }).getByText('Billets achetés')).toBeVisible();

  await aller(page, 'Aujourd’hui');
  await expect(page.getByRole('region', { name: 'Bientôt' }).getByText('Concert au Dock')).toBeVisible();

  await aller(page, 'Courses');
  await page.getByRole('link', { name: /À voir/ }).click();
  await page.getByRole('button', { name: 'Marquer vu\u00a0: Dune 3' }).click();
  await page.getByText('Déjà vu (1)').click();
  await expect(page.getByRole('button', { name: 'Remettre à voir\u00a0: Dune 3' })).toBeVisible();
});

test('Finances : compte commun, virement mensuel avec montant, inscrit à l’historique', async ({ page }) => {
  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Compte' }).check();
  await page.getByLabel('Nom').fill('Compte commun');
  await page.getByLabel('Banque').fill('Banque du quartier');
  await page.getByLabel('Titulaires').fill('Alex et Sam');
  await enregistrer(page);

  const aFaire = page.getByRole('region', { name: 'Virements à faire' });
  await expect(aFaire.getByText('Virement vers le compte commun')).toBeVisible();
  await expect(aFaire.getByText('Tous les mois')).toBeVisible();

  // Montant à ajuster, puis échéance aujourd’hui pour le test.
  await aFaire.getByRole('button', { name: /^Virement vers le compte commun/ }).click();
  await page.getByLabel(/Montant/).fill('50000');
  const aujourdhui = dansJours(0);
  await page.getByLabel('Quand').fill(aujourdhui);
  await enregistrer(page);
  await expect(aFaire.getByText('50\u00a0000\u00a0F')).toBeVisible();

  await aller(page, 'Aujourd’hui');
  await page.getByRole('button', { name: 'Terminer\u00a0: Virement vers le compte commun' }).click();

  await aller(page, 'Foyer');
  await page.getByRole('link', { name: /Compte commun/ }).click();
  const faits = page.getByRole('region', { name: 'Virements faits' });
  await expect(faits.getByRole('button', { name: /^Virement vers le compte commun/ })).toContainText(
    '50\u00a0000\u00a0F',
  );
  await expect(
    page.getByRole('region', { name: 'Virements à faire' }).getByText(/Dans \d+\sj/),
  ).toBeVisible();

  // Raccourci « Virement » du bouton Ajouter : prérempli et rattaché au compte.
  await ouvrirAjout(page, 'Virement');
  await expect(page.getByLabel('Quoi')).toHaveValue('Virement vers compte commun');
  await expect(page.getByLabel('Rattachée à')).toHaveValue(/^f:/);
});
