'use client'

interface DeleteTestButtonProps {
  testId: number
  klasseId: number
}

export function DeleteTestButton({ testId, klasseId }: DeleteTestButtonProps) {
  async function handleDelete() {
    if (!confirm('Test wirklich löschen?')) {
      return
    }

    try {
      const response = await fetch(`/klassen/${klasseId}/tests/${testId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Fehler beim Löschen des Tests')
      }
    } catch {
      alert('Fehler beim Löschen des Tests')
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Löschen
    </button>
  )
}
