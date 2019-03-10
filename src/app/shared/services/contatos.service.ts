import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {

  emitirContatoRemovido = new EventEmitter<number>();
  emitirContatoCriado = new EventEmitter();
  emitirContatoEditado = new EventEmitter();

  listaContatos: object[];

  constructor(private http: HttpClient) { }

  getContatosFromServer(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/contatos`);
  }

  updateContatoFromServer(contato: any): Observable<any> {
    if (contato) { return this.http.put<any>(`${environment.apiUrl}/contatos/${contato.id}`, contato); }
    console.error('Erro. É necessário que passe um contato para ser editado.');
    return null;
  }

  deleteContatoFromServer(id: number) {
    if (id) { return this.http.delete(`${environment.apiUrl}/contatos/${id}`); }
    console.error('Erro. É necessário que passe o ID do contato para deleta-lo');
    return null;
  }

  createContatoInServer(contato: any) {
    if (contato) { return this.http.post<any>(`${environment.apiUrl}/contatos`, contato); }
    console.error('Erro. É necessário que passe um contato para ser inserido.');
    return null;
  }

  getContato(id: number): any {
    const obj = this.listaContatos.filter((contato: any) => contato.id === id);
    if (obj) { return obj; }
    return null;
  }

}
