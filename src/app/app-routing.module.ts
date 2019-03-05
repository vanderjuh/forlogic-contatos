import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes } from '@angular/router';

import { DetalhesContatoComponent } from './lista-contatos/detalhes-contato/detalhes-contato.component';
import { ContatoGuard } from './lista-contatos/guard/contato.guard';

const routes: Routes = [
  {path: 'contato/:id', component: DetalhesContatoComponent, canDeactivate: [ContatoGuard]},
  {path: 'contatos', component: DetalhesContatoComponent, canDeactivate: [ContatoGuard]},
  {path: '**', redirectTo: 'contatos', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, /*{useHash: true}*/)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
