import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApiService } from './api.service';

import * as _ from 'lodash';
import { Subscription, empty } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-lista-contatos',
  templateUrl: './lista-contatos.component.html',
  styleUrls: ['./lista-contatos.component.css']
})
export class ListaContatosComponent implements OnInit, OnDestroy {

  private paginaAtual = 0;
  private totalPaginas: number;
  private qtdContatosPorPagina = 10;
  private contatosPaginados: any[];

  erroConexao: string;

  inscriCarregarContatos: Subscription;
  inscriContatoRemovido: Subscription;
  inscriErroServidor: Subscription;
  inscriContatoCriado: Subscription;
  inscriContatoEditado: Subscription;

  @ViewChild('fTodos') fTodos: any;
  @ViewChild('fFavoritos') fFavoritos: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.apiService.listaContatos === undefined) {
      this.apiService.getContatosFromServer();
    }
    this.inscricaoContatosCarregados();
    this.inscricaoContatoRemovido();
    this.inscricaoErroConexao();
    this.inscricaoContatoCriado();
    this.inscricaoContatoEditado();
  }

  ngOnDestroy() {
    if (this.inscriCarregarContatos) { this.inscriCarregarContatos.unsubscribe(); }
    if (this.inscriContatoRemovido) { this.inscriContatoRemovido.unsubscribe(); }
    if (this.inscriErroServidor) { this.inscriErroServidor.unsubscribe(); }
    if (this.inscriContatoCriado) { this.inscriContatoCriado.unsubscribe(); }
    if (this.inscriContatoEditado) { this.inscriContatoEditado.unsubscribe(); }
  }

  inscricaoContatoEditado(): void {
    this.inscriContatoEditado = this.apiService.emitirContatoEditado.subscribe(() => {
      this.setContatosPaginados(this.apiService.listaContatos);
    });
  }

  inscricaoContatoCriado(): void {
    this.inscriContatoCriado = this.apiService.emitirContatoCriado.subscribe(() => {
      this.apiService.getContatosFromServer().subscribe((data) => {
        this.apiService.listaContatos = data;
        this.setContatosPaginados(this.getContatos());
      });
    });
  }

  inscricaoContatosCarregados(): void {
    this.inscriCarregarContatos = this.apiService.getContatosFromServer().subscribe((data) => {
      this.apiService.listaContatos = data;
      this.setContatosPaginados(this.getContatos());
    });
  }

  inscricaoContatoRemovido(): void {
    this.inscriContatoRemovido = this.apiService.emitirContatoRemovido.subscribe((id: number) => {
      this.setContatosPaginados(this.getContatos());
      this.router.navigate(['/contatos']);
    });
  }

  inscricaoErroConexao(): void {
    this.inscriErroServidor = this.apiService.emitirErroConexao.subscribe((msg: string) => {
      this.erroConexao = msg;
      console.error(msg);
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
    if (this.fTodos.checked) {
      return 'fTodos';
    } else {
      return 'fFavoritos';
    }
  }

  buscarContato(iPesquisa: HTMLInputElement): void {
    console.log(iPesquisa.value);
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

  onErrorAvatar(itemAvatar: any): void {
    itemAvatar.src = '../../assets/img/round-person-24px.svg';
  }

  favoritarContato(contato: any) {
    if (contato) {
      contato.isFavorite = !contato.isFavorite;
      this.apiService.updateContatoFromServer(contato)
        .pipe(
          catchError((error: any) => {
            const msg = 'Não foi possível alterar o status de favorito do contato!';
            contato.isFavorite = !contato.isFavorite;
            console.error(msg);
            alert(msg);
            this.apiService.emitirErroConexao.emit('Cheque sua conexão com a internet!');
            // tslint:disable-next-line: deprecation
            return empty();
          })
        )
        .subscribe(() => {
          this.getContatos().forEach(e => {
            if (e.id === contato.id) {
              e.isFavorite = contato.isFavorite;
              return;
            }
          });
        });
    } else { console.error('Erro. É necessário que passe um objeto de contato para remover'); }
  }

}
