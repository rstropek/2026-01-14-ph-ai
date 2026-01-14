'use client'

import { useRouter } from 'next/navigation'

type Klasse = {
  id: number
  schuljahr: string
  bezeichnung: string
  fach: string
  _count: {
    schueler: number
  }
}

type Props = {
  klassen: Klasse[]
  schuljahre: string[]
  currentFilter?: string
}

export function KlassenListe({ klassen, schuljahre, currentFilter }: Props) {
  const router = useRouter()

  const handleFilterChange = (schuljahr: string) => {
    if (schuljahr === 'alle') {
      router.push('/klassen')
    } else {
      router.push(`/klassen?schuljahr=${schuljahr}`)
    }
  }

  return (
    <div>
      {schuljahre.length > 0 && (
        <div className="mb-6">
          <label htmlFor="schuljahr-filter" className="block text-sm font-medium mb-2">
            Filtern nach Schuljahr:
          </label>
          <select
            id="schuljahr-filter"
            value={currentFilter || 'alle'}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="alle">Alle Schuljahre</option>
            {schuljahre.map((sj) => (
              <option key={sj} value={sj}>
                {sj}
              </option>
            ))}
          </select>
        </div>
      )}

      {klassen.length === 0 ? (
        <p className="text-gray-500">Noch keine Klassen vorhanden.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {klassen.map((klasse) => (
            <div
              key={klasse.id}
              className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/klassen/${klasse.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{klasse.bezeichnung}</h2>
                <span className="text-sm text-gray-500">{klasse.schuljahr}</span>
              </div>
              <p className="text-gray-700 mb-3">{klasse.fach}</p>
              <p className="text-sm text-gray-500">
                {klasse._count.schueler} Schüler:in{klasse._count.schueler !== 1 ? 'nen' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
