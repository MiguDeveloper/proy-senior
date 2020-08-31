import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Para evitar que se muestren los dos guards debemos de validar primero uno y luego ejecutar segun sea el caso el otro guard
    if (!this.authService.isAutheticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const role = next.data['role'] as string;
    if (this.authService.hasRole(role)) {
      return true;
    }
    swal.fire(
      'Error',
      `Hola ${this.authService.usuario.username} no tienes acceso al recurso`,
      'error'
    );
    this.router.navigate(['/clientes/page/0']);
    return false;
  }
}
