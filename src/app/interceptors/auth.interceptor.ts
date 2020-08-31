import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          if (this.authService.isAutheticated) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
          swal.fire('Error!', 'Primero debe ingresar al sistema', 'error');
        }
        if (error.status === 403) {
          swal.fire(
            'Error!',
            'Usted no tiene los permisos para esta acción',
            'error'
          );
          this.router.navigate(['/clientes/page/0']);
        }
        return throwError(error);
      })
    );
  }
}
