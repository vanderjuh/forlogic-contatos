import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { ApiCorreiosService } from './api-correios.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  emitirContatosCarregados = new EventEmitter<boolean>();
  emitirContatoSalvo = new EventEmitter<object>();
  emitirContatoRemovido = new EventEmitter<number>();
  emitirErroConexao = new EventEmitter<string>();
  listaContatos: object[];

  constructor(
    private apiCorreios: ApiCorreiosService,
    private router: Router
  ) { }

  async getContatosFromServer(): Promise<any> {
    let lista: any = [];
    try {
      const res = await fetch('http://contacts-api.azurewebsites.net/api/contacts');
      if (res.status === 200) {
        lista = await res.json();
        lista.sort((a: any, b: any) => {
          if (a.firstName > b.firstName) { return 1; }
          if (a.firstName < b.firstName) { return -1; }
          return 0;
        });
        this.listaContatos = lista;
        this.emitirContatosCarregados.emit(true);
        return this.listaContatos;
      }
      throw { status: res.status, statustext: res.statusText };
    } catch (e) {
      this.errorConexao(e);
      this.listaContatos = lista;
      this.emitirContatosCarregados.emit(true);
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
      this.errorConexao(e);
      this.listaContatos = lista;
      return this.listaContatos;
    }
  }

  async getContatos(): Promise<any> {
    this.listaContatos = await this.getContatosFromServer();
    return await this.listaContatos;
  }

  async updateContatoFromServer(contato: any) {
    if (contato) {
      const data = {
        firstName: contato.firstName,
        lastName: contato.lastName,
        email: contato.email,
        gender: contato.gender,
        isFavorite: contato.isFavorite,
        company: contato.info.company,
        avatar: contato.info.avatar,
        address: contato.info.address,
        phone: contato.info.phone,
        comments: contato.info.comments
      };
      try {
        const res = await fetch(
          `http://contacts-api.azurewebsites.net/api/contacts/${contato.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (res.status === 200) { return true; }
        throw await res.json();
      } catch (e) {
        this.errorConexao(e);
        return false;
      }
    }
    alert('Erro. Não foi possível alterar contato');
    console.error('Erro. É necessário que passe um contato para ser editado.');
    return false;
  }

  async deleteContatoFromServer(id: number) {
    if (id) {
      try {
        const res = await fetch(
          `http://contacts-api.azurewebsites.net/api/contacts/${id}`,
          {
            method: 'DELETE',
            headers: new Headers()
          }
        );
        if (res.status === 200) { return true; }
        throw await res.json();
      } catch (e) {
        this.errorConexao(e);
        return false;
      }
    }
    alert('Erro. Não foi possível remover contato');
    console.error('Erro. É necessário que passe o ID do contato para deleta-lo');
    return false;
  }

  getContato(id: number): any {
    const obj = this.listaContatos.filter((contato: any) => contato.id === id);
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
    this.emitirContatoSalvo.emit(contato);
  }

  errorConexao(e: any): void {
    console.error('Erro: ', e);
    if ((e + '') === 'TypeError: Failed to fetch') {
      this.emitirErroConexao.emit('Cheque sua conexão com a internet!');
    }
    if (e.status) { console.error(`${e.statusText} (${e.status})`); }
    const msg = Object.values(e)[0];
    if (msg) {
      alert(msg);
      console.error('Erro: ', msg);
    }
  }

}
