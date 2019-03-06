import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { ListaContatosComponent } from './lista-contatos/lista-contatos.component';
import { DetalhesContatoComponent } from './lista-contatos/detalhes-contato/detalhes-contato.component';
import { ApiService } from './lista-contatos/api.service';
import { ApiCorreiosService } from './lista-contatos/api-correios.service';
import { AppRoutingModule } from './app-routing.module';
import { ContatoGuard } from './lista-contatos/guard/contato.guard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaContatosComponent,
    DetalhesContatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    ApiService,
    ApiCorreiosService,
    ContatoGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
