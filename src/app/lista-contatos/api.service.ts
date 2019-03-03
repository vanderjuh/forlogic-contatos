import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { ApiCorreiosService } from './api-correios.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  contatosCarregados = new EventEmitter<boolean>();
  emitirNovoContato = new EventEmitter<object>();
  listaContatos: object[];

  constructor(
    private apiCorreios: ApiCorreiosService,
    private router: Router
  ) { }

  async getContatosFromServer(): Promise<any> {
    let lista: any = [];
    try {
      const res = await fetch('http://contacts-api.azurewebsites.net/api/contacts?limit=101');
      if (res.status === 200) {
        lista = await res.json();
        lista.sort((a: any, b: any) => {
          if (a.firstName > b.firstName) { return 1; }
          if (a.firstName < b.firstName) { return -1; }
          return 0;
        });
        this.listaContatos = lista;
        this.contatosCarregados.emit(true);
        return this.listaContatos;
      }
      throw { status: res.status, statustext: res.statusText };
    } catch (e) {
      console.error('Erro: ', e);
      if (e.status) { console.error(`${e.statusText} (${e.status})`); }
      this.listaContatos = lista;
      this.contatosCarregados.emit(true);
      return this.listaContatos;
    }
  }

  async getContatoFromServer(id: number): Promise<any> {
    let lista: any = [];
    try {
      const res = await fetch(`http://contacts-api.azurewebsites.net/api/contacts/${id}`);
      if (res.status === 200) {
        lista = await res.json();
        lista.sort((a: any, b: any) => {
          if (a.firstName > b.firstName) { return 1; }
          if (a.firstName < b.firstName) { return -1; }
          return 0;
        });
        this.listaContatos = lista;
        return this.listaContatos;
      }
      throw { status: res.status, statustext: res.statusText };
    } catch (e) {
      console.error('Erro: ', e);
      if (e.status) { console.error(`${e.statusText} (${e.status})`); }
      this.listaContatos = lista;
      return this.listaContatos;
    }
  }

  async getContatos(): Promise<any> {
    this.listaContatos = await this.getContatosFromServer();
    return await this.listaContatos;
  }

  getContato(id: number): any {
    const obj =  this.listaContatos.filter((contato: any) => contato.id === id);
    return obj;
  }

  insertContato(contato): void {
    contato = {
      ...contato,
      info: {
        ...contato.info,
        address: this.apiCorreios.getEnderecoByCEP(123).rua
      }
    };
    this.listaContatos.push(contato);
    this.emitirNovoContato.emit(contato);
  }

}
