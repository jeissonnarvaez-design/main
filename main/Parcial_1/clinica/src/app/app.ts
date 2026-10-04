import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gestion, Historial, Rotacion, Comite } from './models/models';

export interface Paciente {
  id: number;
  nombre: string;
  sintomas: string;
}

export interface RegistroHistorial {
  idPaciente: number;
  nombrePaciente: string;
  medicoAtendio: string;
  fechaHora: string;
  diagnostico: string;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface MiembroComite {
  id: number;
  nombre: string;
  cargo: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit, OnDestroy {
  public listaEspera = new Gestion<Paciente>();
  public listaHistorial= new Historial<RegistroHistorial>();
  public listaMedicos = new Rotacion<Medico>();
  public listaComite = new Comite<MiembroComite>();

  public listaEsperaSignal = signal<Paciente[]>([]);
  public listaHistorialSignal = signal<RegistroHistorial[]>([]);
  public listaMedicosSignal = signal<Medico[]>([]);
  public listaComiteSignal = signal<MiembroComite[]>([]);

  public currentMedicosSignal = signal<Medico | null>(null);
  public currentComiteSignal = signal<MiembroComite | null>(null);
  public temporizadorSignal = signal<number>(10);

  public newNombrePaciente: string = '';
  public newSintomasPaciente: string = '';
  public Diagnostico: string = 'Consulta médica general exitosa.';

  private rotationInterval: any;
  private countdownInterval: any;
  private patientIdCounter = 1;

  ngOnInit(): void {
    this.informacionInicial();
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.rotationInterval);
    clearInterval(this.countdownInterval);
  }

  private informacionInicial(): void {
    const medicos: Medico[] = [
      { id: 1, nombre: 'Dr. Alejandro Soto', especialidad: 'Urgencias' },
      { id: 2, nombre: 'Dra. María Fernández', especialidad: 'Pediatría' },
      { id: 3, nombre: 'Dr. Carlos Mendoza', especialidad: 'Medicina General' },
    ];
    medicos.forEach((medico) => this.listaMedicos.append(medico));
    this.listaMedicosSignal.set(medicos);
    this.currentMedicosSignal.set(this.listaMedicos.current?.value || null);

    this.anadirPacienteCola('Laura Gómez', 'Fiebre y dolor de cabeza');
    this.anadirPacienteCola('Andrés Ramírez', 'Dolor abdominal severo');

    const miembrosComite: MiembroComite[] = [
      { id: 101, nombre: 'Dra. Elena Rossi', cargo: 'Directora Médica' },
      { id: 102, nombre: 'Lic. Roberto Silva', cargo: 'Jefe de Operaciones' },
      { id: 103, nombre: 'Dra. Patricia Ortiz', cargo: 'Supervisora de Calidad' },
    ];
    miembrosComite.forEach((miembro) => this.listaComite.append(miembro));
    this.listaComiteSignal.set(miembrosComite);
    this.currentComiteSignal.set(this.listaComite.current?.value || null);
  }

  private iniciarTimer(): void {
    this.countdownInterval = setInterval(() => {
      if (this.temporizadorSignal() > 1) {
        this.temporizadorSignal.update((v) => v - 1);
      } else {
        this.temporizadorSignal.set(10);
      }
    }, 1000);

    this.rotationInterval = setInterval(() => {
      this.listaMedicos.rotateNext();
      this.currentMedicosSignal.set(this.listaMedicos.current?.value || null);
    }, 10000);
  }

  public anadirPaciente(): void {
    if (!this.newNombrePaciente.trim()) return;
    this.anadirPacienteCola(this.newNombrePaciente, this.newSintomasPaciente);
    this.newNombrePaciente = '';
    this.newSintomasPaciente = '';
  }

  private anadirPacienteCola(nombre: string, sintomas: string): void {
    const paciente: Paciente = {
      id: this.patientIdCounter++,
      nombre,
      sintomas: sintomas || 'Sin síntomas registrados',
    };
    this.listaEspera.append(paciente);
    this.listaEsperaSignal.update((pacientes) => [...pacientes, paciente]);
  }

  public atenderPaciente(): void {
    const pacientesEnEspera = this.listaEsperaSignal();
    const patientAttended = pacientesEnEspera[0];
    if (!patientAttended) return;

    const currentDoc = this.currentMedicosSignal();
    const registro: RegistroHistorial = {
      idPaciente: patientAttended.id,
      nombrePaciente: patientAttended.nombre,
      medicoAtendio: currentDoc ? `${currentDoc.nombre} (${currentDoc.especialidad})` : 'Médico General',
      fechaHora: new Date().toLocaleTimeString(),
      diagnostico: this.Diagnostico,
    };

    this.listaHistorial.append(registro);

    this.listaEsperaSignal.set(pacientesEnEspera.slice(1));
    this.listaHistorialSignal.update((historial) => [...historial, registro]);
  }

  public siguienteMiembroComite(): void {
    this.listaComite.nextMember();
    this.currentComiteSignal.set(this.listaComite.current?.value || null);
  }

  public miembroAnteriorComite(): void {
    this.listaComite.prevMember();
    this.currentComiteSignal.set(this.listaComite.current?.value || null);
  }
}