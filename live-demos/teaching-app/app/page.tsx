import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Klassenverwaltung</h1>
        <p className="text-lg text-gray-600 mb-8">
          Willkommen zu Ihrer Klassenverwaltungs-App. Verwalten Sie Ihre Klassen und Schüler:innen einfach und übersichtlich.
        </p>
        <Link 
          href="/klassen"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Zu den Klassen
        </Link>
      </div>
    </main>
  )
}
