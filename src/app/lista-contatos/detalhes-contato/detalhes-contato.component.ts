import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalhes-contato',
  templateUrl: './detalhes-contato.component.html',
  styleUrls: ['./detalhes-contato.component.css']
})
export class DetalhesContatoComponent implements OnInit, OnDestroy {

  @ViewChild('avatar') avatar: ElementRef;
  @ViewChild('iFile') iFile: ElementRef;

  formulario: FormGroup;
  editandoContato: boolean;
  contatoAtual: any;
  inscricaoEmitirNovoContato: Subscription;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reactiveFormulario();
    this.emitirNovoContato();
    this.getContatoFromIdRoute();
  }

  ngOnDestroy(): void {
    this.inscricaoEmitirNovoContato.unsubscribe();
  }

  reactiveFormulario(): void {
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      sobrenome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      genero: [null, [Validators.required, Validators.pattern(/^[mf]$/)]],
      avatar: [null],
      companhia: [null, Validators.minLength(3)],
      endereco: [null],
      telefone: [null],
      comentario: [null]
    });
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
        this.editandoContato = false;
        this.renderDetalhes();
      }
    });
  }

  renderDetalhes(): void {
    this.formulario.controls.nome.setValue(this.contatoAtual[0].firstName);
    this.formulario.controls.sobrenome.setValue(this.contatoAtual[0].lastName);
    this.formulario.controls.email.setValue(this.contatoAtual[0].email);
    this.formulario.controls.genero.setValue(this.contatoAtual[0].gender);
    this.avatar.nativeElement.src = this.contatoAtual[0].info.avatar;
    this.formulario.controls.companhia.setValue(this.contatoAtual[0].info.company);
    this.formulario.controls.endereco.setValue(this.contatoAtual[0].info.address);
    this.formulario.controls.telefone.setValue(this.contatoAtual[0].info.phone);
    this.formulario.controls.comentario.setValue(this.contatoAtual[0].info.comments);
  }

  abrirSelecionarAvatar(event: MouseEvent): void {
    event.preventDefault();
    this.iFile.nativeElement.click();
  }

  onEditandoContato(): void {
    this.editandoContato = true;
  }

  onSubmit(): void {
    if(this.formulario.valid){
      console.log(this.formulario);
    } else { alert('Existem campos do formulário que requerem atenção!'); }
  }

  private validarFormComponente(componente: any): boolean {
    return componente.errors && componente.touched;
  }

  onValidarForm(component: any): object {
    if (this.validarFormComponente(this.formulario.controls[component])) {
      return { backgroundColor: '#FA8072' };
    }
    return {};
  }

}
