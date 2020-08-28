import { Usuario } from './../models/usuario';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // se usa _ ya que es una propiedad privada y va a tener
  // un metodo accesor de getter
  private _usuario: Usuario;
  private _token: string;

  constructor(private httpCliente: HttpClient) {}

  // usamos los metodos get  para q cuando se consuma el servicio podamos
  // usar estos metodos y obtener la data
  public get usuario(): Usuario {
    if (this._usuario) {
      return this._usuario;
    } else if (sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }

    return new Usuario();
  }

  public get token(): string {
    if (this._token) {
      return this._token;
    } else if (sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }

    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlBase = 'http://localhost:8080/oauth/token';
    const params = new URLSearchParams();
    const credenciales = btoa('angularapp' + ':' + '12345');
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });
    return this.httpCliente.post(urlBase, params.toString(), {
      headers: httpHeaders,
    });
  }

  logout() {
    this._usuario = null;
    this._token = null;
    sessionStorage.clear();
  }

  guardarUsuario(accessToken: string) {
    const payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string) {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }

    return null;
  }

  isAutheticated(): boolean {
    const paylaod = this.obtenerDatosToken(this.token);
    if (paylaod && paylaod.user_name && paylaod.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.token) {
      const payload = this.obtenerDatosToken(this.token);
      const estado = payload.authorities.includes(role) ? true : false;
      return estado;
    }

    return false;
  }
}
