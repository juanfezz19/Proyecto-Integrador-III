import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Ofertas } from './components/ofertas/ofertas';
import { ServiciosComponent } from './pages/servicios/servicios';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';
import { PerfilComponent } from './pages/perfil/perfil';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'checkout', component: Checkout },
  { path: 'ofertas', component: Ofertas },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmacion', component: ConfirmacionComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
