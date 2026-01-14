import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from '@/components/DeleteButton'

async function getKlasse(id: number) {
  const klasse = await prisma.klasse.findUnique({
    where: { id },
    include: {
      schueler: {
        orderBy: [
          { nachname: 'asc' },
          { vorname: 'asc' }
        ]
      }
    }
  })
  
  if (!klasse) {
    notFound()
  }
  
  return klasse
}

async function deleteKlasse(id: number) {
  'use server'
  await prisma.klasse.delete({
    where: { id }
  })
  redirect('/klassen')
}

export default async function KlasseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const klasse = await getKlasse(parseInt(id))

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/klassen" className="text-blue-600 hover:underline mb-4 block">
          ← Zurück zu Klassen
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{klasse.bezeichnung}</h1>
            <p className="text-xl text-gray-600">{klasse.fach} • {klasse.schuljahr}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/klassen/${klasse.id}/tests`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Tests verwalten
            </Link>
            <Link
              href={`/klassen/${klasse.id}/bearbeiten`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Bearbeiten
            </Link>
            <form action={deleteKlasse.bind(null, klasse.id)}>
              <DeleteButton
                confirmMessage="Möchten Sie diese Klasse wirklich löschen? Alle Schüler:innen werden ebenfalls gelöscht."
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Löschen
              </DeleteButton>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Schüler:innen ({klasse.schueler.length})</h2>
            <Link
              href={`/klassen/${klasse.id}/schueler/neu`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Neue:r Schüler:in
            </Link>
          </div>

          {klasse.schueler.length === 0 ? (
            <p className="text-gray-500">Noch keine Schüler:innen in dieser Klasse.</p>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nachname</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Vorname</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">E-Mail</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {klasse.schueler.map((schueler) => (
                    <tr key={schueler.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{schueler.nachname}</td>
                      <td className="px-6 py-4">{schueler.vorname}</td>
                      <td className="px-6 py-4 text-gray-600">{schueler.kontaktEmail}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/klassen/${klasse.id}/schueler/${schueler.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
