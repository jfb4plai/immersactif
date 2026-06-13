export const REFERENCES = {
  schuhl2020: { authors: 'Schuhl', year: 2020, rissId: 'tel-03795280', note: 'éthique des simulations / risque de pitié' },
  adrian2021: { authors: 'Adrian', year: 2021, rissId: 'dumas-03279190', note: 'sensibilisation par simulation' },
  chataignon2023: { authors: 'Chataignon', year: 2023, rissId: 'dumas-04905925', note: 'traitement sensoriel' },
  fino2017: { authors: 'Fino', year: 2017, rissId: 'dumas-01562085', note: 'particularités sensorielles' },
  dubreuil2019: { authors: 'Dubreuil', year: 2019, rissId: 'dumas-02178074', note: 'particularités sensorielles' },
  petit2023: { authors: 'Petit', year: 2023, rissId: 'tel-04575648', note: 'littéralité nuancée' },
  girard2022: { authors: 'Girard et al.', year: 2022, rissId: 'hal-03816069', note: 'langage figuré / inférences' },
  durand2018: { authors: 'Durand', year: 2018, rissId: 'dumas-02114337', note: 'actes indirects de langage' },
  braida2025: { authors: 'Braida-Bardinaud', year: 2025, rissId: 'dumas-05344623', note: 'routines / DSM-5' },
  aubineau2019: { authors: 'Aubineau', year: 2019, rissId: 'hal-02388518', note: 'vécu élèves TSA secondaire' },
  vallelian2022: { authors: 'Vallélian', year: 2022, rissId: 'W4220658962', note: 'habiletés sociales' },
  passages2024: { authors: 'Projet Passages', year: 2024, rissId: 'hal-05158229', note: 'accompagnement social' },
  meyer2022: { authors: 'Meyer et al.', year: 2022, rissId: 'hal-03900700', note: 'outils numériques inclusion TSA' },
}

export function formatRef(id) {
  const r = REFERENCES[id]
  if (!r) return ''
  return `${r.authors} (${r.year})`
}
