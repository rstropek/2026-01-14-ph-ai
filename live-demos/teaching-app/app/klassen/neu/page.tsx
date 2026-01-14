import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NeueKlassePage() {
  async function createKlasse(formData: FormData) {
    'use server'
    
    const schuljahr = formData.get('schuljahr') as string
    const bezeichnung = formData.get('bezeichnung') as string
    const fach = formData.get('fach') as string

    await prisma.klasse.create({
      data: {
        schuljahr,
        bezeichnung,
        fach
      }
    })

    redirect('/klassen')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/klassen" className="text-blue-600 hover:underline mb-4 block">
          ← Zurück zu Klassen
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Neue Klasse erstellen</h1>

        <form action={createKlasse} className="space-y-6">
          <div>
            <label htmlFor="schuljahr" className="block text-sm font-medium mb-2">
              Schuljahr *
            </label>
            <input
              type="text"
              id="schuljahr"
              name="schuljahr"
              placeholder="z.B. 2025/26"
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
              placeholder="z.B. 1AHIF"
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
              placeholder="z.B. Mathematik"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Klasse erstellen
            </button>
            <Link
              href="/klassen"
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
