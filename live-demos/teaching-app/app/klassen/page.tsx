import { prisma } from '@/lib/db'
import Link from 'next/link'
import { KlassenListe } from '@/components/KlassenListe'

export const dynamic = 'force-dynamic'

async function getKlassen(schuljahrFilter?: string) {
  const klassen = await prisma.klasse.findMany({
    where: schuljahrFilter ? { schuljahr: schuljahrFilter } : undefined,
    orderBy: [
      { schuljahr: 'asc' },
      { bezeichnung: 'asc' },
      { fach: 'asc' }
    ],
    include: {
      _count: {
        select: { schueler: true }
      }
    }
  })
  return klassen
}

async function getSchuljahre() {
  const klassen = await prisma.klasse.findMany({
    select: { schuljahr: true },
    distinct: ['schuljahr'],
    orderBy: { schuljahr: 'asc' }
  })
  return klassen.map(k => k.schuljahr)
}

export default async function KlassenPage({
  searchParams,
}: {
  searchParams: Promise<{ schuljahr?: string }>
}) {
  const params = await searchParams
  const schuljahrFilter = params.schuljahr
  const klassen = await getKlassen(schuljahrFilter)
  const schuljahre = await getSchuljahre()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-600 hover:underline mb-2 block">
              ← Zurück zur Startseite
            </Link>
            <h1 className="text-4xl font-bold">Meine Klassen</h1>
          </div>
          <Link
            href="/klassen/neu"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Neue Klasse
          </Link>
        </div>

        <KlassenListe 
          klassen={klassen} 
          schuljahre={schuljahre}
          currentFilter={schuljahrFilter}
        />
      </div>
    </main>
  )
}
