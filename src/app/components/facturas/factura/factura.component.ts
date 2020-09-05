import { ItemFactura } from './../../../models/item-factura';
import { FacturaService } from './../services/factura.service';
import { Observable } from 'rxjs';
import { Producto } from './../../../models/producto';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Cliente } from './../../../models/cliente';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    private clienteService: ClienteService,
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
      descripcion: ['', Validators.required],
      observacion: ['', Validators.required],
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

    nuevoItem.producto = producto;

    this.factura.items.push(nuevoItem);
    this.productoInput.setValue('');
    event.option.focus();
    event.option.deselect();
  }
}
