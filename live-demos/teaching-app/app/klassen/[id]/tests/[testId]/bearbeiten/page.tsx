import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function TestBearbeitenPage({ 
  params 
}: { 
  params: Promise<{ id: string; testId: string }> 
}) {
  const { id, testId } = await params
  const klasseId = parseInt(id)
  const testIdInt = parseInt(testId)

  const test = await prisma.test.findUnique({
    where: { id: testIdInt },
    include: {
      klasse: true,
      testergebnisse: true
    }
  })

  if (!test || test.klasseId !== klasseId) {
    notFound()
  }

  async function updateTest(formData: FormData) {
    'use server'
    
    const bezeichnung = formData.get('bezeichnung') as string
    const datum = formData.get('datum') as string

    await prisma.test.update({
      where: { id: testIdInt },
      data: {
        bezeichnung,
        datum: new Date(datum)
      }
    })

    redirect(`/klassen/${klasseId}/tests`)
  }

  // Formatiere Datum für Input-Feld (YYYY-MM-DD)
  const datumFormatiert = new Date(test.datum).toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <Link href={`/klassen/${klasseId}/tests`} className="text-blue-600 hover:underline">
          ← Zurück zur Testübersicht
        </Link>
        <h1 className="text-3xl font-bold mt-4">Test bearbeiten</h1>
        <p className="text-gray-600">{test.klasse.bezeichnung} ({test.klasse.schuljahr}) - {test.klasse.fach}</p>
      </div>

      {test.testergebnisse.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            <strong>Hinweis:</strong> Dieser Test hat bereits {test.testergebnisse.length} Ergebnisse. 
            Das Löschen ist nicht möglich.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form action={updateTest} className="space-y-6">
          <div>
            <label htmlFor="bezeichnung" className="block text-sm font-medium mb-2">
              Bezeichnung *
            </label>
            <input
              type="text"
              id="bezeichnung"
              name="bezeichnung"
              required
              defaultValue={test.bezeichnung}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="datum" className="block text-sm font-medium mb-2">
              Datum *
            </label>
            <input
              type="date"
              id="datum"
              name="datum"
              required
              defaultValue={datumFormatiert}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Änderungen speichern
            </button>
            <Link
              href={`/klassen/${klasseId}/tests`}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
