import { ClienteService } from './../../../services/cliente.service';
import { Cliente } from './../../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css']
})
export class FormClienteComponent implements OnInit {

  clienteForm: FormGroup;
  mensaje: string;
  isSend = false;
  idCliente: number;
  cliente: Cliente;
  tituloForm = 'Crear cliente';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      this.idCliente = params['id'];
      if (this.idCliente) {
        this.cargarCliente(this.idCliente);
        this.tituloForm = 'Actualizar datos cliente';
      }
    })
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
        (rpta: any) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.isSend = true;
              this.mensaje = rpta.message;
              this.clienteForm.reset();
              this.router.navigate(['/clientes']);
            } else {
              console.log(rpta.message);
            }
          } else {
            console.log(rpta.message);
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
        (rpta: any) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.cliente = rpta.data;
              this.clienteForm.get('nombre').setValue(this.cliente.nombre);
              this.clienteForm.get('apellido').setValue(this.cliente.apellido);
              this.clienteForm.get('email').setValue(this.cliente.email);
            } else {
              console.log(rpta.message);
            }
          } else {
            console.log(rpta.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  actualizarCliente() {
    if (this.cliente) {
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.apellido = this.clienteForm.get('apellido').value;
      this.cliente.email = this.clienteForm.get('email').value;
      this.clienteService.putCliente(this.cliente.id, this.cliente).subscribe(
        (rpta: any) => {
          console.log(rpta.cliente);
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
