import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContatosService } from '../../shared/services/contatos.service';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute, Router, } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { catchError, } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { HttpErrorService } from 'src/app/shared/services/httpError.service';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class DetalhesContatoComponent implements OnInit, OnDestroy {

  colapse = false;
  progressoUpload: number;

  @ViewChild('avatar') avatar: ElementRef;
  @ViewChild('iFile') iFile: ElementRef;

  formulario: FormGroup;
  editandoContato: boolean;
  contatoAtual: any;
  inscricaoEmitirNovoContato: Subscription;

  constructor(
    private contatosService: ContatosService,
    private httpErrorService: HttpErrorService,
    private route: ActivatedRoute,
    private router: Router,
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

  getContatos(): any[] {
    return this.contatosService.listaContatos;
  }

  openSnackBar(message: string, time: number = 5000) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  reactiveFormulario(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, this.emailValidator(), Validators.email]],
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
      let erroHttp = false;
      this.contatosService.deleteContatoFromServer(this.contatoAtual[0].id)
        .pipe(
          catchError((error) => {
            erroHttp = true;
            this.httpErrorService.mensagemErro(error);
            return of(null);
          })
        )
        .subscribe(() => {
          if (!erroHttp) {
            this.contatosService.listaContatos = this.contatosService.listaContatos.filter((e: any) => e.id !== this.contatoAtual[0].id);
            this.contatosService.emitirContatoRemovido.emit(this.contatoAtual[0].id);
            this.openSnackBar('Contato removido com sucesso!', 2000);
            this.router.navigate(['/contatos']);
          }
        });
    }
  }

  criarContato(): void {
    let erroHttp = false;
    this.contatosService.createContatoInServer(this.formulario.value)
      .pipe(
        catchError((error) => {
          erroHttp = true;
          this.httpErrorService.mensagemErro(error);
          return of(null);
        })
      )
      .subscribe(() => {
        if (!erroHttp) {
          this.contatosService.emitirContatoCriado.emit();
          this.openSnackBar('Contato criado com sucesso!', 2000);
          this.resetarFormulario();
        }
      });
  }

  editarContato() {
    let erroHttp = false;
    this.contatosService.updateContatoFromServer(this.formulario.value)
      .pipe(
        catchError((error) => {
          erroHttp = true;
          this.httpErrorService.mensagemErro(error);
          return of(null);
        })
      )
      .subscribe(() => {
        if (!erroHttp) {
          this.contatosService.listaContatos = this.contatosService.listaContatos.map((e: any) => {
            if (e.id === this.formulario.value.id) { e = { ...this.formulario.value }; }
            return e;
          });
          this.contatosService.emitirContatoEditado.emit();
          this.openSnackBar('Contato editado com sucesso!', 2000);
          this.editandoContato = false;
        }
      });
  }

  resetarFormulario(): void {
    this.formulario.reset();
    this.contatoAtual = undefined;
    this.editandoContato = false;
  }

  setarCover(): object {
    if (this.contatoAtual !== undefined) { return { backgroundImage: `url('${this.contatoAtual[0].info.avatar}')` }; }
    return {};
  }

  onErrorAvatar(itemAvatar: any): void {
    itemAvatar.src = '../../../assets/img/round-person-24px.svg';
  }

  getContatoFromIdRoute(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.contatoAtual = this.contatosService.getContato(+params.id);
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

  onColapse(): void {
    this.colapse = !this.colapse;
    if (this.colapse) {
      document.getElementsByTagName('app-contato')[0].setAttribute('style', 'width: 100%;');
    } else {
      document.getElementsByTagName('app-contato')[0].removeAttribute('style');
    }
  }

  onChangeAvatar(): void {
    this.avatar.nativeElement.src = this.formulario.get('info').get('avatar').value;
  }

  onTelaInteiraDetalhesContato(): object {
    console.log(this.colapse);
    if (this.colapse) {
      return { width: this.colapse ? '100%' : '75%' };
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

  onValidarFormCampo(component: any): object {
    if (this.validarFormComponente(this.formulario.get(component))) {
      this.editandoContato = true;
      return { color: 'red' };
    }
    return {};
  }

  private validarFormComponente(componente: any): boolean {
    return componente.errors && componente.touched;
  }

  emailValidator(): (formControl: FormControl) => void {
    const validator = (formControl: FormControl) => {
      if (!this.editandoContato) { return; }
      if (this.contatoAtual) { return; }
      if (!formControl.root || !(formControl.root as FormGroup).root) { return null; }
      const email = (formControl.root as FormGroup).get('email');
      if (email) {
        let flag: boolean;
        this.contatosService.listaContatos.forEach((c: any) => {
          if (c.email === email.value) {
            flag = true;
            return;
          }
        });
        if (flag) {
          this.openSnackBar(`O e-mail "${email.value}" já está sendo utilizado!`, 5000);
          return { emailEquals: true };
        }
      }
      return null;
    };
    return validator;
  }

}
