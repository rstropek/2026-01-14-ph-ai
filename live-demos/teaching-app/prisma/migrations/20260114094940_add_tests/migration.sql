-- CreateTable
CREATE TABLE "Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bezeichnung" TEXT NOT NULL,
    "datum" DATETIME NOT NULL,
    "klasseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_klasseId_fkey" FOREIGN KEY ("klasseId") REFERENCES "Klasse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Testergebnis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prozentwert" REAL NOT NULL,
    "anmerkung" TEXT,
    "testId" INTEGER NOT NULL,
    "schuelerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testergebnis_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Testergebnis_schuelerId_fkey" FOREIGN KEY ("schuelerId") REFERENCES "Schueler" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Testergebnis_testId_schuelerId_key" ON "Testergebnis"("testId", "schuelerId");
