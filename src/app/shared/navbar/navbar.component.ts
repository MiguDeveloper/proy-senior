import { Router } from '@angular/router';
import { Usuario } from './../../models/usuario';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuario: Usuario;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAutheticated()) {
      this.usuario = this.authService.usuario;
    }
  }

  salir() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
