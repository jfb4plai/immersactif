// Pied de page PLAI : rattachement institutionnel + contact (mailto), aligné
// sur la convention des apps du portail PLAI.
export function PlaiFooter() {
  return (
    <footer className="mt-8 space-y-1 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
      <p>ImmersActif — Pôle Territorial de la Ville de Liège (Fédération Wallonie-Bruxelles)</p>
      <p>
        <a
          href="mailto:jeanfrancois.beguin@ens.ecl.be"
          className="text-plai-teal underline underline-offset-2"
        >
          jeanfrancois.beguin@ens.ecl.be
        </a>
      </p>
    </footer>
  )
}
