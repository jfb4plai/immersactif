export function EthicalBanner({ compact = false }) {
  return (
    <div className={`rounded-lg border-l-4 border-plai-orange bg-orange-50 p-4 ${compact ? 'text-sm' : ''}`}>
      <p className="read">
        <strong>Aucune simulation ne fait vivre le TSA.</strong> Cette expérience approche
        certains mécanismes (filtrage sensoriel, implicite, imprévisibilité) pour vous aider à
        ajuster vos gestes professionnels. Le spectre autistique est large : il s'agit de
        situations, jamais d'un portrait d'élève.
      </p>
    </div>
  )
}
