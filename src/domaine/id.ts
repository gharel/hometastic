/** Identifiant unique, utilisable hors ligne et sans collision entre les deux téléphones. */
export const nouvelId = (): string => crypto.randomUUID();
