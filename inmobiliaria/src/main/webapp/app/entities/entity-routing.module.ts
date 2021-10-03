import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario-ex',
        data: { pageTitle: 'inmobiliariaApp.usuarioEx.home.title' },
        loadChildren: () => import('./usuario-ex/usuario-ex.module').then(m => m.UsuarioExModule),
      },
      {
        path: 'contrato',
        data: { pageTitle: 'inmobiliariaApp.contrato.home.title' },
        loadChildren: () => import('./contrato/contrato.module').then(m => m.ContratoModule),
      },
      {
        path: 'valoracion',
        data: { pageTitle: 'inmobiliariaApp.valoracion.home.title' },
        loadChildren: () => import('./valoracion/valoracion.module').then(m => m.ValoracionModule),
      },
      {
        path: 'cargo',
        data: { pageTitle: 'inmobiliariaApp.cargo.home.title' },
        loadChildren: () => import('./cargo/cargo.module').then(m => m.CargoModule),
      },
      {
        path: 'ingreso',
        data: { pageTitle: 'inmobiliariaApp.ingreso.home.title' },
        loadChildren: () => import('./ingreso/ingreso.module').then(m => m.IngresoModule),
      },
      {
        path: 'inmueble',
        data: { pageTitle: 'inmobiliariaApp.inmueble.home.title' },
        loadChildren: () => import('./inmueble/inmueble.module').then(m => m.InmuebleModule),
      },
      {
        path: 'habitacion',
        data: { pageTitle: 'inmobiliariaApp.habitacion.home.title' },
        loadChildren: () => import('./habitacion/habitacion.module').then(m => m.HabitacionModule),
      },
      {
        path: 'servicio',
        data: { pageTitle: 'inmobiliariaApp.servicio.home.title' },
        loadChildren: () => import('./servicio/servicio.module').then(m => m.ServicioModule),
      },
      {
        path: 'empresa',
        data: { pageTitle: 'inmobiliariaApp.empresa.home.title' },
        loadChildren: () => import('./empresa/empresa.module').then(m => m.EmpresaModule),
      },
      {
        path: 'foto-habitacion',
        data: { pageTitle: 'inmobiliariaApp.fotoHabitacion.home.title' },
        loadChildren: () => import('./foto-habitacion/foto-habitacion.module').then(m => m.FotoHabitacionModule),
      },
      {
        path: 'foto-usuario',
        data: { pageTitle: 'inmobiliariaApp.fotoUsuario.home.title' },
        loadChildren: () => import('./foto-usuario/foto-usuario.module').then(m => m.FotoUsuarioModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
