import { expect, test } from '@playwright/test';
import { aller, aujourdhui, creerFoyer, dansJours, enregistrer, ouvrirAjout } from './aide';

test.beforeEach(async ({ page }) => {
  await creerFoyer(page);
});

test('Liste : courses à tuiles, cocher, remettre, liste à cocher', async ({ page }) => {
  await aller(page, 'Courses');
  const saisie = page.getByRole('textbox', { name: 'Ajouter un article' });
  await saisie.fill('2 l lait');
  await saisie.press('Enter');
  const aAcheter = (nom: string) => page.locator(`.tuile.sur-liste[data-article="${nom}"]`);
  await expect(aAcheter('Lait')).toContainText(/Lait\s*2\sl/);
  await expect(aAcheter('Lait')).toHaveAccessibleName(/Lait.*cocher/);
  await expect(page.getByRole('heading', { name: 'Crèmerie et œufs 1' })).toBeVisible();

  await saisie.fill('ban');
  await page.getByRole('button', { name: 'Bananes', exact: true }).click();
  await expect(aAcheter('Bananes')).toBeVisible();

  // Un article inconnu du catalogue reçoit une pastille et va en « Divers ».
  await saisie.fill('Bougie anniversaire');
  await saisie.press('Enter');
  await expect(page.getByRole('heading', { name: 'Divers 1' })).toBeVisible();

  await aAcheter('Lait').click();
  const recent = page.locator('.tuile.recente[data-article="Lait"]');
  await expect(recent).toHaveAccessibleName(/remettre sur la liste/);
  await recent.click();
  await expect(aAcheter('Lait')).toBeVisible();

  // Mode modification : précision et urgence.
  await page.getByRole('button', { name: 'Modifier les articles' }).click();
  await page.locator('.tuile[data-article="Bananes"]').click();
  await page.getByLabel('Quantité ou précision').fill('x6');
  await page.getByLabel('Urgent').check();
  await enregistrer(page);
  await page.getByRole('button', { name: 'Terminer' }).click();
  await expect(aAcheter('Bananes')).toContainText('x6');
  await expect(aAcheter('Bananes')).toContainText('Urgent');

  // Liste à cocher.
  await page.getByRole('button', { name: 'Liste', exact: true }).first().click();
  await page.getByLabel('Nom').fill('Valise d’Hélène');
  await page.getByRole('radio', { name: 'À cocher (valise, préparatifs)' }).check();
  await enregistrer(page);
  await expect(page.getByRole('heading', { level: 1, name: /Valise d’Hélène/ })).toBeVisible();
  for (const element of ['Maillot', 'Crème solaire']) {
    await page.getByRole('textbox', { name: 'Ajouter un article' }).fill(element);
    await page.getByRole('textbox', { name: 'Ajouter un article' }).press('Enter');
  }
  await page.getByRole('button', { name: 'Cocher : Maillot' }).click();
  await expect(page.getByRole('heading', { name: '1 sur 2' })).toBeVisible();
});

