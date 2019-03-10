import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorService {

    constructor(private snackBar: MatSnackBar) { }

    private openSnackBar(message: string, time: number = 5000) {
        this.snackBar.open(message, null, {
            duration: time,
        });
    }

    mensagemErro(requisicao: HttpErrorResponse): void {
        switch (requisicao.statusText) {
            case 'Unknown Error':
                this.openSnackBar('Cheque sua conexão com a internet', 10000);
                break;
            case 'Not Found':
                this.openSnackBar('Este contato não foi encontrado', 5000);
                break;
            default:
                this.openSnackBar('Erro desconhecido', 5000);
        }
        console.error(requisicao);
    }

}
