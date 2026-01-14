Ich mache in meinen Klassen Tests und will die Testergebnisse meiner Schüler:innen verwalten können.

- Jeder Test bezieht sich auf eine Klasse. Ein Test hat:
  - Bezeichnung (Text, z.B. "Mathematik Test 1")
  - Datum (Datum)
- Zu jedem Schüler gibt es pro Test ein Testergebnis (oder keines falls abwesend)
- Testergebnis:
  - Prozentwert (Zahl, z.B. 85.5)
  - Anmerkungsfeld (Text, optional)
  - Die Note soll automatisch aus dem Prozentwert berechnet werden.
    - > = 90% eine 1
    - > = 80% eine 2
    - > = 65% eine 3
    - > = 50% eine 4
    - < 50% eine 5

Von der Klassenauswahl will ich zu den Tests der Klasse navigieren können.

- Oben eine Auflistung aller Tests der Klasse mit Bezeichnung und Datum.
  - Möglichkeiten, neue Tests hinzuzufügen, bestehende zu bearbeiten oder zu löschen (nur, wenn es keine Ergebnisse für den Test gibt).
  - Möglichkeit, für einen Test in den Erfassungsmodus zu wechseln. Dort kann ich die Testergebnisse der Schüler:innen eingeben oder ändern. Ich will alle Testergebnisse aller Schüler:innen auf einmal ändern und alles auf einmal speichern können.
- Unter der Testliste will ich in einer Tabelle alle Schüler:innen der Klasse sehen. Alle Testergebnisse der Schüler:innen sollen in Spalten dargestellt werden. Am Ende der Zeile soll der Durchschnittswert der Schüler:in über alle Tests angezeigt werden, an denen teilgenommen wurde. Beispiel:

  ```
  | Nachname | Vorname | Test 1 | Test 2 | Test 3 | Durchschnitt |
  |----------|---------|-------:|-------:|-------:|-------------:|
  | Müller   | Anna    |   85.5 |   90.0 |        |       87.75  |
  | Schmidt  | Bernd   |   70.0 |        |   60.0 |       65.0   |
  ```
