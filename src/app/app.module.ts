import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './shared/routes/app-routing.module';
import { AppComponent } from './app.component';
import { DetalhesContatoComponent } from './contatos/contato/contato.component';
import { ListaContatosComponent } from './contatos/contatos.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatDividerModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatPaginatorModule,
  MatOptionModule,
  MatSelectModule,
  MatProgressBarModule,
  MatGridListModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ListaContatosComponent,
    DetalhesContatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressBarModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
