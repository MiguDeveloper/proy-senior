import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Usuario } from './../../models/usuario';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  titulo = 'Iniciar sesión';
  loginForm: FormGroup;
  usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = new Usuario();
    if (this.authService.isAutheticated()) {
      swal.fire(
        'Login',
        `${this.authService.usuario.username} ya esta autenticado`,
        'info'
      );
      this.router.navigate(['/clientes/page/0']);
    }
    this.crearFormulario();
  }

  crearFormulario() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  validateFormControl(nameControl: string) {
    return (
      this.loginForm.get(nameControl).touched &&
      this.loginForm.get(nameControl).invalid
    );
  }

  login() {
    if (this.loginForm.valid) {
      this.usuario.username = this.loginForm.get('username').value;
      this.usuario.password = this.loginForm.get('password').value;
      this.authService.login(this.usuario).subscribe(
        (rpta) => {
          this.authService.guardarUsuario(rpta.access_token);
          this.authService.guardarToken(rpta.access_token);
          // Si quisieramos usar la data por metodo 'get'
          const usuario = this.authService.usuario;
          this.router.navigate(['/clientes/page/0']);
          swal.fire(
            'Bienvenido',
            `${rpta.nombre} al sistema de mantenimiento de clientes`,
            'success'
          );
        },
        (error) => {
          if (error.status === 400) {
            swal.fire('Error', 'Usuario o password incorrectos', 'error');
          }
        }
      );
    } else {
      this.checkFieldsForm();
    }
  }

  checkFieldsForm() {
    Object.values(this.loginForm.controls).forEach((control) =>
      control.markAsTouched()
    );
  }
}
