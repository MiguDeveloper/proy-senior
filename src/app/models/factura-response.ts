import { Factura } from './factura';
export class FacturaResponse {
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
  data: Factura;
}
