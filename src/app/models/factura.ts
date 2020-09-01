import { Cliente } from './cliente';
import { ItemFactura } from './item-factura';
export interface Factura {
  id: number;
  descripcion: string;
  observacion: string;
  createAt: string;
  cliente: Cliente;
  items: ItemFactura[];
  total: number;
}
