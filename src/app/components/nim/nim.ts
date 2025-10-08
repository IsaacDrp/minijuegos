import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nim',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nim.html',
  styleUrls: ['./nim.css']
})
export class Nim {
  // Configuración inicial
  cerillosTotales = signal(21);         
  maxPorTurno = signal(3);              
  turnoJugador = signal(true);          
  juegoTerminado = signal(false);
  mensaje = signal('¡Tu turno!');

  // Inputs
  inputMovimiento = signal(1);

  // Formulario de configuración
  inicioJuego = signal(false); // false = mostrando formulario

  cerillosInicial = signal(21);
  maxPorTurnoInput = signal(3);

  // Función para iniciar juego con valores personalizados
  iniciarJuego() {
    this.cerillosTotales.set(this.cerillosInicial());
    this.maxPorTurno.set(this.maxPorTurnoInput());
    this.inputMovimiento.set(1);
    this.turnoJugador.set(true);
    this.juegoTerminado.set(false);
    this.mensaje.set('¡Tu turno!');
    this.inicioJuego.set(true); // Oculta formulario y muestra juego
  }

  jugadorToma() {
    const tomar = this.inputMovimiento();
    if (tomar < 1 || tomar > this.maxPorTurno() || tomar > this.cerillosTotales()) return;

    this.cerillosTotales.update(n => n - tomar);
    if (this.cerillosTotales() <= 0) {
      this.juegoTerminado.set(true);
      this.mensaje.set('¡Perdiste!');
      return;
    }

    this.turnoJugador.set(false);
    this.mensaje.set('Turno de la máquina...');
    setTimeout(() => this.maquinaToma(), 1000);
  }

  maquinaToma() {
    let tomar = 1;
    if (this.cerillosTotales() % 4 !== 0) {
      tomar = this.cerillosTotales() % 4;
    }

    this.cerillosTotales.update(n => n - tomar);

    if (this.cerillosTotales() <= 0) {
      this.juegoTerminado.set(true);
      this.mensaje.set('¡Ganaste!');
      return;
    }

    this.turnoJugador.set(true);
    this.mensaje.set('¡Tu turno!');
  }

  reiniciar() {
    this.inicioJuego.set(false); // vuelve al formulario
    this.cerillosInicial.set(21);
    this.maxPorTurnoInput.set(3);
  }

  get cerillosArray() {
    return Array.from({ length: this.cerillosTotales() });
  }
}
