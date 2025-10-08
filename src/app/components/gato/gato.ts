import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gato.html',
  styleUrls: ['./gato.css']
})
export class Gato {
  // Señales
  tablero = signal<string[]>(Array(9).fill(''));
  turnoJugador = signal(true);
  juegoTerminado = signal(false);
  mensaje = signal('Tu turno (X)');

  // Movimiento del jugador
  moverJugador(i: number) {
    if (this.juegoTerminado() || this.tablero()[i] !== '') return;

    const nuevoTablero = [...this.tablero()];
    nuevoTablero[i] = 'X';
    this.tablero.set(nuevoTablero);

    if (this.verificarGanador(nuevoTablero, 'X')) {
      this.juegoTerminado.set(true);
      this.mensaje.set('¡Ganaste!');
      return;
    }

    if (nuevoTablero.every(c => c !== '')) {
      this.juegoTerminado.set(true);
      this.mensaje.set('Empate');
      return;
    }

    this.turnoJugador.set(false);
    this.mensaje.set('Turno de la máquina...');
    setTimeout(() => this.moverMaquina(), 600);
  }

  // Movimiento de la máquina (IA con Minimax)
  moverMaquina() {
    const mejorMovimiento = this.minimax(this.tablero(), 0, true).index;
    if (mejorMovimiento !== undefined) {
      const nuevoTablero = [...this.tablero()];
      nuevoTablero[mejorMovimiento] = 'O';
      this.tablero.set(nuevoTablero);
    }

    if (this.verificarGanador(this.tablero(), 'O')) {
      this.juegoTerminado.set(true);
      this.mensaje.set('Perdiste');
      return;
    }

    if (this.tablero().every(c => c !== '')) {
      this.juegoTerminado.set(true);
      this.mensaje.set('Empate');
      return;
    }

    this.turnoJugador.set(true);
    this.mensaje.set('Tu turno (X)');
  }

  // Algoritmo Minimax
  minimax(tablero: string[], profundidad: number, esMax: boolean): any {
    // Comprobaciones base
    if (this.verificarGanador(tablero, 'O')) return { score: 10 - profundidad };
    if (this.verificarGanador(tablero, 'X')) return { score: profundidad - 10 };
    if (tablero.every(c => c !== '')) return { score: 0 };

    const movimientos: any[] = [];

    tablero.forEach((celda, index) => {
      if (celda === '') {
        const nuevoTablero = [...tablero];
        nuevoTablero[index] = esMax ? 'O' : 'X';

        const resultado = this.minimax(nuevoTablero, profundidad + 1, !esMax);
        movimientos.push({ index, score: resultado.score });
      }
    });

    // Maximizar (máquina) o minimizar (jugador)
    if (esMax) {
      return movimientos.reduce((mejor, mov) => (mov.score > mejor.score ? mov : mejor));
    } else {
      return movimientos.reduce((mejor, mov) => (mov.score < mejor.score ? mov : mejor));
    }
  }

  // Verificar ganador
  verificarGanador(tablero: string[], jugador: string): boolean {
    const combinaciones = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    return combinaciones.some(([a, b, c]) => tablero[a] === jugador && tablero[b] === jugador && tablero[c] === jugador);
  }

  // Reiniciar
  reiniciar() {
    this.tablero.set(Array(9).fill(''));
    this.turnoJugador.set(true);
    this.juegoTerminado.set(false);
    this.mensaje.set('Tu turno (X)');
  }
}
