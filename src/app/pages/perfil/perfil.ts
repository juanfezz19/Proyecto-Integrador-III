import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent {
  // Lógica del componente de perfil
  user = {
    name: 'Usuario',
    email: 'usuario@ejemplo.com'
    // Agrega más propiedades según necesites
  };
}