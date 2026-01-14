import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from '@/components/DeleteButton'

async function getSchueler(klasseId: number, schuelerId: number) {
  const schueler = await prisma.schueler.findFirst({
    where: { 
      id: schuelerId,
      klasseId: klasseId
    },
    include: {
      klasse: true
    }
  })
  
  if (!schueler) {
    notFound()
  }
  
  return schueler
}

export default async function SchuelerDetailPage({
  params,
}: {
  params: Promise<{ id: string; schuelerId: string }>
}) {
  const { id, schuelerId } = await params
  const schueler = await getSchueler(parseInt(id), parseInt(schuelerId))

  async function updateSchueler(formData: FormData) {
    'use server'
    
    const vorname = formData.get('vorname') as string
    const nachname = formData.get('nachname') as string
    const kontaktEmail = formData.get('kontaktEmail') as string
    const anmerkung = formData.get('anmerkung') as string

    await prisma.schueler.update({
      where: { id: schueler.id },
      data: {
        vorname,
        nachname,
        kontaktEmail,
        anmerkung: anmerkung || null
      }
    })

    redirect(`/klassen/${schueler.klasseId}/schueler/${schueler.id}`)
  }

  async function deleteSchueler() {
    'use server'
    
    await prisma.schueler.delete({
      where: { id: schueler.id }
    })

    redirect(`/klassen/${schueler.klasseId}`)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/klassen/${schueler.klasseId}`} className="text-blue-600 hover:underline mb-4 block">
          ← Zurück zur Klasse
        </Link>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{schueler.vorname} {schueler.nachname}</h1>
            <p className="text-gray-600">{schueler.klasse.bezeichnung} • {schueler.klasse.fach}</p>
          </div>
          <form action={deleteSchueler}>
            <DeleteButton
              confirmMessage="Möchten Sie diese:n Schüler:in wirklich löschen?"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Löschen
            </DeleteButton>
          </form>
        </div>

        <form action={updateSchueler} className="space-y-6">
          <div>
            <label htmlFor="vorname" className="block text-sm font-medium mb-2">
              Vorname *
            </label>
            <input
              type="text"
              id="vorname"
              name="vorname"
              defaultValue={schueler.vorname}
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
              defaultValue={schueler.nachname}
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
              defaultValue={schueler.kontaktEmail}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="anmerkung" className="block text-sm font-medium mb-2">
              Anmerkung
            </label>
            <textarea
              id="anmerkung"
              name="anmerkung"
              defaultValue={schueler.anmerkung || ''}
              rows={4}
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
              href={`/klassen/${schueler.klasseId}`}
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
