import { Cliente } from './../models/cliente';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  urlBase = 'http://localhost:8080/api/clientes';
  httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(private httpCliente: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.httpCliente.get<Cliente[]>(this.urlBase);
  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpCliente.post<Cliente>(this.urlBase, cliente, { headers: this.httpHeaders });
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.httpCliente.get<Cliente>(`${this.urlBase}/${id}`);
  }

  putCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.httpCliente.put<Cliente>(`${this.urlBase}/${id}`, cliente);
  }
}
