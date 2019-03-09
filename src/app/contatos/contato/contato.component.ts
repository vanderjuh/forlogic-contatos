import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApiService } from '../../shared/services/contatos.service';
import { Subscription, empty } from 'rxjs';
import { ActivatedRoute, } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { catchError, } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class DetalhesContatoComponent implements OnInit, OnDestroy {

  colapse = true;
  progressoUpload: number;

  @ViewChild('avatar') avatar: ElementRef;
  @ViewChild('iFile') iFile: ElementRef;

  formulario: FormGroup;
  editandoContato: boolean;
  contatoAtual: any;
  inscricaoEmitirNovoContato: Subscription;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reactiveFormulario();
    this.getContatoFromIdRoute();
  }

  ngOnDestroy(): void {
    if (this.inscricaoEmitirNovoContato) { this.inscricaoEmitirNovoContato.unsubscribe(); }
  }

  openSnackBar(message: string, action: string = 'OK') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  reactiveFormulario(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email, this.emailValidator()]],
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

  deletarContato() {
    if (this.contatoAtual[0] && confirm('Deseja realmente deletar este contato?')) {
      this.apiService.deleteContatoFromServer(this.contatoAtual[0].id);
    }
  }

  getContatos(): any[] {
    return this.apiService.listaContatos;
  }

  criarContato(): void {
    this.apiService.createContatoInServer(this.formulario.value)
      .pipe(
        catchError(() => {
          // tslint:disable-next-line: deprecation
          return empty();
        })
      )
      .subscribe(() => {
        this.apiService.emitirContatoCriado.emit();
        this.resetarFormulario();
      });
  }

  editarContato() {
    this.apiService.updateContatoFromServer(this.formulario.value)
      .pipe(
        catchError(() => {
          const msg = 'Não foi possível alterar o contato!';
          console.error(msg);
          alert(msg);
          this.openSnackBar(msg);
          this.apiService.emitirErroConexao.emit('Cheque sua conexão com a internet!');
          // tslint:disable-next-line: deprecation
          return empty();
        })
      )
      .subscribe(() => {
        this.apiService.listaContatos = this.apiService.listaContatos.map((e: any) => {
          if (e.id === this.formulario.value.id) {
            e = { ...this.formulario.value };
          }
          return e;
        });
        this.apiService.emitirContatoEditado.emit();
        this.editandoContato = false;
      });
  }

  resetarFormulario(): void {
    this.formulario.reset();
    this.contatoAtual = undefined;
    this.editandoContato = false;
  }

  setarCover(): object {
    if (this.contatoAtual !== undefined) {
      return {
        backgroundImage: `url('${this.contatoAtual[0].info.avatar}')`
      };
    }
    return {};
  }

  onErrorAvatar(itemAvatar: any): void {
    itemAvatar.src = '../../../assets/img/round-person-24px.svg';
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

  emailValidator(): (formControl: FormControl) => void {
    const validator = (formControl: FormControl) => {
      if (!this.editandoContato) { return; }
      if (this.contatoAtual) { return; }
      if (!formControl.root || !(formControl.root as FormGroup).root) { return null; }
      const email = (formControl.root as FormGroup).get('email');
      if (email) {
        let flag: boolean;
        this.apiService.listaContatos.forEach((c: any) => {
          if (c.email === email.value) {
            flag = true;
            return;
          }
        });
        if (flag) {
          this.openSnackBar('Este e-mail já está sendo utilizado!');
          return { emailEquals: true };
        }
      }
      return null;
    };
    return validator;
  }

  onColapse(): void {
    this.colapse = !this.colapse;
    document.getElementsByTagName('app-contato')[0].setAttribute('style', this.colapse ? 'width: 75%;' : 'width: 100%;');
  }

  onChangeAvatar(): void {
    this.avatar.nativeElement.src = this.formulario.get('info').get('avatar').value;
  }

  onTelaInteiraDetalhesContato(): object {
    console.log(this.colapse);
    if (this.colapse) {
      return {
        width: this.colapse ? '100%' : '75%'
      };
    }
    return {};
  }

  onEditandoContato(): void {
    this.editandoContato = true;
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      if (!this.contatoAtual) {
        this.criarContato();
      } else { this.editarContato(); }
    } else {
      Object.keys(this.formulario.controls).forEach(componente => {
        const controle = this.formulario.get(componente);
        controle.markAsTouched();
      });
    }
  }

  onValidarForm(component: any): object {
    if (this.validarFormComponente(this.formulario.get(component))) {
      this.editandoContato = true;
      return { color: 'red' };
    }
    return {};
  }

  private validarFormComponente(componente: any): boolean {
    return componente.errors && componente.touched;
  }

}
