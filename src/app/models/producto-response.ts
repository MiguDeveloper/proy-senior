import { Producto } from './producto';

export interface ProductoResponse {
  isSuccess: boolean;
  isWarning: boolean;
  message: string;
  data: Producto[];
}
