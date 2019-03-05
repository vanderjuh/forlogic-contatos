import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalhes-contato',
  templateUrl: './detalhes-contato.component.html',
  styleUrls: ['./detalhes-contato.component.css']
})
export class DetalhesContatoComponent implements OnInit, OnDestroy {

  @ViewChild('avatar') avatar: ElementRef;
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

  editandoContato: boolean;
  contatoAtual: any;

  inscricaoEmitirNovoContato: Subscription;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.emitirNovoContato();
    this.getContatoFromIdRoute();
  }

  ngOnDestroy(): void {
    this.inscricaoEmitirNovoContato.unsubscribe();
  }

  async deletarContato() {
    console.log(this.contatoAtual[0].id);
    if (this.contatoAtual[0] && confirm('Deseja realmente deletar este contato?')) {
      const resp = await this.apiService.deleteContatoFromServer(this.contatoAtual[0].id);
      if (resp) {
        this.apiService.listaContatos = this.apiService.listaContatos.filter((e: any) => e.id !== this.contatoAtual[0].id);
        this.apiService.emitirContatoRemovido.emit(this.contatoAtual[0].id);
        alert('Contato deletado com sucesso!');
      }
    }
  }

  getContatos(): any[] {
    return this.apiService.listaContatos;
  }

  emitirNovoContato(): void {
    this.inscricaoEmitirNovoContato = this.apiService.emitirContatoSalvo.subscribe((contato: any) => {
      console.log('Emitiu: ', contato);
    });
  }

  getContatoFromIdRoute(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.contatoAtual = this.apiService.getContato(+params.id);
        this.renderDetalhes();
      }
    });
  }

  renderDetalhes(): void {
    this.iNome.nativeElement.value = this.contatoAtual[0].firstName;
    this.iSobrenome.nativeElement.value = this.contatoAtual[0].lastName;
    this.iEmail.nativeElement.value = this.contatoAtual[0].email;
    if (this.contatoAtual[0].gender === 'f') {
      this.gF.nativeElement.checked = true;
    } else {
      this.gM.nativeElement.checked = true;
    }
    this.avatar.nativeElement.src = this.contatoAtual[0].info.avatar;
    this.iCompanhia.nativeElement.value = this.contatoAtual[0].info.company;
    this.iEndereco.nativeElement.value = this.contatoAtual[0].info.address;
    this.iTelefone.nativeElement.value = this.contatoAtual[0].info.phone;
    this.tComentario.nativeElement.value = this.contatoAtual[0].info.comments;
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

  onEditandoContato(): void {
    this.editandoContato = true;
    console.log(this.editandoContato);
  }

}
