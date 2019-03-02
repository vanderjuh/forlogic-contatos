import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { ListaContatosComponent } from './lista-contatos/lista-contatos.component';
import { DetalhesContatoComponent } from './lista-contatos/detalhes-contato/detalhes-contato.component';
import { ApiService } from './lista-contatos/api.service';
import { ApiCorreiosService } from './lista-contatos/api-correios.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaContatosComponent,
    DetalhesContatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    ApiCorreiosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
