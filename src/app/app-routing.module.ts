import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes } from '@angular/router';

import { DetalhesContatoComponent } from './lista-contatos/detalhes-contato/detalhes-contato.component';

const routes: Routes = [
  {path: '', redirectTo: 'contatos', pathMatch: 'full'},
  {path: 'contatos', component: DetalhesContatoComponent},
  {path: 'contato/:id', component: DetalhesContatoComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
