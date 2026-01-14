'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Schueler {
  id: number
  vorname: string
  nachname: string
}

interface Testergebnis {
  schuelerId: number
  prozentwert: string
  anmerkung: string
}

interface ErfassenFormProps {
  klasseId: number
  testId: number
  testBezeichnung: string
  klassenInfo: string
  schuelerListe: Schueler[]
  vorhandeneErgebnisse: Map<number, { prozentwert: number; anmerkung: string | null }>
}

export default function ErfassenForm({
  klasseId,
  testId,
  testBezeichnung,
  klassenInfo,
  schuelerListe,
  vorhandeneErgebnisse
}: ErfassenFormProps) {
  const router = useRouter()
  const [ergebnisse, setErgebnisse] = useState<Map<number, Testergebnis>>(
    new Map(
      schuelerListe.map(s => {
        const vorhandenI = vorhandeneErgebnisse.get(s.id)
        return [
          s.id,
          {
            schuelerId: s.id,
            prozentwert: vorhandenI ? vorhandenI.prozentwert.toString() : '',
            anmerkung: vorhandenI?.anmerkung || ''
          }
        ]
      })
    )
  )
  const [isSaving, setIsSaving] = useState(false)

  const updateErgebnis = (schuelerId: number, field: 'prozentwert' | 'anmerkung', value: string) => {
    setErgebnisse(prev => {
      const newMap = new Map(prev)
      const current = newMap.get(schuelerId)!
      newMap.set(schuelerId, { ...current, [field]: value })
      return newMap
    })
  }

  const berechneNote = (prozentwert: number): number => {
    if (prozentwert >= 90) return 1
    if (prozentwert >= 80) return 2
    if (prozentwert >= 65) return 3
    if (prozentwert >= 50) return 4
    return 5
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Konvertiere Map zu Array für JSON
      const ergebnisseArray = Array.from(ergebnisse.values())
        .filter(e => e.prozentwert !== '') // Nur Ergebnisse mit Werten
        .map(e => ({
          schuelerId: e.schuelerId,
          prozentwert: parseFloat(e.prozentwert),
          anmerkung: e.anmerkung || null
        }))

      const response = await fetch(`/klassen/${klasseId}/tests/${testId}/erfassen/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ergebnisse: ergebnisseArray })
      })

      if (!response.ok) {
        throw new Error('Fehler beim Speichern')
      }

      router.push(`/klassen/${klasseId}/tests`)
      router.refresh()
    } catch {
      alert('Fehler beim Speichern der Ergebnisse')
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <Link href={`/klassen/${klasseId}/tests`} className="text-blue-600 hover:underline">
          ← Zurück zur Testübersicht
        </Link>
        <h1 className="text-3xl font-bold mt-4">Testergebnisse erfassen</h1>
        <p className="text-gray-600">{testBezeichnung}</p>
        <p className="text-gray-500 text-sm">{klassenInfo}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Gib die Ergebnisse für alle Schüler:innen ein. Lasse das Feld leer, wenn ein:e Schüler:in abwesend war.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-2 w-1/6">Nachname</th>
                  <th className="text-left p-2 w-1/6">Vorname</th>
                  <th className="text-left p-2 w-1/6">Prozentwert</th>
                  <th className="text-left p-2 w-1/12">Note</th>
                  <th className="text-left p-2 w-1/2">Anmerkung</th>
                </tr>
              </thead>
              <tbody>
                {schuelerListe.map(schueler => {
                  const ergebnis = ergebnisse.get(schueler.id)!
                  const prozentwert = parseFloat(ergebnis.prozentwert)
                  const note = !isNaN(prozentwert) ? berechneNote(prozentwert) : null

                  return (
                    <tr key={schueler.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{schueler.nachname}</td>
                      <td className="p-2">{schueler.vorname}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={ergebnis.prozentwert}
                            onChange={(e) => updateErgebnis(schueler.id, 'prozentwert', e.target.value)}
                            placeholder="-"
                            className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        {note !== null && (
                          <span className={`font-bold ${note <= 4 ? 'text-green-600' : 'text-red-600'}`}>
                            {note}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={ergebnis.anmerkung}
                          onChange={(e) => updateErgebnis(schueler.id, 'anmerkung', e.target.value)}
                          placeholder="Optional"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSaving ? 'Speichere...' : 'Alle Ergebnisse speichern'}
            </button>
            <Link
              href={`/klassen/${klasseId}/tests`}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition inline-block"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
