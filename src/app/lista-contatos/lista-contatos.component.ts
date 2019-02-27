import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-lista-contatos',
  templateUrl: './lista-contatos.component.html',
  styleUrls: ['./lista-contatos.component.css']
})
export class ListaContatosComponent implements OnInit {

  private listaContatos: object[] = undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getContatos();
  }

  getContatos(filtro?: string): object[] {
    if (!this.listaContatos) {
      console.log('Conexão com a API: pegar contatos');
      this.listaContatos = this.apiService.getContatos();
    }
    switch (filtro) {
      case 'favoritos':
        return this.filtroFavoritos(this.listaContatos);
      default:
        return this.listaContatos;
    }
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
    if (this.listaContatos) {
      if (iPesquisa.value) { console.log(iPesquisa.value); }
    } else { console.error('Erro. É necessário passar o elemento HTML da pesquisa'); }
  }

  exibirDetalhesContato(contato: any): void {
    if (contato) {
      console.log('Detalhes de: ', contato.firstName);
    } else { console.error('Erro. É preciso passar um contato para exibir os detalhes.'); }
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
