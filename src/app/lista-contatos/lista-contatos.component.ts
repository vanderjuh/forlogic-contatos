import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-contatos',
  templateUrl: './lista-contatos.component.html',
  styleUrls: ['./lista-contatos.component.css']
})
export class ListaContatosComponent implements OnInit {

  private paginaAtual = 0;
  private totalPaginas: number;
  private qtdContatosPorPagina = 10;
  private contatosPaginados: any[];

  private inscricaoCarregarContatos: Subscription;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getContatosFromServer();
    this.inscricaoCarregarContatos = this.apiService.contatosCarregados.subscribe(() => {
      this.contatosPaginados = _.chunk(this.getContatos(), this.qtdContatosPorPagina);
      this.totalPaginas = this.contatosPaginados.length;
    });
  }

  rederinirPaginacao(): void {
    this.paginaAtual = 0;
    this.totalPaginas = undefined;
    this.qtdContatosPorPagina = 10;
  }

  proximaPagina(event: MouseEvent): void {
    event.preventDefault();
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
    }
  }

  paginaAnterior(event: MouseEvent): void {
    event.preventDefault();
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
    }
  }

  contatosPorPaginacao(): any[] {
    return this.contatosPaginados[this.paginaAtual];
  }

  getContatos(): any[] {
    return this.apiService.listaContatos;
  }

  aplicarFiltro(filtro: string): void {
    switch (filtro) {
      case 'favoritos':
        console.log('Filtro: favoritos');
        break;
      case 'todos':
        console.log('Filtro: todos');
        break;
      default:
        console.error('Filtro desconhecido');
    }
  }

  buscarContato(iPesquisa: HTMLInputElement): void {
    this.rederinirPaginacao();
    if (this.apiService.listaContatos) {
      if (iPesquisa.value) { console.log(iPesquisa.value); }
    } else { console.error('Erro. É necessário passar o elemento HTML da pesquisa'); }
  }

  private filtroFavoritos(lista: any[]): object[] {
    console.log('Filtro de favoritos');
    if (lista) {
      const listaFavoritos = lista.filter(e => e.isFavorite === true);
      console.log(listaFavoritos);
      return listaFavoritos;
    }
  }

  favoritarContato(contato: object): void {
    if (contato) {
      console.log('Contato favoritado');
    } else { console.error('Erro. É necessário que passe um objeto de contato para remover'); }
  }

}
