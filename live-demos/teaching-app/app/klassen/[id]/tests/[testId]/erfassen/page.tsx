import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ErfassenForm from '@/components/ErfassenForm'

export default async function ErfassenPage({ 
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
      klasse: {
        include: {
          schueler: {
            orderBy: [
              { nachname: 'asc' },
              { vorname: 'asc' }
            ]
          }
        }
      },
      testergebnisse: true
    }
  })

  if (!test || test.klasseId !== klasseId) {
    notFound()
  }

  // Konvertiere vorhandene Ergebnisse in Map für einfachen Zugriff
  const vorhandeneErgebnisse = new Map<number, { prozentwert: number; anmerkung: string | null }>(
    test.testergebnisse.map((e) => [
      e.schuelerId,
      { prozentwert: e.prozentwert, anmerkung: e.anmerkung }
    ])
  )

  const klassenInfo = `${test.klasse.bezeichnung} (${test.klasse.schuljahr}) - ${test.klasse.fach}`

  return (
    <ErfassenForm
      klasseId={klasseId}
      testId={testIdInt}
      testBezeichnung={test.bezeichnung}
      klassenInfo={klassenInfo}
      schuelerListe={test.klasse.schueler}
      vorhandeneErgebnisse={vorhandeneErgebnisse}
    />
  )
}
