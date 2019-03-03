import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('fTodos') fTodos: ElementRef;
  @ViewChild('fFavoritos') fFavoritos: ElementRef;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getContatosFromServer();
    this.inscricaoCarregarContatos = this.apiService.contatosCarregados.subscribe(() => {
      this.setContatosPaginados(this.getContatos());
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

  setContatosPaginados(lista: any[]): void {
    this.contatosPaginados = _.chunk(lista, this.qtdContatosPorPagina);
    this.totalPaginas = this.contatosPaginados.length;
  }

  contatosPorPaginacao(): any[] {
    return this.contatosPaginados[this.paginaAtual];
  }

  getContatos(): any[] {
    return this.apiService.listaContatos;
  }

  exibirFavoritos(): void {
    this.rederinirPaginacao();
    const lista = this.getContatos().filter(e => e.isFavorite);
    this.setContatosPaginados(lista);
  }

  aplicarFiltro(filtro: string): void {
    switch (filtro) {
      case 'favoritos':
        this.exibirFavoritos();
        break;
      case 'todos':
        this.setContatosPaginados(this.getContatos());
        break;
      default:
        console.error('Filtro desconhecido');
    }
  }

  filtroSelecionado(): string {
    if (this.fTodos.nativeElement.checked) {
      return 'fTodos';
    } else {
      return 'fFavoritos';
    }
  }

  buscarContato(iPesquisa: HTMLInputElement): void {
    let listaBusca: any[];
    if (this.getContatos()) {
      this.rederinirPaginacao();
      if (this.filtroSelecionado() === 'fTodos') {
        listaBusca = this.getContatos().filter(e => new RegExp(iPesquisa.value, 'ig').test(`${e.firstName} ${e.lastName}`));
      } else {
        listaBusca = this.getContatos()
          .filter(e => e.isFavorite)
          .filter(e => new RegExp(iPesquisa.value, 'ig').test(`${e.firstName} ${e.lastName}`));
      }
      this.contatosPaginados = _.chunk(listaBusca, this.qtdContatosPorPagina);
      this.totalPaginas = this.contatosPaginados.length;
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

  async favoritarContato(contato: any, iconFav: any) {
    if (contato) {
      contato.isFavorite = !contato.isFavorite;
      const resp = await this.apiService.updateContato(contato);
      if (resp) {
        this.getContatos().forEach(e => {
          if (e.id === contato.id) {
            if (e.isFavorite) {
              iconFav.src = '../../assets/img/baseline-favorite-24px.svg';
            } else { iconFav.src = '../../assets/img/baseline-favorite_border-24px.svg'; }
            e.isFavorite = contato.isFavorite;
            return;
          }
        });
      } else {
        const msg = 'Não foi possível alterar o status de favorito do contato!';
        console.error(msg);
        alert(msg);
      }
    } else { console.error('Erro. É necessário que passe um objeto de contato para remover'); }
  }

}
