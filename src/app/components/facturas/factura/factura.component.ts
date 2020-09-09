import swal from 'sweetalert2';
import { ItemFactura } from './../../../models/item-factura';
import { FacturaService } from './../services/factura.service';
import { Observable } from 'rxjs';
import { Producto } from './../../../models/producto';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Cliente } from './../../../models/cliente';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from './../../../services/cliente.service';
import { Factura } from './../../../models/factura';
import { Component, OnInit, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {
  titulo: 'Nueva Factura';
  factura: Factura = new Factura();
  productoInput = new FormControl();
  productos: Producto[] = [];
  productosFiltrados: Observable<Producto[]>;

  facturaForm: FormGroup;
  items: FormArray;

  get detalle(): FormArray {
    return this.facturaForm.get('items') as FormArray;
  }

  constructor(
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<FacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private fb: FormBuilder,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.clienteService.getClienteById(this.data.id).subscribe((rpta) => {
      if (rpta.isSuccess) {
        if (!rpta.isWarning) {
          this.factura.cliente = rpta.data;
        }
      }
    });

    this.productosFiltrados = this.productoInput.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : value.nombre)),
      map((value) => (value ? this._filter(value) : []))
    );
  }

  private _filter(value: string): Producto[] {
    const filterValue = value.toLowerCase();
    this.facturaService
      .getFacturasPorTerminoBusqueda(filterValue)
      .subscribe((rpta) => {
        if (rpta.isSuccess) {
          if (!rpta.isWarning) {
            this.productos = rpta.data;
          }
        }
      });
    return this.productos;
  }

  crearFormulario() {
    this.facturaForm = this.fb.group({
      descripcion: [{ value: '', disabled: false }, Validators.required],
      observacion: [{ value: '', disabled: false }, Validators.required],
      items: this.fb.array([]),
    });
  }

  crearFactura() {
    if (this.facturaForm.valid) {
      this.factura.descripcion = this.facturaForm.get('descripcion').value;
      this.factura.observacion = this.facturaForm.get('observacion').value;

      if (this.factura.items.length === 0) {
        swal.fire('error', 'Debe de ingresar items a la factura', 'error');
        return false;
      }
      this.facturaService.createFactura(this.factura).subscribe(
        (rpta) => {
          if (rpta.isSuccess) {
            if (!rpta.isWarning) {
              this.dialogRef.close(true);
              swal.fire('Correcto', rpta.message, 'success');
            }
          }
        },
        (error) => {
          console.log('ocurrio un error ' + error);
        }
      );
    } else {
      this.checkFieldsForm();
    }
  }

  checkFieldsForm() {
    Object.values(this.facturaForm.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((control) =>
          control.markAsTouched()
        );
      } else {
        control.markAsTouched();
      }
    });
  }

  validateFormControl(nameControl: string) {
    return (
      this.facturaForm.get(nameControl).invalid &&
      this.facturaForm.get(nameControl).touched
    );
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  productoSeleccionado(event: MatAutocompleteSelectedEvent) {
    const producto = event.option.value as Producto;
    const nuevoItem = new ItemFactura();
    let cantidad = 0;

    nuevoItem.producto = producto;
    nuevoItem.importe = producto.precio;

    const isIndex = this.factura.items.findIndex((item) => {
      if (item.producto.id === producto.id) {
        ++item.cantidad;
        cantidad = item.cantidad;
        return true;
      }
    });

    if (isIndex >= 0) {
      (this.detalle.controls[isIndex] as FormArray).controls[
        'cantidad'
      ].setValue(cantidad);
      this.calcularImporte(isIndex);
    } else {
      this.factura.items.push(nuevoItem);
      this.addItem(producto);
    }

    this.productoInput.setValue('');
    event.option.focus();
    event.option.deselect();

    console.log(this.factura);
  }

  createItem(producto: Producto): FormGroup {
    return this.fb.group({
      producto: [
        { value: producto.nombre, disabled: true },
        [Validators.required],
      ],
      precio: [
        { value: producto.precio, disabled: true },
        [Validators.required],
      ],
      cantidad: [1, [Validators.required]],
      importe: [
        { value: producto.precio, disabled: true },
        [Validators.required],
      ],
    });
  }

  addItem(producto: Producto): void {
    this.detalle.push(this.createItem(producto));
  }

  calcularImporte(rowIndex: number) {
    const precio = (this.detalle.controls[rowIndex] as FormArray).controls[
      'precio'
    ].value;
    const { cantidad } = this.detalle.controls[rowIndex].value;
    if (!cantidad) {
      return false;
    }
    const subtotal = Number.parseFloat(precio) * Number.parseFloat(cantidad);

    (this.detalle.controls[rowIndex] as FormArray).controls['importe'].setValue(
      subtotal
    );

    // Actualizamos los items de las facturas
    this.factura.items[rowIndex].cantidad = Number.parseFloat(cantidad);
    this.factura.items[rowIndex].importe = subtotal;
    console.log(this.factura);
  }

  deleteItem(rowIndex: number) {
    this.detalle.removeAt(rowIndex);
    this.factura.items.splice(rowIndex, 1);
    console.log(this.factura);
  }

  calcularTotal() {
    return this.factura.items.reduce(
      (acumulador, item) => acumulador + item.importe,
      0
    );
  }
}
