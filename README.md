# Konya Clothing V3.11 – Railway + PostgreSQL Backend

Diese Version baut die technische Grundlage für den produktiven Betrieb.

## Die 5 wichtigen Schritte in V3.11

1. **Node.js / Express Backend** – Railway startet jetzt `server.js` statt nur statische Dateien auszuliefern.
2. **PostgreSQL-Anbindung** – über `DATABASE_URL`; die Tabelle `konya_app_state` wird automatisch angelegt.
3. **Zentrale Speicherung** – Aufträge, Kunden, Tickets, Preise, Mitarbeiter, Logs und Einstellungen werden in PostgreSQL gespeichert.
4. **Automatische Synchronisierung** – Änderungen werden lokal zwischengespeichert und kurz danach an PostgreSQL übertragen.
5. **Railway-Healthcheck + Fallback** – `/api/health` prüft die Datenbank. Fällt das Backend aus, arbeitet die Oberfläche vorübergehend mit dem Browser-Backup weiter.

## Railway – einmalig einrichten

1. Im Railway-Projekt beim Service **Konya-Clothing** auf **Variables** gehen.
2. `DATABASE_URL` mit deiner PostgreSQL-Datenbank verbinden. Am saubersten ist eine eigene PostgreSQL-Datenbank für Konya Clothing.
3. Das komplette V3.11-Paket in dein GitHub-Repository übernehmen, committen und pushen.
4. Railway baut den Node-Service automatisch neu.
5. Danach die Seite mit `Strg + F5` laden. Unten beim Admin muss **„Datenbank verbunden“** erscheinen.

## Wichtig

Die vorhandenen Browserdaten werden beim ersten erfolgreichen Start in die leere Datenbank übernommen. Ist bereits ein zentraler Datenstand vorhanden, wird dieser geladen.

Die Uploads werden in V3.11 noch als Base64 innerhalb des zentralen Zustands gespeichert. Das funktioniert als Übergang, ist aber für viele/große Dateien nicht die endgültige Lösung. In einer späteren Version sollte dafür Object Storage verwendet werden.

Ein echter Admin-/Kundenlogin ist bewusst noch nicht in V3.11 enthalten; der kommt auf dieser Backend-Grundlage als nächster Sicherheits-Schritt.
