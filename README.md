# Minijuegos Interactivos en Angular

En este proyecto presento una colección de **minijuegos implementados con el framework web Angular**.  
Incluye actualmente dos juegos listos en interfaz: **NIM** y **Gato (Tic-Tac-Toe)**.
---

## Juego: NIM

### Descripción
Juego de un solo montón de cerillos. El jugador y la máquina se alternan; cada turno se toman entre 1 y `maxPorTurno` cerillos. En la variante usada aquí, **quien toma el último cerillo pierde**.

### Configuración inicial
- `cerillosInicial` (por ejemplo 21)
- `maxPorTurno` (por ejemplo 3)

### Estados
- `inicioJuego` (muestra formulario de configuración mientras es `false`)
- `cerillosTotales` (cantidad restante)
- `turnoJugador` / `turnoMaquina`
- `juegoTerminado` (victoria/derrota/empate)

### Estrategia de la máquina (heurística)
La máquina intenta dejar siempre un número de cerillos múltiplo de 4:
- Si `cerillosTotales % (maxPorTurno+1) !== 0` toma `cerillosTotales % (maxPorTurno+1)`.
- Si es múltiplo, toma 1 (o estrategia alternativa).

> Nota: la variante clásica descrita en el proyecto asume `maxPorTurno = 3`, por lo que el múltiplo base es 4.

### Fragmento (ejemplo) - flujo de inicio
~~~text
Formulario -> iniciarJuego()
iniciarJuego:
  cerillosTotales := cerillosInicial
  maxPorTurno := maxPorTurnoInput
  turnoJugador := true
  mostrar tablero
~~~

---

## Juego: Gato (Tic-Tac-Toe)

### Descripción
Tablero 3×3; jugador = **X**, máquina = **O**. Se gana alineando 3 símbolos (fila, columna, diagonal). Si el tablero se llena sin ganador, empate.

### Estados
- `tablero: string[9]` ('' | 'X' | 'O')
- `turnoJugador` (true si es X)
- `juegoTerminado`
- `mensaje`

### Mecánica general
- El jugador realiza una jugada en una celda vacía.
- Se verifica victoria/empate.
- Si no hay fin, la IA (máquina) ejecuta su movimiento óptimo (Minimax).
- Se actualiza estado y mensaje.

---

## Inteligencia Artificial: Minimax (Gato)

### Idea principal
Minimax explora todas las jugadas posibles recursivamente y asigna **puntuaciones** a los estados terminales. La máquina asume que el oponente juega óptimamente:

- **Max (máquina O)** quiere maximizar la puntuación.
- **Min (jugador X)** quiere minimizarla.

### Puntuaciones usadas
- Gana la máquina (O): `+10 - profundidad`
- Gana el jugador (X): `-10 + profundidad`
- Empate: `0`

La profundidad se resta/suma para preferir victorias más rápidas y derrotas más tardías.

### Pseudocódigo
~~~text
function minimax(tablero, profundidad, esMax):
  if gana(O): return +10 - profundidad
  if gana(X): return -10 + profundidad
  if empate: return 0

  if esMax:
    mejorScore = -∞
    para cada celda vacía:
      simular O en celda
      score = minimax(nuevoTablero, profundidad+1, false)
      mejorScore = max(mejorScore, score)
    return mejorScore
  else:
    mejorScore = +∞
    para cada celda vacía:
      simular X en celda
      score = minimax(nuevoTablero, profundidad+1, true)
      mejorScore = min(mejorScore, score)
    return mejorScore
~~~

### Resultado práctico
- La IA juega óptimo: nunca pierde. Con jugador perfecto, el resultado es empate; si encuentra errores humanos, ganará.

---

## Implementación (resumen técnico)

### Nim (component)
- Señales: `cerillosTotales`, `maxPorTurno`, `inputMovimiento`, `inicioJuego`, `mensaje`, `turnoJugador`, `juegoTerminado`.
- Interfaz: formulario inicial para configurar `cerillosInicial` y `maxPorTurno`, visualización de cerillos (imágenes o emojis), controles para tomar cerillos, reiniciar.
- Renderizado de cerillos: usar un getter `cerillosArray` para iterar en template.

### Gato (component)
- Señales: `tablero`, `turnoJugador`, `juegoTerminado`, `mensaje`.
- Funciones: `moverJugador(i)`, `moverMaquina()` (invoca `minimax`), `verificarGanador(tablero, jugador)`, `reiniciar()`.
- Minimax implementado recursivamente; la máquina selecciona el índice resultante `mejorMovimiento.index`.

### Enrutamiento (standalone)
- `provideRouter(routes)` en `app.config` y `bootstrapApplication(App, appConfig)` en `main.ts`.
- Cada componente que usa `routerLink` debe importar `RouterModule` si el componente define enlaces en su propia plantilla.

---


## Buenas prácticas aplicadas
- Separación UI / Lógica: templates limpias y métodos en componentes.
- Uso de señales para reactividad clara y eficiente.
- Evitar llamadas a funciones costosas directamente en plantillas (`*ngFor` usa un getter `cerillosArray`).
- Componentes standalone para granularidad y reuso.

---

## Próximos pasos recomendados
- Implementar variante configurable en NIM (último cerillo gana/perde).
- Añadir tests unitarios básicos (verificar `minimax`, detectar victorias y empates).
- Optimizar rendimiento de Minimax si se extiende a tableros mayores (poda alpha-beta).
- Agregar accesibilidad (atributos ARIA, foco teclado para celdas).

---

## Autoría
- **Desarrollador:** Isaac Abraham De Ramón Pérez  
- **Repositorio sugerido:** `github.com/IsaacDrp`

---

Si quieres, te genero:
- Un **README.md** listo para el repo (con badges y comandos `ng`), o
- Diagramas ASCII para flujos de NIM y Minimax en Gato.

¿Cuál prefieres ahora?