test('Tâche : création, récurrence, assignation, filtre', async ({ page }) => {
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Payer la facture d’eau');
  await page.getByLabel('Quand').fill(aujourdhui());
  await page.getByRole('radio', { name: 'Hélène' }).check();
  await page.getByLabel('Répéter').selectOption('mois');
  await enregistrer(page);

  await expect(page.getByRole('button', { name: /^Payer la facture d’eau/ })).toBeVisible();
  await aller(page, 'À faire');
  const groupeJour = page.getByRole('region', { name: 'Aujourd’hui' });
  await expect(groupeJour.getByText('Payer la facture d’eau')).toBeVisible();
  await expect(groupeJour.getByText('Tous les mois')).toBeVisible();

  // Filtre : visible pour Hélène, pas pour Guillaume seul.
  await page.getByRole('button', { name: 'Guillaume', exact: true }).click();
  await expect(page.getByText('Payer la facture d’eau')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hélène', exact: true }).click();
  await expect(page.getByText('Payer la facture d’eau')).toBeVisible();
  await page.getByRole('button', { name: 'Tout', exact: true }).click();

  // Terminer une tâche récurrente : elle repart le mois prochain.
  await page.getByRole('button', { name: 'Terminer : Payer la facture d’eau' }).click();
  await expect(page.getByRole('region', { name: 'Aujourd’hui' })).toHaveCount(0);
  await expect(
    page.getByRole('region', { name: 'Plus tard' }).getByText('Payer la facture d’eau'),
  ).toBeVisible();

  // Tâche simple : faite puis rouverte.
  await ouvrirAjout(page, 'Tâche');
  await page.getByLabel('Quoi').fill('Sortir les poubelles');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Terminer : Sortir les poubelles' }).click();
  await page.getByText('Faites récemment (1)').click();
  await page.getByRole('button', { name: 'Rouvrir : Sortir les poubelles' }).click();
  await expect(page.getByRole('region', { name: 'Un jour' }).getByText('Sortir les poubelles')).toBeVisible();
});

test('Fiche : véhicule (kilométrage, échéance au km, historique) et personne (santé chiffrée)', async ({
  page,
}) => {
  await aller(page, 'Foyer');
  await page.getByRole('button', { name: 'Fiche', exact: true }).click();
  await page.getByRole('radio', { name: 'Véhicule' }).check();
  await page.getByLabel('Nom').fill('Voiture de Guillaume');
  await page.getByLabel('Modèle', { exact: true }).fill('Citadine');
  // Ce test crée lui-même ses échéances : sans le modèle « Véhicule ».
  await page.getByRole('checkbox', { name: /Créer les échéances habituelles/ }).uncheck();
  await page.getByLabel('Kilométrage actuel').fill('48250');
  await enregistrer(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Voiture de Guillaume' })).toBeVisible();
  await expect(page.getByText('48 250 km')).toBeVisible();

  await page.getByRole('button', { name: 'Échéance' }).click();
  await page.getByLabel('Quoi').fill('Vidange');
  await page.getByLabel('Répéter').selectOption('km');
  await page.getByLabel('Tous les (km)').fill('15000');
  await enregistrer(page);
  await expect(page.getByText('Dans 15 000 km')).toBeVisible();

  await page.getByRole('button', { name: 'Mettre à jour' }).click();
  await page.getByLabel('Compteur (km)').fill('63400');
  await enregistrer(page);
  await expect(page.getByText('Dépassé de 150 km')).toBeVisible();

  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await page.getByLabel('Quoi').fill('Plaquettes avant');
  await page.getByLabel(/Coût/).fill('22000');
  await page.getByLabel('Qui est intervenu').fill('Garage du centre');
  await enregistrer(page);
  await expect(page.getByRole('button', { name: /Plaquettes avant/ })).toContainText('22 000 F');
  await expect(page.getByText(/Dépensé en \d{4}/)).toBeVisible();

  // Personne : santé chiffrée avant d’être enregistrée.
  await page.getByRole('link', { name: 'Foyer' }).first().click();
  await page.getByRole('button', { name: 'Fiche', exact: true }).click();
  await page.getByRole('radio', { name: 'Personne' }).check();
  await page.getByLabel('Nom').fill('Léo');
  await enregistrer(page);
  await page.getByRole('region', { name: 'Santé' }).getByRole('button', { name: 'Modifier' }).click();
  await page.getByLabel('Allergies').fill('Arachide');
  await enregistrer(page);
  await expect(page.getByText('Arachide')).toBeVisible();

  await page.getByRole('button', { name: 'Échéance' }).click();
  await page.getByLabel('Quoi').fill('Pédiatre');
  await page.getByLabel('Quand').fill(dansJours(10));
  await enregistrer(page);
  await expect(page.getByText('Pédiatre')).toBeVisible();

  const brut = await page.evaluate(
    () =>
      new Promise<string>((ok, ko) => {
        const req = indexedDB.open('nid');
        req.onerror = () => ko(req.error);
        req.onsuccess = () => {
          const base = req.result;
          const tr = base.transaction(['fiches', 'taches'], 'readonly');
          const f = tr.objectStore('fiches').getAll();
          const t = tr.objectStore('taches').getAll();
          tr.oncomplete = () => ok(JSON.stringify([f.result, t.result]));
        };
      }),
  );
  expect(brut).toContain('Léo');
  expect(brut).not.toContain('Arachide');
  expect(brut).not.toContain('Pédiatre');

  // « Bientôt » sur Aujourd’hui reprend le rendez-vous de la fiche.
  await aller(page, 'Aujourd’hui');
  await expect(page.getByRole('region', { name: 'Bientôt' }).getByText('Pédiatre')).toBeVisible();
});

test('Projet : voyage avec tâches, liste rattachée, budget ; données conservées au rechargement', async ({
  page,
}) => {
  await ouvrirAjout(page, 'Projet');
  await page.getByRole('radio', { name: 'Voyage' }).check();
  await page.getByLabel('Nom').fill('Vacances aux îles');
  await page.getByLabel('Destination').fill('Lifou');
  await page.getByLabel('Début').fill(dansJours(25));
  await page.getByLabel('Fin').fill(dansJours(39));
  await page.getByLabel(/Budget prévu/).fill('350000');
  await enregistrer(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Vacances aux îles' })).toBeVisible();
  await expect(page.getByText(/Dans 25\sj/)).toBeVisible();

  await page.getByRole('button', { name: 'Tâche', exact: true }).click();
  await page.getByLabel('Quoi').fill('Vérifier les passeports');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Tâche', exact: true }).click();
  await page.getByLabel('Quoi').fill('Réserver l’hébergement');
  await enregistrer(page);
  await page.getByRole('button', { name: 'Terminer : Réserver l’hébergement' }).click();
  await expect(page.getByText('1 sur 2')).toBeVisible();

  await page.getByRole('button', { name: 'Dépense', exact: true }).click();
  await page.getByLabel('Quoi').fill('Billets d’avion');
  await page.getByLabel(/Montant/).fill('150000');
  await enregistrer(page);
  await expect(page.getByText('Dépensé 150 000 F')).toBeVisible();

  await page.getByRole('region', { name: 'Listes' }).getByRole('button', { name: 'Liste' }).click();
  await page.getByLabel('Nom').fill('Valise de Guillaume');
  await enregistrer(page);
  await expect(page.getByRole('link', { name: /Valise de Guillaume/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Vacances aux îles' })).toBeVisible();
  await expect(page.getByText('Dépensé 150 000 F')).toBeVisible();
  await aller(page, 'Foyer');
  await expect(page.getByRole('link', { name: /Vacances aux îles/ })).toBeVisible();
});
