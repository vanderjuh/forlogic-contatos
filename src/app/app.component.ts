import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './lista-contatos/api.service';
import 'hammerjs';
import { Subscription } from 'rxjs';
import { DetalhesContatoComponent } from './lista-contatos/detalhes-contato/detalhes-contato.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private apiService: ApiService) { }

  getContatos(): any[] {
    return this.apiService.listaContatos;
  }

}
