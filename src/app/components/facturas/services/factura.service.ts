import { URL_BACKEND } from './../../../config/config';
import { Factura } from './../../../models/factura';
import { ProductoResponse } from './../../../models/producto-response';
import { FacturaResponse } from '../../../models/factura-response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  urlEndpoint = `${URL_BACKEND}/api/facturas`; //'http://localhost:8080/api/facturas';

  constructor(private httpClient: HttpClient) {}

  getFactura(id: number): Observable<FacturaResponse> {
    return this.httpClient.get<FacturaResponse>(`${this.urlEndpoint}/${id}`);
  }

  deleteFactura(id: number): Observable<FacturaResponse> {
    return this.httpClient.delete<FacturaResponse>(`${this.urlEndpoint}/${id}`);
  }

  getFacturasPorTerminoBusqueda(termino: string): Observable<ProductoResponse> {
    return this.httpClient.get<ProductoResponse>(
      `${this.urlEndpoint}/filtrar-productos/${termino}`
    );
  }

  createFactura(factura: Factura): Observable<FacturaResponse> {
    return this.httpClient.post<FacturaResponse>(this.urlEndpoint, factura);
  }
}
