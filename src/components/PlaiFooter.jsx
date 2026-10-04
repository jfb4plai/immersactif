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
      <p>
        Code :{' '}
        <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          PolyForm Noncommercial 1.0.0
        </a>
        {' · '}Contenus :{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          CC BY-NC-SA 4.0
        </a>
        {' · '}Jean-François Beguin, jfb4plai.com
      </p>
    </footer>
  )
}
