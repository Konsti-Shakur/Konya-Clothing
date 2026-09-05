# Konya Clothing V3.17 – Clean & Stable

Diese Version behebt die sichtbaren Layout-Probleme aus V3.16 und mehrere echte JavaScript-Fehler.

## Die 5 wichtigsten Fixes

1. **Öffentliche Seite sauber getrennt**
   Admin-Topbar und Sidebar werden auf der Hauptseite zuverlässig ausgeblendet.

2. **Hero komplett korrigiert**
   Überschrift, Banner und Express/Workflow-Karten überlappen nicht mehr und passen sauber in das Layout.

3. **Runtime-Fehler behoben**
   Fehlende Routing-Variablen, `priceLookup()` und Datei-Upload-Helfer wurden ergänzt.

4. **Datenfehler korrigiert**
   Preisgruppen verwenden das richtige Datenfeld und öffentliche Aufträge speichern die Leistung kompatibel zum Adminbereich.

5. **Responsive + Overflow Fix**
   Desktop, Tablet und Handy brechen sauber um; Tabellen, Showcase und Formulare laufen nicht mehr aus dem Layout.

## Prüfung
- `node --check app.js`
- `node --check server.js`

PostgreSQL, Kundenbereich, öffentliche Unterseiten und der vorhandene Adminbereich bleiben erhalten.
