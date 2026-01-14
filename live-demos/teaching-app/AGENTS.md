# Teaching App - Klassenverwaltung

## Übersicht
Diese Anwendung ist eine Web-App zur Verwaltung von Schulklassen, Schüler:innen und Testergebnissen.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Sprache**: TypeScript
- **Datenbank**: SQLite (lokale Datei: `dev.db`)
- **ORM**: Prisma 6.19.2
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Projektstruktur

```
teaching-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Startseite
│   ├── klassen/
│   │   ├── page.tsx             # Klassenliste mit Filter
│   │   ├── neu/page.tsx         # Neue Klasse erstellen
│   │   └── [id]/
│   │       ├── page.tsx         # Klassendetails + Schülerliste
│   │       ├── bearbeiten/page.tsx  # Klasse bearbeiten
│   │       └── schueler/
│   │           ├── neu/page.tsx              # Neuer Schüler
│   │           └── [schuelerId]/page.tsx     # Schülerdetails
├── components/
│   └── KlassenListe.tsx         # Client Component für Klassenliste
├── lib/
│   └── db.ts                     # Prisma Client Singleton
├── prisma/
│   ├── schema.prisma             # Datenbankschema
│   ├── migrations/               # Datenbank-Migrationen
│   └── dev.db                    # SQLite Datenbankdatei
├── prisma.config.ts              # Prisma Konfiguration
└── .env                          # Environment Variables
```

## Datenmodell

### Klasse
- `id`: Int (Primärschlüssel)
- `schuljahr`: String (z.B. "2025/26")
- `bezeichnung`: String (z.B. "1AHIF")
- `fach`: String (z.B. "Mathematik")
- `schueler`: Relation zu Schueler[]
- `createdAt`, `updatedAt`: DateTime

**Sortierung**: Schuljahr → Bezeichnung → Fach

### Schueler
- `id`: Int (Primärschlüssel)
- `vorname`: String
- `nachname`: String
- `kontaktEmail`: String
- `anmerkung`: String (optional, nur in Detailansicht)
- `klasseId`: Int (Foreign Key zu Klasse)
- `klasse`: Relation zu Klasse
- `createdAt`, `updatedAt`: DateTime

**Sortierung**: Nachname → Vorname
**Wichtig**: Schüler:innen gehören immer zu genau einer Klasse. Es gibt keine klassenübergreifenden Schülerlisten.

## UX-Konzept

### Navigation
1. **Startseite** → Link zu Klassenliste
2. **Klassenliste** → Filterfunktion nach Schuljahr, Klick auf Klasse öffnet Details
3. **Klassendetails** → Zeigt Schülerliste, Navigation zu Schülerdetails
4. **Schülerdetails** → Bearbeiten/Löschen von Schülern

### Wichtige Features
- **Selten genutzt**: Anlegen/Bearbeiten von Klassen und Schülern (nur zu Schuljahresbeginn)
- **Häufig genutzt**: Arbeiten mit einer ausgewählten Klasse (z.B. Testergebnisse eintragen - kommt später)
- **Filter**: Klassenliste kann nach Schuljahr gefiltert werden
- **Cascade Delete**: Beim Löschen einer Klasse werden alle Schüler:innen automatisch gelöscht

## Wichtige Befehle

### Development
```bash
npm run dev          # Startet Dev-Server auf http://localhost:3000
npm run build        # Erstellt Production Build
npm run start        # Startet Production Server
```

### Prisma
```bash
npx prisma generate              # Generiert Prisma Client
npx prisma migrate dev           # Erstellt und wendet Migration an
npx prisma studio                # Öffnet Prisma Studio (GUI für DB)
npx prisma db push               # Synchronisiert Schema ohne Migration
```

### Package Management
```bash
npm install <paket>              # Installiert Paket
npm install <paket>@latest       # Installiert neueste Version
npm outdated                     # Prüft auf veraltete Pakete
npm audit                        # Prüft Sicherheitsprobleme
npm audit fix --force            # Behebt Sicherheitsprobleme
```

### Datenbank inspizieren
```bash
sqlite3 dev.db                   # Öffnet SQLite CLI
sqlite3 dev.db ".tables"         # Zeigt alle Tabellen
sqlite3 dev.db "SELECT * FROM Klasse;"  # SQL Query
```

## Server Actions vs. API Routes

Die App nutzt **Next.js Server Actions** statt API Routes:
- `'use server'` Direktive in async Funktionen
- Formulare rufen Server Actions direkt auf
- Einfacher als separate API Endpoints
- Typ-Sicherheit zwischen Client und Server

## Tailwind CSS Utilities

Häufig verwendete Klassen:
- Container: `max-w-2xl mx-auto`, `max-w-6xl mx-auto`
- Spacing: `p-8`, `mb-8`, `space-y-6`
- Buttons: `bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition`
- Inputs: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500`
- Grid: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`

## Wichtige Code-Patterns

### Prisma Client nutzen
```typescript
import { prisma } from '@/lib/db'

const klassen = await prisma.klasse.findMany({
  where: { schuljahr: '2025/26' },
  orderBy: [
    { schuljahr: 'asc' },
    { bezeichnung: 'asc' },
    { fach: 'asc' }
  ],
  include: {
    schueler: true
  }
})
```

### Server Action mit Redirect
```typescript
async function createKlasse(formData: FormData) {
  'use server'
  
  const data = {
    schuljahr: formData.get('schuljahr') as string,
    bezeichnung: formData.get('bezeichnung') as string,
    fach: formData.get('fach') as string
  }

  await prisma.klasse.create({ data })
  redirect('/klassen')
}
```

### Dynamic Route Parameter
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

## Zukünftige Features (noch nicht implementiert)
- Testergebnisse verwalten
- Notenverwaltung
- Durchschnittsberechnungen
- Export-Funktionen

## Notizen für KI-Agenten
- Immer `npm install` verwenden, NIE manuell `package.json` editieren
- Nach Installation: `npm outdated` prüfen und Pakete aktualisieren
- Bei Prisma-Problemen: Context7 MCP Server für aktuelle Dokumentation nutzen
- Database URL in `.env`: `DATABASE_URL="file:./dev.db"`
- Prisma Client wird in `lib/db.ts` als Singleton exportiert
- Next.js nutzt Server Components by default, Client Components brauchen `'use client'`
