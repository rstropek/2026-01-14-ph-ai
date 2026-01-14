Das klingt gut. Erstelle mir im aktuellen Ordner ein Grundgerüst für die Anwendung. Starten wir einfach mit einer Verwaltung der Klassen, die ich unterrichte. Ich füge Klassen selten hinzu, nur am Beginn des Schuljahres. Ansonsten werde ich nach Start der Anwendung immer eine Klasse auswählen und länger mit dieser arbeiten (z.B. Testergebnisse eintragen).

Je Klasse möchte ich dann die Schüler:innen verwalten können. Hier die Felder, die ich haben will:

- Klasse:
  - Schuljahr (Text, z.b. 2025/26)
  - Bezeichnung (Text, z.b. 1AHIF)
  - Fach (Text, z.b. Mathematik)
  - Bitte Listen immer nach Schuljahr, dann Bezeichnung, dann Fach sortieren
  - Listen möchte ich nach Schuljahr filtern können
- Schüler:in:
  - Vorname (Text)
  - Nachname (Text)
  - Kontakt-E-Mail (Text)
  - Anmerkungsfeld (nicht in Listen, nur in Detailansicht)
  - Schüler:innen gehören immer zu genau einer Klasse (d.h. wenn ich einen Schüler mehrere Jahre hab, dann lege ich ihn mehrmals an)
  - Listen immer nach Nachname, dann Vorname sortieren
  - Ich möchte zur Schülerliste von einer Klasse aus navigieren können. Ich brauche nie klassenübergreifende Schülerlisten.

Auch hier findet das Erfassen und bearbeiten neuer Schüler:innen selten statt. Meistens werde ich Testergebnisse eintragen, etc. (diese Funktion fügen wir später hinzu).

Noch eine technische Bitte: Mir ist wichtig, dass wir immer die aktuellen NPM-Pakete verwenden. Füge daher NIE Pakete als Text in package.json ein. Verwende stattdessen immer den Befehl "npm install <paketname>". Wenn du Pakete installiert hast, überprüfe mit "npm outdated", ob es neuere Versionen der Pakete gibt. Wenn ja, aktualisiere sie mit "npm install <paketname>@latest".

In der Vergangenheit hast du immer mal Fehler gemacht, wenn es um das Initialisieren der DB und des ORM gegangen ist. Verwende bitte den context7 MCP server, such nach der ORM-Bibliothek die du verwendest in Verbindung mit der DB, die du ausgewählt hast und folge den Beispielen und Anweisungen aus der aktuellen Dokumentation.

Wenn du mit allem fertig bist, speichere dir bitte grundsätzliche Notizen zum Aufbau der Anwendung, wichtiger Befehle, grundsätzliche UX-Konzepte, etc. in der Datei AGENTS.md im Wurzelverzeichnis der Anwendung ab, damit du später wenn ich Wünsche habe darauf zugreifen kannst.
