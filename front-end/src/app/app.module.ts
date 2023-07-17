import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AppRouting } from './routes/routing';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminComponent } from './components/admin/admin.component';
import { ListaComponent } from './components/lista/lista.component';
import { NuevoVisitanteComponent } from './components/nuevo-visitante/nuevo-visitante.component';
import { GuardiaComponent } from './components/guardia/guardia.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { FormsVisitasComponent } from './components/forms-visitas/forms-visitas.component';
import { QrGuardiaComponent } from './components/qr-guardia/qr-guardia.component';
import { CruduserComponent } from './components/cruduser/cruduser.component';
import { ListaEmpleadosComponent } from './components/lista-empleados/lista-empleados.component';
import { PreregistroComponent } from './components/preregistro/preregistro.component';
import { MainVisualizerComponent } from './components/main-visualizer/main-visualizer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    ListaComponent,
    NuevoVisitanteComponent,
    GuardiaComponent,
    EmpleadoComponent,
    FormsVisitasComponent,
    QrGuardiaComponent,
    CruduserComponent,
    ListaEmpleadosComponent,
    PreregistroComponent,
    MainVisualizerComponent
  ],
  imports: [
    AppRouting,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
