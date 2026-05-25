import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import ConstRoutes from 'src/app/shared/contants/const-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  nickUsuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onLogin() {

    if (this.nickUsuario  && this.contrasena ) {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/', ConstRoutes.PATH_USUARIOS]);
    } else {
      this.errorMessage = 'Usuario o contrasena incorrectos.';
    }
  }
}
