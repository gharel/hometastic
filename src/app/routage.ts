/** Routes de l’app, portées par l’ancre (« #/fiche/abc ») : pas de serveur nécessaire, compatible GitHub Pages. */
export type Route =
  | { ecran: 'aujourdhui' }
  | { ecran: 'courses'; id?: string | undefined }
  | { ecran: 'a-faire' }
  | { ecran: 'foyer' }
  | { ecran: 'fiche'; id: string }
  | { ecran: 'projet'; id: string }
  | { ecran: 'nous' }
  | { ecran: 'analyse'; id?: string | undefined }
  | { ecran: 'rejoindre'; code: string }
  | { ecran: 'catalogue'; id?: string | undefined };

export type Onglet = 'aujourdhui' | 'courses' | 'a-faire' | 'foyer' | 'nous';

export function lireAncre(ancre: string): Route {
  const [ecran = '', id] = ancre.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  switch (ecran) {
    case 'courses':
      return { ecran: 'courses', id: id || undefined };
    case 'a-faire':
    case 'foyer':
    case 'nous':
      return { ecran };
    case 'fiche':
    case 'projet':
      return id ? { ecran, id } : { ecran: 'foyer' };
    case 'analyse':
      return { ecran: 'analyse', id: id && /^\d{4}-\d{2}$/.test(id) ? id : undefined };
    case 'rejoindre':
      return { ecran: 'rejoindre', code: id ?? '' };
    case 'catalogue':
      return { ecran: 'catalogue', id: id || undefined };
    default:
      return { ecran: 'aujourdhui' };
  }
}

export function ancre(route: Route): string {
  switch (route.ecran) {
    case 'courses':
      return route.id ? `#/courses/${encodeURIComponent(route.id)}` : '#/courses';
    case 'catalogue':
      return route.id ? `#/catalogue/${encodeURIComponent(route.id)}` : '#/catalogue';
    case 'analyse':
      return route.id ? `#/analyse/${route.id}` : '#/analyse';
    case 'rejoindre':
      return `#/rejoindre/${route.code}`;
    case 'fiche':
    case 'projet':
      return `#/${route.ecran}/${encodeURIComponent(route.id)}`;
    default:
      return `#/${route.ecran}`;
  }
}

export function ongletDe(route: Route): Onglet {
  if (route.ecran === 'fiche' || route.ecran === 'projet') return 'foyer';
  if (route.ecran === 'catalogue') return 'courses';
  if (route.ecran === 'analyse' || route.ecran === 'rejoindre') return 'nous';
  return route.ecran;
}

export const TITRES: Record<Onglet, string> = {
  aujourdhui: 'Aujourd’hui',
  courses: 'Courses',
  'a-faire': 'À faire',
  foyer: 'Foyer',
  nous: 'Nous',
};
