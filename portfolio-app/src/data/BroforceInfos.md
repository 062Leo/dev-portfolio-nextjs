# BoomForce - BroForce Klon

[English Version Below](#boomforce---broforce-clone)

---

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


*** 
---


# BoomForce - BroForce Clone 

A recreation of *Broforce*, developed as a project for the Game Engines course of my Software Engineering Bachelor studies. Built in Unity, the project emphasizes destructible environments, complex chain reactions, and physics-based object interactions, replicating the core gameplay mechanics of the original game.

## Project Overview
- **Project Name**: BoomForce
- **Genre**: 2D Physics-based Puzzle/Platformer

## Controls
- **Movement**: 
  - Left/Right: `A/D` (recommended) or `Arrow Keys`
  - Climbing Ladders: `W/S` (recommended) or `Up/Down Arrows`
  - Shooting: `Left Mouse Button`
  - jumpng : `Space`

## Game Mechanics

### Core Gameplay
- Physics-based destruction system
- Chain reaction mechanics
- Environmental interaction

### Object Specifications

#### Tiles
| Tile Type | Health | Damage Taken from Bullet | Burn Damage per Second |
|-----------|--------|--------------------------|------------------------|
| Grass     | 8 HP   | -2 HP                    | -1 HP                  |
| Hard      | 10 HP  | -2 HP                    | -1 HP                  |
| Soft      | 4 HP   | -2 HP                    | -1 HP                  |

#### Interactive Objects

##### Falling Stones
- **Trigger Conditions**:
  - Direct hit by bullets
  - Exposure to fire
  - Player collision (walking or jumping)
- **Behavior**:
  - Falls when nothing is below it and triggered by **Trigger Conditions**:
  - Auto-falls when unsupported (no block below and only one adjacent stone block)

##### Barrels
| Type   | Detonation Time | Explosion Radius (Tiles) | Special Properties                 |
|--------|-----------------|--------------------------|------------------------------------|
| Black  | 4 seconds       | 2 tiles                  | - Inner 1 tile: Instant destruction |
|        |                 |                          | - Outer ring: 4s burn effect       |
| Red    | 0.2 seconds     | 2 tiles                  | - Inner 1 tile: Instant destruction |
|        |                 |                          | - Outer ring: 4s burn effect       |
| Flying | Variable        | 2 tiles                  | - Flies 18 tiles when triggered    |
|        |                 |                          | - Can fly up or right              |
|        |                 |                          | - Triggers other objects in path   |
|        |                 |                          | - Explodes on contact with other flying barrels |

### Chain Reaction System
- **Activation**:
  - Barrels trigger when shot or burned
  - Explosions affect objects within radius
  - Fire spreads to adjacent flammable objects
- **Propagation**:
  - Direct hits cause instant explosions
  - Nearby objects catch fire (4s duration)
  - Burning objects can trigger other objects

## Development Insights

### Development Challenges & Solutions

1. **Advanced Physics System**
   - Engineered realistic object interactions with custom physics
   - Implemented precise falling mechanics for dynamic stone behavior
   - Developed accurate explosion force calculations and propagation

2. **Complex Chain Reaction System**
   - Designed efficient algorithms for managing multiple simultaneous explosions
   - Implemented robust state tracking to prevent infinite loops
   - Optimized performance for handling complex chain reactions

3. **Dynamic Object State Management**
   - Created a sophisticated system for tracking object states (burning, exploding, falling)
   - Implemented precise timing for explosion sequences
   - Developed efficient object destruction and cleanup mechanisms



### External Assets
- **Visuals**:
  - Sunny Land (by ANSIMUZ)
  - Terrainify 2D (by Robronic Games)
  - Too Cube Forest (by NEMO-MK2)
- **Sound Effects**: Self-created jump and landing sounds

### Inspiration
- **Game Design**: Broforce
- **Movement System**: Inspired by [Brackeys' 2D Movement in Unity Tutorial](https://youtu.be/dwcT-Dch0bA)

### Asset Sources
- [itch.io](https://itch.io/)
- [Spriters Resource](https://www.spriters-resource.com/)
- [Videvo](https://www.videvo.net/)
- [Mixkit](https://mixkit.co/)

## Development Notes

### About the Project
- This project was developed for my "Game Engine" course during my studies
- It's a prototype focused on core mechanics rather than a polished game
- The main goal was to create a destructible environment with realistic chain reactions


### Technical Highlights
- **What Worked Well**: The destructible environment and chain reactions turned out great
- **Extra Touches**: Added some design elements and sound effects just for fun
- **Current State**: A working prototype that shows off the core mechanics, featuring a dedicated showcase area to test individual elements and a sample level demonstrating how it would look in a finished game
- **Heads Up**: Since this was a study project, you might find some rough edges or minor bugs

### Future Possibilities
- **Core Game**: Game states, health system, win/lose conditions
- **Enemies**: Basic AI, different enemy types, boss battles
- **Polish**: Better VFX, sound design, animations
- **Content**: More levels, power-ups
- **Tech**: Optimizations, save system,


