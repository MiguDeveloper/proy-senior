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

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  urlBase = 'http://localhost:8080/api/clientes';
  urlRegiones = 'http://localhost:8080/api';
  httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(
    private httpCliente: HttpClient,
    private authService: AuthService
  ) {}

  private agregarAuthorizationHeader() {
    const token = this.authService.token;
    if (token) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  getClientes(page: number): Observable<PaginationCliente> {
    return this.httpCliente.get<PaginationCliente>(
      `${this.urlBase}/page/${page}`
    );
  }

  saveCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.post<ClienteResponse>(this.urlBase, cliente, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  getClienteById(id: number): Observable<ClienteResponse> {
    return this.httpCliente.get<ClienteResponse>(`${this.urlBase}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  putCliente(cliente: Cliente): Observable<ClienteResponse> {
    return this.httpCliente.put<ClienteResponse>(
      `${this.urlBase}/${cliente.id}`,
      cliente,
      { headers: this.agregarAuthorizationHeader() }
    );
  }

  deleteCliente(id: number): Observable<ClienteResponse> {
    return this.httpCliente.delete<ClienteResponse>(`${this.urlBase}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  getRegiones(): Observable<Array<Region>> {
    return this.httpCliente.get<Array<Region>>(`${this.urlRegiones}/regiones`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    let httpHeaders = new HttpHeaders();
    const token = this.authService.token;
    if (token) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    const req = new HttpRequest('POST', `${this.urlBase}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders,
    });

    return this.httpCliente.request(req);
  }
}
