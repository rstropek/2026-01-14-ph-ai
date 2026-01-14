import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; testId: string }> }
) {
  try {
    const { testId } = await params
    const testIdInt = parseInt(testId)

    // Prüfe, ob der Test Ergebnisse hat
    const test = await prisma.test.findUnique({
      where: { id: testIdInt },
      include: { testergebnisse: true }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test nicht gefunden' }, { status: 404 })
    }

    if (test.testergebnisse.length > 0) {
      return NextResponse.json(
        { error: 'Test kann nicht gelöscht werden, da bereits Ergebnisse vorhanden sind' },
        { status: 400 }
      )
    }

    await prisma.test.delete({ where: { id: testIdInt } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fehler beim Löschen des Tests:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
