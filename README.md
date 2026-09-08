# Minedesso WebApp

Vollständiger Angular-Frontend-Prototyp für das Minedesso Minecraft-Netzwerk. Die Umsetzung folgt den Arbeitspaketen aus dem Lastenheft und verwendet einen zentralen Mock-Service für alle Backend- und Realtime-Zustände.

## Entwicklung

```bash
npm install
npm start
```

Die App läuft anschließend unter `http://localhost:4200`. Auf der Loginseite führt „Mit Demo-Account fortfahren“ direkt in den Player Hub.

## Struktur

- `src/app/core`: Fachmodelle und austauschbare Mock-API
- `src/app/shared`: wiederverwendbare UI-Komponenten mit ausgelagerten HTML-Templates
- `src/app/layout`: responsives App-Shell-Layout mit Sidebar und Mobile Drawer
- `src/app/pages`: Landingpage, Auth/Linking, Player Hub und Administration
- `src/styles.css`, `src/landing.css`, `src/portal.css`: Bootstrap-Theme und responsive Minedesso-Designsprache

Alle Seitentemplates liegen in separaten `.html`-Dateien. Die Komponentenlogik ist ausschließlich TypeScript. Bootstrap 5 stellt die Komponenten- und Utility-Basis; Interaktionen werden Angular-nativ umgesetzt.

## Mock-API

`MockApiService` kapselt Session, Spielerprofil, Servertelemetrie, Freunde, Quests, Rewards, Benachrichtigungen, Backups, Console und Audit Logs. Schreibende Aktionen aktualisieren Signal-State, erzeugen UI-Feedback und – wo relevant – Audit-Einträge. Für die spätere Backend-Anbindung kann der Service gegen einen HTTP-/Realtime-Adapter ausgetauscht werden, ohne die Seitenkomponenten neu zu strukturieren.

## Qualität

```bash
npm test -- --watch=false
npm run build
```

Die Anwendung unterstützt Desktop, Tablet und Mobile, `prefers-reduced-motion`, Tastaturfokus, semantische Statusanzeigen sowie explizite Bestätigungsdialoge für kritische Aktionen.
