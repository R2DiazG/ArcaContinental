import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "../components/home/home.component";
import { LoginComponent } from "../components/login/login.component";
import { AdminComponent } from "../components/admin/admin.component";
import { ListaComponent } from "../components/lista/lista.component";
import { GuardService } from "../services/guard.service";
import { NuevoVisitanteComponent } from "../components/nuevo-visitante/nuevo-visitante.component";
import { GuardiaComponent} from "../components/guardia/guardia.component";
import { EmpleadoComponent } from "../components/empleado/empleado.component";
import { FormsVisitasComponent} from "../components/forms-visitas/forms-visitas.component";
import { QrGuardiaComponent } from "../components/qr-guardia/qr-guardia.component";
import { CruduserComponent } from "../components/cruduser/cruduser.component";

const app_routes:Routes = [
    { path: 'home/:num', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [GuardService], 
        children: [
            {path: 'lista', component: ListaComponent},
            {path: 'new', component: NuevoVisitanteComponent},
            {path: 'cruduser', component: CruduserComponent}
        ]
    },
    { path: 'guardia', component: GuardiaComponent, canActivate: [GuardService],
        children: [
            {path: 'qr', component: QrGuardiaComponent}
        ]
    },
    { path: 'empleado', component: EmpleadoComponent, canActivate: [GuardService],
        children: [
            {path: 'lista', component: ListaComponent},
            {path: 'registro', component: FormsVisitasComponent}
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: '**', pathMatch: 'full', redirectTo: ''}
]

export const AppRouting = RouterModule.forRoot(app_routes);