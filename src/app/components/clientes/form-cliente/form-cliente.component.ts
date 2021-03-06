import { URL_BACKEND } from './../../../config/config';
import { FacturaService } from './../../facturas/services/factura.service';
import { DetalleFacturaComponent } from './../../facturas/detalle-factura/detalle-factura.component';
import { Factura } from './../../../models/factura';
import { AuthService } from './../../../services/auth.service';
import { Region } from './../../../models/region';
import { ModalService } from './../../../services/modal.service';
import { ClienteResponse } from './../../../models/cliente-response';
import { ClienteService } from './../../../services/cliente.service';
import { Cliente } from './../../../models/cliente';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import swal from 'sweetalert2';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

export interface DialogData {
  cliente: Cliente;
  isUpdate: boolean;
}

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css'],
})
export class FormClienteComponent implements OnInit {
  clienteForm: FormGroup;
  cliente: Cliente;
  tituloForm = 'Crear cliente';
  msgsValidacion: string[] = [];
  private fotoSeleccionada: File;
  progreso = 0;
  regiones: Region[] = [];
  urlBackend = URL_BACKEND;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<FormClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private modalService: ModalService,
    private authService: AuthService,
    private dialog: MatDialog,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.data.cliente) {
      this.cliente = this.data.cliente;
      this.cargarCliente();
      if (this.data.isUpdate) {
        this.tituloForm = 'Actualizar datos cliente';
      } else {
        this.tituloForm = 'Datos cliente';
      }
    } else {
      this.tituloForm = 'Crear cliente';
    }
  }

  getPermisos(rol: string): boolean {
    return this.authService.hasRole(rol);
  }

  validateControlForm(nameControl: string) {
    return (
      this.clienteForm.get(nameControl).invalid &&
      this.clienteForm.get(nameControl).touched
    );
  }

  createForm() {
    this.clienteForm = this.fb.group({
      nombre: [
        { value: '', disabled: !this.data.isUpdate },
        Validators.required,
      ],
      apellido: [
        { value: '', disabled: !this.data.isUpdate },
        Validators.required,
      ],
      email: [
        { value: '', disabled: !this.data.isUpdate },
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      createAt: [
        { value: '', disabled: !this.data.isUpdate },
        Validators.required,
      ],
      region: [
        { value: '', disabled: !this.data.isUpdate },
        Validators.required,
      ],
    });
    this.getRegiones();
  }

  saveForm() {
    if (this.clienteForm.valid) {
      const cliente = new Cliente();
      cliente.nombre = this.clienteForm.get('nombre').value;
      cliente.apellido = this.clienteForm.get('apellido').value;
      cliente.email = this.clienteForm.get('email').value;
      cliente.createAt = this.clienteForm.get('createAt').value;
      cliente.region = this.regiones.find(
        (region) => region.id === +this.clienteForm.get('region').value
      );

      this.clienteService.saveCliente(cliente).subscribe(
        (rpta) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.clienteForm.reset();
              this.closeDialog(true);
              swal.fire('Muy bien', rpta.message, 'success');
            }
          }
        },
        (error) => {
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

  cargarCliente() {
    this.clienteForm.get('nombre').setValue(this.cliente.nombre);
    this.clienteForm.get('apellido').setValue(this.cliente.apellido);
    this.clienteForm.get('email').setValue(this.cliente.email);
    this.clienteForm.get('createAt').setValue(this.cliente.createAt);
    this.clienteForm.get('region').setValue(this.cliente.region.id);
  }

  actualizarCliente() {
    if (this.clienteForm.valid) {
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.apellido = this.clienteForm.get('apellido').value;
      this.cliente.email = this.clienteForm.get('email').value;
      this.cliente.createAt = this.clienteForm.get('createAt').value;
      this.cliente.region = this.regiones.find(
        (region) => region.id === +this.clienteForm.get('region').value
      );
      this.cliente.facturas = null;
      this.clienteService.putCliente(this.cliente).subscribe(
        (rpta) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.closeDialog(true);
              swal.fire('Muy bien', rpta.message, 'success');
            }
          }
        },
        (error) => {
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

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error', 'Solo puede ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {
    if (this.fotoSeleccionada) {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(
          (rpta) => {
            if (rpta.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((rpta.loaded / rpta.total) * 100);
            } else if (rpta.type === HttpEventType.Response) {
              const clienteResponse = rpta.body as ClienteResponse;
              this.cliente = clienteResponse.data;
              this.fotoSeleccionada = null;
              this.modalService.notificarUpload.emit(this.cliente);
              swal.fire('Muy bien', clienteResponse.message, 'success');
            }
          },
          (error) => {
            swal.fire('Error', error.error.message, 'error');
          }
        );
    } else {
      swal.fire('Error', 'Debe seleccionar un archivo', 'error');
    }
  }

  openDialog(factura: Factura) {
    const dialogSettings = {
      width: '900px',
      autoFocus: false,
      data: factura,
    };

    this.dialog
      .open(DetalleFacturaComponent, dialogSettings)
      .afterClosed()
      .subscribe((rpta) => rpta);
  }

  getRegiones() {
    this.clienteService.getRegiones().subscribe(
      (rpta) => {
        this.regiones = rpta;
      },
      (error) => {}
    );
  }

  eliminarFactura(id: number) {
    swal
      .fire({
        title: 'Está seguro?',
        text: `Esta a punto de eliminar la factura ${id}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
      })
      .then((result) => {
        if (result.value) {
          this.facturaService.deleteFactura(id).subscribe((rpta) => {
            if (rpta.isSuccess) {
              if (!rpta.isWarning) {
                this.cliente.facturas = this.cliente.facturas.filter(
                  (factura) => factura.id !== id
                );
                swal.fire('Eliminado', rpta.message, 'success');
              }
            }
          });
        }
      });
  }

  closeDialog(estado: boolean) {
    this.dialogRef.close({ isUpdate: estado });
  }

  checkFieldsForm() {
    Object.values(this.clienteForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
