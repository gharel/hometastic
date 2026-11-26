import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { aller, creerFoyer } from './aide';

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1';
const TITRE = 'Installer Hometastic sur l’écran d’accueil';

test('installer : marche à suivre par le menu, « Plus tard », toujours dans Nous', async ({ page }) => {
  await creerFoyer(page);
  await expect(page).toHaveTitle('Aujourd’hui · Hometastic');
  const carte = page.getByRole('region', { name: TITRE });
  await expect(carte).toBeVisible();

  const installer = carte.getByRole('button', { name: 'Installer' });
  await expect(installer).toHaveAttribute('aria-expanded', 'false');
  await installer.click();
  await expect(installer).toHaveAttribute('aria-expanded', 'true');
  await expect(carte.getByText('Installer l’application')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await carte.getByRole('button', { name: 'Plus tard' }).click();
  await expect(carte).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible();
  await expect(page.getByRole('region', { name: TITRE })).toHaveCount(0);

  await aller(page, 'Nous');
  await expect(page.getByRole('region', { name: TITRE })).toBeVisible();
});

test('installer : la fenêtre du navigateur quand il la propose (Android)', async ({ page }) => {
  await creerFoyer(page);
  await page.evaluate(() => {
    const e = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    };
    e.prompt = async () => {
      (window as unknown as { fenetreOuverte: boolean }).fenetreOuverte = true;
    };
    e.userChoice = Promise.resolve({ outcome: 'accepted' });
    dispatchEvent(e);
  });
  const carte = page.getByRole('region', { name: TITRE });
  const installer = carte.getByRole('button', { name: 'Installer' });
  await expect(installer).not.toHaveAttribute('aria-expanded');
  await installer.click();
  await expect(carte).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { fenetreOuverte?: boolean }).fenetreOuverte)).toBe(
    true,
  );
});

test.describe('iPhone', () => {
  test.use({ userAgent: IPHONE });

  test('installer : par Partager, et avant de saisir au premier lancement', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1, name: 'Bienvenue dans Hometastic' })).toBeVisible();
    const carte = page.getByRole('region', { name: TITRE });
    await expect(carte.getByText(/installez-la avant de commencer/)).toBeVisible();
    await carte.getByRole('button', { name: 'Installer' }).click();
    await expect(carte.getByText('Sur l’écran d’accueil', { exact: true })).toBeVisible();
    await expect(carte.getByText('Ajouter', { exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
});

test.describe('déjà installée', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
  });

  test('aucune carte ; Nous indique que l’app est installée', async ({ page }) => {
    await creerFoyer(page);
    await expect(page.getByRole('region', { name: TITRE })).toHaveCount(0);
    await aller(page, 'Nous');
    await expect(page.getByText('Hometastic est installée sur ce téléphone.')).toBeVisible();
  });
});
