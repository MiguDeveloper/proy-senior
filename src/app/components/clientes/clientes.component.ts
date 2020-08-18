import swal from 'sweetalert2';
import { ClienteService } from './../../services/cliente.service';
import { Cliente } from './../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes() {
    this.clienteService
      .getClientes()
      .subscribe(resp => this.clientes = resp);
  }

  verDetalleCliente(id: number) {
    this.router.navigate(['clientes', id]);
  }

  deleteCliente(id: number) {
    swal.fire({
      title: 'Está seguro?',
      text: 'Se eliminara el cliente seleccionado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.deleteCliente(id).subscribe(
          rpta => {
            if (rpta.isSuccess) {
              if (!rpta.isWarning) {
                this.getClientes();
                swal.fire(
                  'Eliminado!',
                  'El cliente fue eliminado con éxito.',
                  'success'
                );
              }
            }
          },
          error => {
            if (error.status === 404) {
              swal.fire(
                'Error!',
                error.error.message,
                'error'
              );
            }
          }
        );
      }
    });
  }

}
