import { FacturaComponent } from './../facturas/factura/factura.component';
import { AuthService } from './../../services/auth.service';
import { ModalService } from './../../services/modal.service';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import swal from 'sweetalert2';
import { ClienteService } from './../../services/cliente.service';
import { Cliente } from './../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  lstPages: number[] = [];
  totalPages: number;
  currentPage: number;
  isLast: boolean;
  isFirst: boolean;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let numPage = +params['page'];
      if (!numPage) {
        numPage = 0;
      }
      this.getClientes(numPage);
    });
    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes.find((client) =>
        client.id === cliente.id ? (client.foto = cliente.foto) : ''
      );
    });
  }

  getPermisos(rol: string): boolean {
    return this.authService.hasRole(rol);
  }

  getClientes(page: number) {
    this.clienteService.getClientes(page).subscribe((resp) => {
      this.clientes = resp.content;
      this.currentPage = resp.number;
      this.isLast = resp.last;
      this.isFirst = resp.first;
      this.totalPages = resp.totalPages;
      this.lstPages = [];
      for (let index = 1; index <= resp.totalPages; index++) {
        this.lstPages.push(index);
      }
    });
  }

  deleteCliente(cliente: Cliente) {
    swal
      .fire({
        title: 'Está seguro?',
        text: `Se eliminara el cliente ${cliente.nombre}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar!',
      })
      .then((result) => {
        if (result.value) {
          this.clienteService.deleteCliente(cliente.id).subscribe(
            (rpta) => {
              if (rpta.isSuccess) {
                if (!rpta.isWarning) {
                  this.getClientes(0);
                  swal.fire(
                    'Eliminado!',
                    'El cliente fue eliminado con éxito.',
                    'success'
                  );
                }
              }
            },
            (error) => {
              if (error.status === 404) {
                swal.fire('Error!', error.error.message, 'error');
              }
            }
          );
        }
      });
  }

  openDialog(clienteSend: Cliente, update: boolean) {
    const isAutoFocus = update;
    const dialogSettings = {
      width: '900px',
      autoFocus: isAutoFocus,
      data: {
        cliente: clienteSend,
        isUpdate: update,
      },
    };

    this.dialog
      .open(FormClienteComponent, dialogSettings)
      .afterClosed()
      .subscribe((rpta) => {
        if (rpta?.isUpdate) {
          this.getClientes(0);
        }
      });
  }

  nuevaFactura(cliente: Cliente) {
    const dialogSettings = {
      width: '900px',
      autoFocus: false,
      data: cliente,
    };

    this.dialog
      .open(FacturaComponent, dialogSettings)
      .afterClosed()
      .subscribe((rpta) => {
        if (rpta) {
          console.log(rpta);
        }
      });
  }
}
