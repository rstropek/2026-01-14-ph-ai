import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; testId: string }> }
) {
  try {
    const { id, testId } = await params
    const testIdInt = parseInt(testId)
    const body = await request.json()
    const { ergebnisse } = body

    // Lösche alle vorhandenen Ergebnisse für diesen Test
    await prisma.testergebnis.deleteMany({
      where: { testId: testIdInt }
    })

    // Erstelle neue Ergebnisse
    if (ergebnisse && ergebnisse.length > 0) {
      await prisma.testergebnis.createMany({
        data: ergebnisse.map((e: any) => ({
          testId: testIdInt,
          schuelerId: e.schuelerId,
          prozentwert: e.prozentwert,
          anmerkung: e.anmerkung
        }))
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Speichern der Testergebnisse:', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern' },
      { status: 500 }
    )
  }
}
