// navbar.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartItemCount = 3; 
  isScrolled = false;
  isSearchOpen = false;
  searchQuery = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  
  }

  // Toggle del menú móvil
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevenir scroll del body cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Cerrar menú al hacer click en un link (útil en móvil)
  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Toggle del buscador
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    
    // Enfocar el input cuando se abre
    if (this.isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      // Limpiar búsqueda al cerrar
      this.searchQuery = '';
    }
  }

  // Realizar búsqueda
  performSearch(): void {
    if (this.searchQuery.trim()) {
      // Navegar a productos con query parameter
      this.router.navigate(['/productos'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
      
      // Cerrar el buscador
      this.isSearchOpen = false;
      this.searchQuery = '';
      
      // Cerrar menú móvil si está abierto
      if (this.isMenuOpen) {
        this.closeMenu();
      }
    }
  }

  // Manejar tecla Enter en el input
  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch();
    } else if (event.key === 'Escape') {
      this.toggleSearch();
    }
  }

  // Detectar scroll para agregar clase .scrolled
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  // Cerrar menú al cambiar el tamaño de la ventana (si pasamos a desktop)
  @HostListener('window:resize', [])
  onResize(): void {
    if (window.innerWidth > 992 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  // Cerrar búsqueda al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.search-container');
    
    if (this.isSearchOpen && searchContainer && !searchContainer.contains(target)) {
      this.isSearchOpen = false;
      this.searchQuery = '';
    }
  }
}