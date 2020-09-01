import { Producto } from './producto';
export class ItemFactura {
  id: number;
  cantidad = 1;
  importe: number;
  producto: Producto;

  calcularImporte() {
    this.importe = this.cantidad * this.producto.precio;
  }
}
