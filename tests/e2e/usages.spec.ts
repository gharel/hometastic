import { expect, test } from '@playwright/test';
import { aller, creerFoyer, dansJours, enregistrer, ouvrirAjout } from './aide';

test.beforeEach(async ({ page }) => {
  await creerFoyer(page);
});

test('Animal : fiche créée avec le modèle et ses soins récurrents', async ({ page }) => {
  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Animal' }).check();
  await page.getByLabel('Nom').fill('Martine');
  await page.getByLabel('Espèce').fill('Chatte');
  await page.getByLabel('Vétérinaire').fill('Clinique du port');
  await expect(page.getByText(/Créer les échéances habituelles/)).toBeVisible();
  await enregistrer(page);

  await expect(page.getByRole('heading', { level: 1, name: 'Martine' })).toBeVisible();
  const soins = page.getByRole('region', { name: 'Soins à venir' });
  await expect(soins.getByText('Vermifuge (Martine)')).toBeVisible();
  await expect(soins.getByText('Vaccins chez le vétérinaire (Martine)')).toBeVisible();
  await expect(soins.getByText('Tous les 3 mois')).toBeVisible();

  // Un soin fait part au carnet de santé si on lui donne un coût, et se reprogramme.
  await soins.getByRole('button', { name: /^Vermifuge/ }).click();
  await page.getByLabel(/Montant/).fill('2500');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Terminer\u00a0: Vermifuge (Martine)' }).click();
  await expect(
    page.getByRole('region', { name: 'Carnet de santé' }).getByText('Vermifuge (Martine)'),
  ).toBeVisible();
  await expect(soins.getByText('Vermifuge (Martine)')).toBeVisible();
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
  await page.getByLabel('Titulaires').fill('Guillaume et Hélène');
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

test('Véhicules : voiture et moto, chacune avec ses échéances habituelles', async ({ page }) => {
  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Véhicule' }).check();
  await page.getByRole('radio', { name: 'Moto' }).check();
  await page.getByLabel('Nom').fill('Moto de Guillaume');
  await page.getByLabel('Kilométrage actuel').fill('12000');
  await expect(page.getByText(/modèle «\sMoto\s»/)).toBeVisible();
  await enregistrer(page);
  const aFaire = page.getByRole('region', { name: 'À faire' });
  await expect(aFaire.getByText('Graisser et tendre la chaîne')).toBeVisible();
  await expect(aFaire.getByText(/Dans 1\s000\skm/)).toBeVisible();
  await expect(aFaire.getByText(/Dans 6\s000\skm/)).toBeVisible();

  await ouvrirAjout(page, 'Fiche');
  await page.getByRole('radio', { name: 'Véhicule' }).check();
  await page.getByLabel('Nom').fill('Voiture d’Hélène');
  await page.getByLabel('Kilométrage actuel').fill('48250');
  await enregistrer(page);
  await expect(page.getByRole('region', { name: 'À faire' }).getByText('Vérifier les pneus')).toBeVisible();

  await aller(page, 'Foyer');
  await expect(page.getByRole('link', { name: /Moto de Guillaume/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Voiture d’Hélène/ })).toBeVisible();
});

test('Courses : modifier un article par appui long (nom, liste, quantité)', async ({ page }) => {
  await aller(page, 'Courses');
  const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
  await saisie.fill('lait');
  await saisie.press('Enter');
  const tuile = page.locator('.tuile.sur-liste[data-article="Lait"]');
  await tuile.click({ button: 'right' });
  await expect(page.getByRole('dialog', { name: 'Modifier l’article' })).toBeVisible();
  await page.getByLabel('Nom').fill('Beurre');
  await page.getByLabel('Quantité ou précision').fill('x2');
  await enregistrer(page);
  await expect(page.locator('.tuile.sur-liste[data-article="Beurre"]')).toContainText('x2');
  await expect(page.locator('.tuile.sur-liste[data-article="Lait"]')).toHaveCount(0);

  // Une tâche se modifie en touchant son texte.
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Vaisselle');
  await enregistrer(page);
  await aller(page, 'À faire');
  await page.getByRole('button', { name: /^Vaisselle/ }).click();
  await expect(page.getByRole('dialog', { name: 'Modifier la tâche' })).toBeVisible();
  await page.getByLabel('Quoi').fill('Vider le lave-vaisselle');
  await enregistrer(page);
  await expect(page.getByText('Vider le lave-vaisselle')).toBeVisible();
});
