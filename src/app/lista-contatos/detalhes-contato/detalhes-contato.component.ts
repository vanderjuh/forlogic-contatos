import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-detalhes-contato',
  templateUrl: './detalhes-contato.component.html',
  styleUrls: ['./detalhes-contato.component.css']
})
export class DetalhesContatoComponent implements OnInit {

  @ViewChild('iAvatar') iAvatar: ElementRef;
  @ViewChild('iFile') iFile: ElementRef;
  @ViewChild('bUpload') bUpload: ElementRef;
  @ViewChild('pUpload') pUpload: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  abrirSelecionarAvatar(event: MouseEvent): void {
    event.preventDefault();
    this.iFile.nativeElement.click();
  }

}
