import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.css'],
  imports: [CommonModule]
})
export class ConfirmacionComponent {
  estado = 'Verificando tu correo...';

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
