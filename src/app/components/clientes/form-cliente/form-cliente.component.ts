import { ClienteService } from './../../../services/cliente.service';
import { Cliente } from './../../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css']
})
export class FormClienteComponent implements OnInit {

  clienteForm: FormGroup;
  cliente: Cliente;
  tituloForm = 'Crear cliente';
  msgsValidacion: string[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      const idCliente = params['id'];
      if (idCliente) {
        this.cargarCliente(idCliente);
        this.tituloForm = 'Actualizar datos cliente';
      }
    });
  }

  validateControlForm(nameControl: string) {
    return this.clienteForm.get(nameControl).invalid && this.clienteForm.get(nameControl).touched;
  }

  createForm() {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
        ]
      ]
    });
  }

  saveForm() {
    if (this.clienteForm.valid) {
      const cliente = new Cliente();
      cliente.nombre = this.clienteForm.get('nombre').value;
      cliente.apellido = this.clienteForm.get('apellido').value;
      cliente.email = this.clienteForm.get('email').value;

      this.clienteService.saveCliente(cliente).subscribe(
        (rpta) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.clienteForm.reset();
              this.router.navigate(['/clientes']);
              swal.fire('Muy bien', rpta.message, 'success');
            }
          }
        },
        error => {
          if (error.status === 400) {
            this.msgsValidacion = error.error.errors;
            swal.fire('Error', error.error.message, 'error');
          }
          if (error.status === 404) {
            swal.fire('Error', error.error.message, 'error');
          }
        }
      );
    } else {
      this.checkFieldsForm();
    }
  }

  cargarCliente(id: number) {
    if (id) {
      this.clienteService.getClienteById(id).subscribe(
        (rpta) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.cliente = rpta.data;
              this.clienteForm.get('nombre').setValue(this.cliente.nombre);
              this.clienteForm.get('apellido').setValue(this.cliente.apellido);
              this.clienteForm.get('email').setValue(this.cliente.email);
            }
          }
        },
        error => {
          this.router.navigate(['/clientes']);
          swal.fire('Error', error.error.message, 'error');
        }
      );
    }
  }

  actualizarCliente() {
    if (this.cliente) {
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.apellido = this.clienteForm.get('apellido').value;
      this.cliente.email = this.clienteForm.get('email').value;
      this.clienteService.putCliente(this.cliente).subscribe(
        rpta => {
          if (rpta.isSuccess) {
            this.router.navigate(['/clientes']);
            if (!rpta.isWarning) {
              swal.fire('Muy bien', rpta.message, 'success');
            }
          }
        },
        error => {
          if (error.status === 400) {
            this.msgsValidacion = error.error.errors;
            swal.fire('Error', error.error.message, 'error');
          } else if (error.status === 404) {
            swal.fire('Error', error.error.message, 'error');
          } else {
            swal.fire('Error', error.error.message, 'error');
          }
        }
      );
    }
  }

  checkFieldsForm() {
    Object.values(this.clienteForm.controls)
      .forEach(control => {
        control.markAsTouched();
      });
  }

}
