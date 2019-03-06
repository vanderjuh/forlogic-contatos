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
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      gender: [null, [Validators.required, Validators.pattern(/^[mf]$/)]],
      info: this.formBuilder.group({
        avatar: [null],
        company: [null, [Validators.required, Validators.minLength(3)]],
        address: [null, Validators.minLength(3)],
        phone: [null, Validators.minLength(3)],
        comments: [null]
      })
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
    this.avatar.nativeElement.src = this.contatoAtual[0].info.avatar;
    this.formulario.patchValue(this.contatoAtual[0]);
  }

  abrirSelecionarAvatar(event: MouseEvent): void {
    event.preventDefault();
    this.iFile.nativeElement.click();
  }

  onEditandoContato(): void {
    this.editandoContato = true;
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      console.log(this.formulario);
    } else {
      Object.keys(this.formulario.controls).forEach(componente => {
        const controle = this.formulario.get(componente);
        controle.markAsTouched();
      });
    }
  }

  private validarFormComponente(componente: any): boolean {
    return componente.errors && componente.touched;
  }

  onValidarForm(component: any): object {
    if (this.validarFormComponente(this.formulario.get(component))) {
      this.editandoContato = true;
      return { color: 'red' };
    }
    return {};
  }

}
