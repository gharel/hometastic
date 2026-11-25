import '@fontsource-variable/dm-sans';
import './styles/nid.css';
import './styles/app.css';
import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import { Coque } from './app/Coque';
import { demarrer, route } from './app/etat';
import { installerSprite } from './app/icones';
import { lireAncre } from './app/routage';
import { demarrerTypographie } from './app/typographie-dom';
import { Depot } from './donnees/depot';
import { StockageMemoire, type Stockage } from './donnees/stockage';
import { StockageDexie } from './donnees/stockage-dexie';

const montage = document.getElementById('app');
if (!montage) throw new Error('Point de montage #app introuvable');

installerSprite();
route.value = lireAncre(location.hash);
addEventListener('hashchange', () => {
  route.value = lireAncre(location.hash);
});

render(<Coque />, montage);
demarrerTypographie(montage);

function choisirStockage(): Stockage {
  // IndexedDB absent (navigation très privée) : l’app reste utilisable, sans conserver les données.
  return typeof indexedDB === 'undefined' ? new StockageMemoire() : new StockageDexie();
}

void demarrer(new Depot(choisirStockage()));

// Hors ligne : l’app est mise en cache ; une nouvelle version s’installe d’elle-même.
registerSW({ immediate: true });
