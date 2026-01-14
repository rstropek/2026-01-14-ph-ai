import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

async function getKlasse(id: number) {
  const klasse = await prisma.klasse.findUnique({
    where: { id }
  })
  
  if (!klasse) {
    notFound()
  }
  
  return klasse
}

export default async function KlasseBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const klasse = await getKlasse(parseInt(id))

  async function updateKlasse(formData: FormData) {
    'use server'
    
    const schuljahr = formData.get('schuljahr') as string
    const bezeichnung = formData.get('bezeichnung') as string
    const fach = formData.get('fach') as string

    await prisma.klasse.update({
      where: { id: klasse.id },
      data: {
        schuljahr,
        bezeichnung,
        fach
      }
    })

    redirect(`/klassen/${klasse.id}`)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/klassen/${klasse.id}`} className="text-blue-600 hover:underline mb-4 block">
          ← Zurück zur Klasse
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Klasse bearbeiten</h1>

        <form action={updateKlasse} className="space-y-6">
          <div>
            <label htmlFor="schuljahr" className="block text-sm font-medium mb-2">
              Schuljahr *
            </label>
            <input
              type="text"
              id="schuljahr"
              name="schuljahr"
              defaultValue={klasse.schuljahr}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="bezeichnung" className="block text-sm font-medium mb-2">
              Bezeichnung *
            </label>
            <input
              type="text"
              id="bezeichnung"
              name="bezeichnung"
              defaultValue={klasse.bezeichnung}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="fach" className="block text-sm font-medium mb-2">
              Fach *
            </label>
            <input
              type="text"
              id="fach"
              name="fach"
              defaultValue={klasse.fach}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              href={`/klassen/${klasse.id}`}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
