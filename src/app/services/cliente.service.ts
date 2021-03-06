import { AuthService } from './auth.service';
import { Region } from './../models/region';
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
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  urlBase = `${URL_BACKEND}/api/clientes`; //'http://localhost:8080/api/clientes';
  urlRegiones = `${URL_BACKEND}/api`; //'http://localhost:8080/api';
  // httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(
    private httpCliente: HttpClient,
    private authService: AuthService
  ) {}
  /*
  private agregarAuthorizationHeader() {
    const token = this.authService.token;
    if (token) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }*/

  getClientes(page: number): Observable<PaginationCliente> {
    return this.httpCliente.get<PaginationCliente>(
      `${this.urlBase}/page/${page}`
    );
  }

  saveCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.post<ClienteResponse>(this.urlBase, cliente);
  }

  getClienteById(id: number): Observable<ClienteResponse> {
    return this.httpCliente.get<ClienteResponse>(`${this.urlBase}/${id}`);
  }

  putCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.put<ClienteResponse>(
      `${this.urlBase}/${cliente.id}`,
      cliente
    );
  }

  deleteCliente(id: number): Observable<ClienteResponse> {
    return this.httpCliente.delete<ClienteResponse>(`${this.urlBase}/${id}`);
  }

  getRegiones(): Observable<Array<Region>> {
    return this.httpCliente.get<Array<Region>>(`${this.urlRegiones}/regiones`);
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
