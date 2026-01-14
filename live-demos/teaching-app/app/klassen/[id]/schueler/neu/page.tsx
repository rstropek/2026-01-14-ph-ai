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

export default async function NeuerSchuelerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const klasse = await getKlasse(parseInt(id))

  async function createSchueler(formData: FormData) {
    'use server'
    
    const vorname = formData.get('vorname') as string
    const nachname = formData.get('nachname') as string
    const kontaktEmail = formData.get('kontaktEmail') as string
    const anmerkung = formData.get('anmerkung') as string

    await prisma.schueler.create({
      data: {
        vorname,
        nachname,
        kontaktEmail,
        anmerkung: anmerkung || null,
        klasseId: klasse.id
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
        
        <h1 className="text-4xl font-bold mb-2">Neue:r Schüler:in hinzufügen</h1>
        <p className="text-gray-600 mb-8">{klasse.bezeichnung} • {klasse.fach} • {klasse.schuljahr}</p>

        <form action={createSchueler} className="space-y-6">
          <div>
            <label htmlFor="vorname" className="block text-sm font-medium mb-2">
              Vorname *
            </label>
            <input
              type="text"
              id="vorname"
              name="vorname"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="nachname" className="block text-sm font-medium mb-2">
              Nachname *
            </label>
            <input
              type="text"
              id="nachname"
              name="nachname"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="kontaktEmail" className="block text-sm font-medium mb-2">
              Kontakt-E-Mail *
            </label>
            <input
              type="email"
              id="kontaktEmail"
              name="kontaktEmail"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="anmerkung" className="block text-sm font-medium mb-2">
              Anmerkung (optional)
            </label>
            <textarea
              id="anmerkung"
              name="anmerkung"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Schüler:in hinzufügen
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
