import { Producto } from './producto';
export class ItemFactura {
  id: number;
  cantidad = 1;
  importe: number;
  producto: Producto;

  calcularImporte() {
    return this.cantidad * this.producto.precio;
  }
}
