import { Component, OnInit } from '@angular/core';
import { ApiService } from './lista-contatos/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.getContatosFromServer();
  }

}
