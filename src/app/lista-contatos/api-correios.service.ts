import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCorreiosService {

  constructor() {
    console.log(this);
  }

  getEnderecoByCEP(cep: number): any {
    return {
      rua: 'Rua A',
      cidade: 'Cornelio',
      estado: 'Parana'
    };
  }

}
