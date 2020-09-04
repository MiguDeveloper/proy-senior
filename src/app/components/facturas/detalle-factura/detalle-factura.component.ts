import { FacturaService } from './../services/factura.service';
import { Factura } from './../../../models/factura';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css'],
})
export class DetalleFacturaComponent implements OnInit {
  factura: Factura;

  constructor(
    private dialogRef: MatDialogRef<DetalleFacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Factura,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.getDetalleFactura();
  }

  getDetalleFactura() {
    this.facturaService.getFactura(this.data.id).subscribe(
      (rpta) => {
        if (rpta.isSuccess) {
          if (!rpta.isWarning) {
            this.factura = rpta.data;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
