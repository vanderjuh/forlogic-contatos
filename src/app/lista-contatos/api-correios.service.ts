import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCorreiosService {

  getEnderecoByCEP(cep: number): any {
    return {
      rua: 'Rua A',
      cidade: 'Cornelio',
      estado: 'Parana'
    };
  }

}
