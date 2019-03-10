import { Component } from '@angular/core';
import { ContatosService } from './shared/services/contatos.service';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private contatosService: ContatosService) { }

  getContatos(): any[] {
    return this.contatosService.listaContatos;
  }

}
