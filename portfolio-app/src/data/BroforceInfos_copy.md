# BoomForce - BroForce Klon

Eine Nachbildung von *BroForce*, entwickelt als Projekt für den Game Engines-Kurs meines Software Engineering Bachelor-Studiums. Das in Unity erstellte Projekt legt den Fokus auf zerstörbare Umgebungen, komplexe Kettenreaktionen und physikbasierte Objektinteraktionen, die die Kernspielmechaniken des Originals nachbilden.

## Projektübersicht
- **Projektname**: BoomForce
- **Genre**: 2D-Physikbasiertes Puzzle/Plattformspiel

## Steuerung
- **Bewegung**: 
  - Links/Rechts: `A/D` (empfohlen) oder `Pfeiltasten`
  - Leitern klettern: `W/S` (empfohlen) oder `Pfeiltasten Hoch/Runter`
  - Schießen: `Linke Maustaste`
  - Springen: `Leertaste`

## Spielmechaniken

### Kernspielprinzip
- Physikbasiertes Zerstörungssystem
- Kettenreaktionsmechanik
- Interaktion mit der Umgebung

### Objektspezifikationen

#### Kacheln
| Kacheltyp | Gesundheit | Schaden durch Kugel | Brandsachschaden pro Sekunde |
|-----------|------------|----------------------|------------------------------|
| Gras      | 8 LP       | -2 LP                | -1 LP                        |
| Hart      | 10 LP      | -2 LP                | -1 LP                        |
| Weich     | 4 LP       | -2 LP                | -1 LP                        |

#### Interaktive Objekte

##### Fallende Steine
- **Auslösebedingungen**:
  - Direkter Treffer durch Kugeln
  - Feuerkontakt
  - Kollision mit Spieler (Laufen oder Springen)
- **Verhalten**:
  - Fällt, wenn nichts darunter ist und durch **Auslösebedingungen** ausgelöst
  - Fällt automatisch, wenn nicht mehr gestützt (kein Block darunter und nur ein angrenzender Steinblock)

##### Fässer
| Typ      | Zündzeit   | Explosionsradius (Kacheln) | Besondere Eigenschaften        |
|----------|------------|---------------------------|--------------------------------|
| Schwarz  | 4 Sekunden | 2 Kacheln                 | - Innere Kachel: Sofortige Zerstörung |
|          |            |                           | - Äußerer Ring: 4s Brandeffekt |
| Rot      | 0,2 Sekunden | 2 Kacheln               | - Innere Kachel: Sofortige Zerstörung |
|          |            |                           | - Äußerer Ring: 4s Brandeffekt |
| Fliegend | Variabel   | 2 Kacheln                 | - Fliegt 18 Kacheln bei Auslösung |
|          |            |                           | - Kann nach oben oder rechts fliegen |
|          |            |                           | - Löst andere Objekte im Weg aus |
|          |            |                           | - Explodiert bei Kontakt mit anderen fliegenden Fässern |

### Kettenreaktionssystem
- **Aktivierung**:
  - Fässer explodieren bei Beschuss oder Brand
  - Explosionen beeinflussen Objekte im Radius
  - Feuer breitet sich auf angrenzende brennbare Objekte aus
- **Ausbreitung**:
  - Direkte Treffer verursachen sofortige Explosionen
  - Nahe Objekte fangen Feuer (4s Dauer)
  - Brennende Objekte können andere Objekte auslösen

## Entwicklungseinblicke

### Herausforderungen & Lösungen

1. **Fortgeschrittenes Physiksystem**
   - Entwicklung realistischer Objektinteraktionen mit eigener Physik
   - Implementierung präziser Fallmechaniken für dynamisches Steinverhalten
   - Entwicklung genauer Explosionskraftberechnungen und -ausbreitung

2. **Komplexes Kettenreaktionssystem**
   - Entwurf effizienter Algorithmen zur Verwaltung mehrerer gleichzeitiger Explosionen
   - Implementierung robuster Zustandsverfolgung zur Vermeidung von Endlosschleifen
   - Optimierung der Leistung für komplexe Kettenreaktionen

3. **Dynamische Objektzustandsverwaltung**
   - Erstellung eines ausgeklügelten Systems zur Verfolgung von Objektzuständen (brennend, explodierend, fallend)
   - Implementierung präziser Zeitsteuerung für Explosionssequenzen
   - Entwicklung effizienter Mechanismen zur Objektzerstörung und -bereinigung


### Externe Assets
- **Grafiken**:
  - Sunny Land (von ANSIMUZ)
  - Terrainify 2D (von Robronic Games)
  - Too Cube Forest (von NEMO-MK2)
- **Soundeffekte**: Eigenkreierte Sprung- und Landegeräusche

### Inspiration
- **Spieldesign**: Broforce
- **Bewegungssystem**: Inspiriert von [Brackeys' 2D Movement in Unity Tutorial](https://youtu.be/dwcT-Dch0bA)

### Asset-Quellen
- [itch.io](https://itch.io/)
- [Spriters Resource](https://www.spriters-resource.com/)
- [Videvo](https://www.videvo.net/)
- [Mixkit](https://mixkit.co/)

## Entwicklungsnotizen

### Über das Projekt
- Dieses Projekt wurde für meinen "Game Engine"-Kurs während meines Studiums entwickelt
- Es handelt sich um einen Prototyp, der sich auf die Kernmechaniken konzentriert, nicht um ein fertiges Spiel
- Hauptziel war die Erstellung einer zerstörbaren Umgebung mit realistischen Kettenreaktionen

### Technische Highlights
- **Was gut funktioniert hat**: Die zerstörbare Umgebung und die Kettenreaktionen sind großartig geworden
- **Zusätzliche Details**: Einige Designelemente und Soundeffekte wurden zum Spaß hinzugefügt
- **Aktueller Stand**: Ein funktionierender Prototyp, der die Kernmechaniken zeigt, mit einem speziellen Showcase-Bereich zum Testen einzelner Elemente und einem Beispiellevel, das zeigt, wie es in einem fertigen Spiel aussehen würde
- **Hinweis**: Da es sich um ein Studienprojekt handelt, könnten einige Ecken und Kanten oder kleinere Fehler vorhanden sein

### Mögliche Erweiterungen
- **Kernspiel**: Spielzustände, Gesundheitssystem, Gewinn-/Verlustbedingungen
- **Gegner**: Einfache KI, verschiedene Gegnertypen, Bosskämpfe
- **Feinschliff**: Bessere visuelle Effekte, Sounddesign, Animationen
- **Inhalte**: Mehr Level, Power-Ups
- **Technik**: Optimierungen, Speichersystem

