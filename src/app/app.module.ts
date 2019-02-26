import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { ListaContatosComponent } from './lista-contatos/lista-contatos.component';
import { DetalhesContatoComponent } from './detalhes-contato/detalhes-contato.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaContatosComponent,
    DetalhesContatoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
