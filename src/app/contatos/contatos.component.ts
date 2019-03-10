import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ContatosService } from '../shared/services/contatos.service';

import * as _ from 'lodash';
import { Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { HttpErrorService } from '../shared/services/httpError.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contatos',
  templateUrl: 'contatos.component.html',
  styleUrls: ['contatos.component.css']
})
export class ListaContatosComponent implements OnInit, OnDestroy {

  private paginaAtual = 0;
  private totalPaginas: number;
  private qtdContatosPorPagina = 10;
  private contatosPaginados: any[];

  erroHttpGetContatos: boolean;

  inscriContatoRemovido: Subscription;
  inscriErroServidor: Subscription;
  inscriContatoCriado: Subscription;
  inscriContatoEditado: Subscription;

  @ViewChild('fTodos') fTodos: any;
  @ViewChild('fFavoritos') fFavoritos: any;

  constructor(
    private contatosService: ContatosService,
    private httpErrorService: HttpErrorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getContatosServidor();
    this.inscricaoContatoRemovido();
    this.inscricaoContatoCriado();
    this.inscricaoContatoEditado();
  }

  getContatosServidor(): void {
    this.erroHttpGetContatos = false;
    this.contatosService.getContatosFromServer()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.erroHttpGetContatos = true;
          this.httpErrorService.mensagemErro(error);
          return of(null);
        })
      )
      .subscribe((data) => {
        this.contatosService.listaContatos = data;
        this.setContatosPaginados(this.getContatos());
      });
  }

  ngOnDestroy() {
    if (this.inscriContatoRemovido) { this.inscriContatoRemovido.unsubscribe(); }
    if (this.inscriErroServidor) { this.inscriErroServidor.unsubscribe(); }
    if (this.inscriContatoCriado) { this.inscriContatoCriado.unsubscribe(); }
    if (this.inscriContatoEditado) { this.inscriContatoEditado.unsubscribe(); }
  }

  openSnackBar(message: string, time: number = 5000) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  inscricaoContatoEditado(): void {
    this.inscriContatoEditado = this.contatosService.emitirContatoEditado.subscribe(() => {
      this.setContatosPaginados(this.contatosService.listaContatos);
    });
  }

  inscricaoContatoCriado(): void {
    this.inscriContatoCriado = this.contatosService.emitirContatoCriado.subscribe(() => {
      this.contatosService.getContatosFromServer().subscribe((data) => {
        this.contatosService.listaContatos = data;
        this.setContatosPaginados(this.getContatos());
      });
    });
  }

  inscricaoContatoRemovido(): void {
    this.inscriContatoRemovido = this.contatosService.emitirContatoRemovido.subscribe((id: number) => {
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
    return this.contatosService.listaContatos;
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

  onMostrarPaginador(): object {
    if (this.getContatos) { return { display: 'flex' }; }
    return { display: 'none' };
  }

  onErrorAvatar(itemAvatar: any): void {
    itemAvatar.src = '../../assets/img/round-person-24px.svg';
  }

  favoritarContato(contato: any) {
    if (contato) {
      let erroHttp = false;
      contato.isFavorite = !contato.isFavorite;
      this.contatosService.updateContatoFromServer(contato)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            contato.isFavorite = !contato.isFavorite;
            erroHttp = true;
            this.httpErrorService.mensagemErro(error);
            return of(null);
          })
        )
        .subscribe(() => {
          if (!erroHttp) {
            this.getContatos().forEach(e => {
              if (e.id === contato.id) {
                e.isFavorite = contato.isFavorite;
                this.openSnackBar(`Contato ${e.isFavorite ? 'favoritado' : 'desfavoritado'}!`, 2000);
                return;
              }
            });
          }
        });
    } else { console.error('Erro. É necessário que passe um objeto de contato para remover'); }
  }

}
