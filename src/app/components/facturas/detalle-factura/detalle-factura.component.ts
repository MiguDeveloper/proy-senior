import { Factura } from './../../../models/factura';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css'],
})
export class DetalleFacturaComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DetalleFacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Factura
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
