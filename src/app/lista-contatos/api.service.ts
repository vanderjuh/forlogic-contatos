import { Injectable, EventEmitter } from '@angular/core';
import { ApiCorreiosService } from './api-correios.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  emitirNovoContato = new  EventEmitter<object>();

  private listaContatos: object[];

  constructor(private apiCorreios: ApiCorreiosService) {
    console.log(this);
    this.listaContatos = [
      {
        id: 1,
        firstName: 'Vanderley',
        lastName: 'Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        gender: 'm',
        isFavorite: false,
        info: {
          id: 1,
          company: 'Forlogic',
          // tslint:disable-next-line:max-line-length
          avatar: 'https://trello-attachments.s3.amazonaws.com/5c59aed4db6b3938eaa9e254/300x300/f70f3c1d8ff9481cd524b664587f3973/vanderley-02.jpg',
          address: 'Rua A',
          phone: '43991841963',
          comments: 'dev'
        },
        created: '2019-02-27T11:44:56.773Z'
      },
      {
        id: 2,
        firstName: 'Vanderley',
        lastName: 'Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        gender: 'm',
        isFavorite: true,
        info: {
          id: 2,
          company: 'Forlogic',
          // tslint:disable-next-line:max-line-length
          avatar: 'https://trello-attachments.s3.amazonaws.com/5c59aed4db6b3938eaa9e254/300x300/f70f3c1d8ff9481cd524b664587f3973/vanderley-02.jpg',
          address: 'Rua A',
          phone: '43991841963',
          comments: 'dev'
        },
        created: '2019-02-27T11:44:56.773Z'
      }
    ];
  }

  getContatos(): object[] {
    return this.listaContatos;
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
