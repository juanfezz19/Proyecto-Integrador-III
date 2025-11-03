// src/app/pages/home/home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newsletterEmail: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Obtener productos destacados (primeros 6)
    const allProducts = this.productService.getProducts();
    this.featuredProducts = allProducts.slice(0, 6);
  }

  onNewsletterSubmit(): void {
    if (this.newsletterEmail) {
      alert(`¡Gracias por suscribirte! Te enviaremos ofertas a ${this.newsletterEmail}`);
      this.newsletterEmail = '';
    }
  }
}