import { ClienteService } from './../../services/cliente.service';
import { Cliente } from './../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit(): void {
    this.clienteService
      .getClientes()
      .subscribe(resp => this.clientes = resp);
  }

  verDetalleCliente(id: number) {
    this.router.navigate(['clientes', id]);
  }

}
