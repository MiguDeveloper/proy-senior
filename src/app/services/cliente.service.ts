import { PaginationCliente } from './../models/pagination-cliente';
import { ClienteResponse } from './../models/cliente-response';
import { Cliente } from './../models/cliente';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  urlBase = 'http://localhost:8080/api/clientes';
  httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(private httpCliente: HttpClient) {}

  getClientes(page: number): Observable<PaginationCliente> {
    return this.httpCliente.get<PaginationCliente>(
      `${this.urlBase}/page/${page}`
    );
  }

  saveCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.post<ClienteResponse>(this.urlBase, cliente, {
      headers: this.httpHeaders,
    });
  }

  getClienteById(id: number): Observable<ClienteResponse> {
    return this.httpCliente.get<ClienteResponse>(`${this.urlBase}/${id}`);
  }

  putCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.put<ClienteResponse>(
      `${this.urlBase}/${cliente.id}`,
      cliente,
      { headers: this.httpHeaders }
    );
  }

  deleteCliente(id: number): Observable<ClienteResponse> {
    return this.httpCliente.delete<ClienteResponse>(`${this.urlBase}/${id}`);
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlBase}/upload`, formData, {
      reportProgress: true,
    });
    return this.httpCliente.request(req);
  }
}
