import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeleteTestButton } from '@/components/DeleteTestButton'

export default async function TestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const klasseId = parseInt(id)

  const klasse = await prisma.klasse.findUnique({
    where: { id: klasseId },
    include: {
      tests: {
        orderBy: { datum: 'desc' },
        include: {
          testergebnisse: true
        }
      },
      schueler: {
        orderBy: [
          { nachname: 'asc' },
          { vorname: 'asc' }
        ],
        include: {
          testergebnisse: true
        }
      }
    }
  })

  if (!klasse) {
    notFound()
  }

  // Berechne Note aus Prozentwert
  function berechneNote(prozentwert: number): number {
    if (prozentwert >= 90) return 1
    if (prozentwert >= 80) return 2
    if (prozentwert >= 65) return 3
    if (prozentwert >= 50) return 4
    return 5
  }

  // Berechne Durchschnitt für einen Schüler
  function berechneDurchschnitt(schuelerId: number): number | null {
    const ergebnisse = klasse?.schueler
      .find((s) => s.id === schuelerId)
      ?.testergebnisse
      .filter((e) => klasse.tests.some((t) => t.id === e.testId))
    
    if (!ergebnisse || ergebnisse.length === 0) return null
    
    const summe = ergebnisse.reduce((acc: number, e) => acc + e.prozentwert, 0)
    return summe / ergebnisse.length
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <Link href={`/klassen/${klasseId}`} className="text-blue-600 hover:underline">
          ← Zurück zur Klasse
        </Link>
        <h1 className="text-3xl font-bold mt-4">Tests: {klasse.bezeichnung} ({klasse.schuljahr})</h1>
        <p className="text-gray-600">{klasse.fach}</p>
      </div>

      {/* Tests Liste */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tests</h2>
          <Link 
            href={`/klassen/${klasseId}/tests/neu`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Neuer Test
          </Link>
        </div>

        {klasse.tests.length === 0 ? (
          <p className="text-gray-500">Noch keine Tests vorhanden.</p>
        ) : (
          <div className="space-y-4">
            {klasse.tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{test.bezeichnung}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(test.datum).toLocaleDateString('de-AT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {test.testergebnisse.length} von {klasse.schueler.length} Ergebnissen
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/klassen/${klasseId}/tests/${test.id}/erfassen`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Ergebnisse erfassen
                  </Link>
                  <Link 
                    href={`/klassen/${klasseId}/tests/${test.id}/bearbeiten`}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Bearbeiten
                  </Link>
                  {test.testergebnisse.length === 0 && (
                    <DeleteTestButton testId={test.id} klasseId={klasseId} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ergebnistabelle */}
      {klasse.tests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Übersicht Testergebnisse</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-2">Nachname</th>
                  <th className="text-left p-2">Vorname</th>
                  {klasse.tests.map((test) => (
                    <th key={test.id} className="text-right p-2">
                      {test.bezeichnung}
                    </th>
                  ))}
                  <th className="text-right p-2 font-bold">Durchschnitt</th>
                </tr>
              </thead>
              <tbody>
                {klasse.schueler.map((schueler) => {
                  const durchschnitt = berechneDurchschnitt(schueler.id)
                  return (
                    <tr key={schueler.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{schueler.nachname}</td>
                      <td className="p-2">{schueler.vorname}</td>
                      {klasse.tests.map((test) => {
                        const ergebnis = schueler.testergebnisse.find((e) => e.testId === test.id)
                        return (
                          <td key={test.id} className="text-right p-2">
                            {ergebnis ? (
                              <span title={ergebnis.anmerkung || ''}>
                                {ergebnis.prozentwert.toFixed(1)}%
                                <span className="text-gray-500 text-sm ml-1">
                                  ({berechneNote(ergebnis.prozentwert)})
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="text-right p-2 font-bold">
                        {durchschnitt !== null ? (
                          <>
                            {durchschnitt.toFixed(2)}%
                            <span className="text-gray-500 text-sm ml-1">
                              ({berechneNote(durchschnitt)})
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
