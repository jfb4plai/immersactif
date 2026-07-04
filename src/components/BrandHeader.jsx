// Bandeau de marque PLAI : logo + nom de l'app en DM Serif Display (police de
// titre du portail PLAI). Volontairement discret pour ne pas concurrencer
// l'expérience immersive — présent sur l'écran d'entrée et le hub.
export function BrandHeader() {
  return (
    <header className="flex items-center gap-3">
      <img src="/plai-logo.jpg" alt="Logo PLAI" className="h-8 w-8 shrink-0 rounded" />
      <span className="font-brand text-xl text-plai-teal">ImmersActif</span>
      <span className="ml-auto text-right text-xs leading-tight text-slate-400">
        Pôle Territorial
        <br />
        Ville de Liège
      </span>
    </header>
  )
}
