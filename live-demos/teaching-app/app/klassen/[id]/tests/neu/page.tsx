import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function NeuerTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const klasseId = parseInt(id)

  const klasse = await prisma.klasse.findUnique({
    where: { id: klasseId }
  })

  if (!klasse) {
    notFound()
  }

  async function createTest(formData: FormData) {
    'use server'
    
    const bezeichnung = formData.get('bezeichnung') as string
    const datum = formData.get('datum') as string

    await prisma.test.create({
      data: {
        bezeichnung,
        datum: new Date(datum),
        klasseId
      }
    })

    redirect(`/klassen/${klasseId}/tests`)
  }

  // Standard-Datum: heute
  const heute = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <Link href={`/klassen/${klasseId}/tests`} className="text-blue-600 hover:underline">
          ← Zurück zur Testübersicht
        </Link>
        <h1 className="text-3xl font-bold mt-4">Neuer Test</h1>
        <p className="text-gray-600">{klasse.bezeichnung} ({klasse.schuljahr}) - {klasse.fach}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form action={createTest} className="space-y-6">
          <div>
            <label htmlFor="bezeichnung" className="block text-sm font-medium mb-2">
              Bezeichnung *
            </label>
            <input
              type="text"
              id="bezeichnung"
              name="bezeichnung"
              required
              placeholder="z.B. Mathematik Test 1"
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
              defaultValue={heute}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Test erstellen
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
