import { ClienteService } from "./../../services/cliente.service";
import { Cliente } from "./../../models/cliente";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {}
}
