import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getContatos(): object[] {
    return [
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
      },
      {
        id: 3,
        firstName: 'Vanderley',
        lastName: 'Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        gender: 'm',
        isFavorite: true,
        info: {
          id: 3,
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
        id: 4,
        firstName: 'Vanderley',
        lastName: 'Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        gender: 'm',
        isFavorite: true,
        info: {
          id: 4,
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

}
