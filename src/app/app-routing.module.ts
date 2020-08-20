import { FormClienteComponent } from './components/clientes/form-cliente/form-cliente.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'form-cliente', component: FormClienteComponent },
  { path: 'clientes/:id', component: FormClienteComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
