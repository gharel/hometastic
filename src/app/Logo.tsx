/** Logo de Hometastic (spec 006) : maison crème, porte bleu nuit, deux étincelles miel. */
export function Logo({ classe = 'logo' }: { classe?: string }) {
  return (
    <svg class={classe} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="15" fill="#22416a" />
      <path d="M12 33 30 18l18 15v15a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z" fill="#f6f3ee" />
      <path d="M25 51V41a5 5 0 0 1 10 0v10z" fill="#22416a" />
      <path d="M48 8l2.2 5.8L56 16l-5.8 2.2L48 24l-2.2-5.8L40 16l5.8-2.2z" fill="#f2b33d" />
      <path d="M55 25l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#f2b33d" />
    </svg>
  );
}
