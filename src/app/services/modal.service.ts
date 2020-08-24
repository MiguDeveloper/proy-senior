import { Cliente } from './../models/cliente';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  notificarUpload = new EventEmitter<Cliente>();

  constructor() {}
}
