import { Component, OnInit } from '@angular/core';
import { ApiService } from './lista-contatos/api.service';
import 'hammerjs';

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
