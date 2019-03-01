import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-detalhes-contato',
  templateUrl: './detalhes-contato.component.html',
  styleUrls: ['./detalhes-contato.component.css']
})
export class DetalhesContatoComponent implements OnInit {

  @ViewChild('iNome') iNome: ElementRef;
  @ViewChild('iSobrenome') iSobrenome: ElementRef;
  @ViewChild('iEmail') iEmail: ElementRef;
  @ViewChild('gF') gF: ElementRef;
  @ViewChild('gM') gM: ElementRef;
  @ViewChild('iAvatar') iAvatar: ElementRef;
  @ViewChild('iFile') iFile: ElementRef;
  @ViewChild('bUpload') bUpload: ElementRef;
  @ViewChild('pUpload') pUpload: ElementRef;
  @ViewChild('iCompanhia') iCompanhia: ElementRef;
  @ViewChild('iEndereco') iEndereco: ElementRef;
  @ViewChild('iTelefone') iTelefone: ElementRef;
  @ViewChild('tComentario') tComentario: ElementRef;
  @ViewChild('bSalvar') bSalvar: ElementRef;
  @ViewChild('bRemover') bRemover: ElementRef;

  contatoAtual: object;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.emitirNovoContato.subscribe((contato: any) => {
      console.log('Emitiu: ', contato);
    });
  }

  abrirSelecionarAvatar(event: MouseEvent): void {
    event.preventDefault();
    this.iFile.nativeElement.click();
  }

  salvarContato(): void {
    const contato = {
      firstName: this.iNome.nativeElement.value,
      lastName: this.iSobrenome.nativeElement.value,
      email: this.iEmail.nativeElement.value,
      info: {
        avatar: ''
      }
    };
    this.contatoAtual = contato;
    console.log(this.contatoAtual);
    this.apiService.insertContato(this.contatoAtual);
  }

}
