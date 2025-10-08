import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quince',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quince.html',
  styleUrls: ['./quince.css']
})
export class Quince {

  cartasDisponibles = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  cartasJugador = signal<number[]>([]);
  cartasMaquina = signal<number[]>([]);
  turnoJugador = signal(true);
  mensaje = signal('Tu turno para elegir una carta.');
  juegoTerminado = signal(false);

  tomarCarta(valor: number) {
    if (!this.turnoJugador() || !this.cartasDisponibles().includes(valor) || this.juegoTerminado()) return;

    // Jugador toma carta
    this.cartasJugador.update(c => [...c, valor]);
    this.cartasDisponibles.update(c => c.filter(x => x !== valor));

    // Turno de la máquina si todavía no tiene 3 cartas
    if (this.cartasMaquina().length < 3 && !this.juegoTerminado()) {
      this.turnoJugador.set(false);
      this.mensaje.set('Turno de la máquina...');
      setTimeout(() => this.turnoMaquina(), 700);
    } else {
      this.turnoJugador.set(false);
      this.evaluarResultado();
    }
  }

  turnoMaquina() {
    const disponibles = this.cartasDisponibles();
    if (disponibles.length === 0 || this.cartasMaquina().length >= 3) {
      this.evaluarResultado();
      return;
    }

    let eleccion: number | undefined;

    // 1. Intentar ganar: si tiene 2 cartas, buscar tercera que sume 15
    if (this.cartasMaquina().length === 2) {
      eleccion = disponibles.find(carta =>
        this.cartasMaquina().reduce((a, b) => a + b, 0) + carta === 15
      );
    }

    // 2. Bloquear al jugador si este tiene 2 cartas y puede sumar 15
    if (!eleccion && this.cartasJugador().length === 2) {
      eleccion = disponibles.find(carta =>
        this.cartasJugador().reduce((a, b) => a + b, 0) + carta === 15
      );
    }

    // 3. Si no hay jugada inmediata, tomar carta estratégica (prioridad: centro 5, luego esquinas)
    if (!eleccion) {
      const estrategias = [5, 1, 3, 7, 9, 2, 4, 6, 8];
      eleccion = estrategias.find(carta => disponibles.includes(carta));
    }

    // 4. Si nada, tomar aleatoria
    if (!eleccion) {
      eleccion = disponibles[Math.floor(Math.random() * disponibles.length)];
    }

    // Tomar la carta seleccionada
    this.cartasMaquina.update(c => [...c, eleccion!]);
    this.cartasDisponibles.update(c => c.filter(x => x !== eleccion));

    if (this.cartasJugador().length < 3) {
      this.turnoJugador.set(true);
      this.mensaje.set('Tu turno para elegir una carta.');
    } else {
      this.evaluarResultado();
    }
  }

  evaluarResultado() {
    this.juegoTerminado.set(true);

    const sumaJugador = this.cartasJugador().reduce((a, b) => a + b, 0);
    const sumaMaquina = this.cartasMaquina().reduce((a, b) => a + b, 0);

    if (sumaJugador === 15 && sumaMaquina !== 15) {
      this.mensaje.set('¡Ganaste! 😎');
    } else if (sumaMaquina === 15 && sumaJugador !== 15) {
      this.mensaje.set('La máquina ganó 🤖');
    } else {
      this.mensaje.set('Empate 🤝');
    }
  }

  reiniciar() {
    this.cartasDisponibles.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    this.cartasJugador.set([]);
    this.cartasMaquina.set([]);
    this.turnoJugador.set(true);
    this.juegoTerminado.set(false);
    this.mensaje.set('Tu turno para elegir una carta.');
  }
}
