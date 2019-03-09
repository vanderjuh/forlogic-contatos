import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  emitirContatoRemovido = new EventEmitter<number>();
  emitirErroConexao = new EventEmitter<string>();
  emitirContatoCriado = new EventEmitter();
  emitirContatoEditado = new EventEmitter();

  listaContatos: object[];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string, action: string = 'OK') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getContatosFromServer(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/contatos`)
      .pipe(
        catchError((error: any) => {
          this.emitirErroConexao.emit('Cheque sua conexão com a internet!');
          // tslint:disable-next-line: deprecation
          return empty();
        })
      );
  }

  updateContatoFromServer(contato: any): Observable<any> {
    if (contato) { return this.http.put<any>(`http://localhost:3000/contatos/${contato.id}`, contato); }
    alert('Erro. Não foi possível alterar contato');
    console.error('Erro. É necessário que passe um contato para ser editado.');
  }

  deleteContatoFromServer(id: number): void {
    if (id) {
      this.http.delete(`http://localhost:3000/contatos/${id}`)
        .pipe(
          catchError((error) => {
            this.emitirErroConexao.emit('Cheque sua conexão com a internet!');
            // tslint:disable-next-line: deprecation
            return empty();
          })
        )
        .subscribe(() => {
          this.listaContatos = this.listaContatos.filter((e: any) => e.id !== id);
          this.emitirContatoRemovido.emit(id);
        });
    } else {
      alert('Erro. Não foi possível remover contato');
      console.error('Erro. É necessário que passe o ID do contato para deleta-lo');
    }
  }

  createContatoInServer(contato: any) {
    if (contato) { return this.http.post<any>(`http://localhost:3000/contatos`, contato); }
    alert('Erro. Não foi possível inserir contato');
    console.error('Erro. É necessário que passe um contato para ser inserido.');
  }

  getContato(id: number): any {
    const obj = this.listaContatos.filter((contato: any) => contato.id === id);
    return obj;
  }

}
