-- CreateTable
CREATE TABLE "Klasse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schuljahr" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "fach" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Schueler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vorname" TEXT NOT NULL,
    "nachname" TEXT NOT NULL,
    "kontaktEmail" TEXT NOT NULL,
    "anmerkung" TEXT,
    "klasseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Schueler_klasseId_fkey" FOREIGN KEY ("klasseId") REFERENCES "Klasse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
