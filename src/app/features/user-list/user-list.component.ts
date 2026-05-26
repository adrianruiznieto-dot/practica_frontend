import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';
import { Usuario } from 'src/app/core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [ CommonModule, UserPopupComponent, FormsModule ]
})
export class UserListComponent implements OnInit {
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();
  
  usuarios: Usuario[] = [];
  modoPopup: string = 'CLOSED';
  UsuarioSeleccionado: number = 0;
  usuarioSeleccionadoEnEdicion: Usuario | null = null;

  constructor(private readonly router: Router, private readonly userService: UserService) {
  }

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      console.log('Usuario logueado, mostrando listado de usuarios...');
      this.cargarUsuarios();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private async cargarUsuarios() {
    this.usuarios = await this.userService.obtenerUsuarios();
    console.log('Usuarios obtenidos:', this.usuarios);
    this.UsuarioSeleccionado = this.usuarios[0]?.id || 0;
  }

  onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
    this.usuarioSeleccionadoEnEdicion = null;
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
    this.usuarioSeleccionadoEnEdicion = null;
  }

  onUsuarioGuardado(usuario: Usuario) {
    if (!usuario) {
      return;
    }

    const usuarioId = usuario.id ?? 0;
    const existeIndex = this.usuarios.findIndex((u) => String(u.id) === String(usuarioId));
    if (existeIndex >= 0) {
      this.usuarios = this.usuarios.map((u) => (String(u.id) === String(usuarioId) ? usuario : u));
    } else {
      const nuevoId = Math.max(0, ...this.usuarios.map((u) => Number(u.id) || 0)) + 1;
      usuario.id = nuevoId;
      this.usuarios = [...this.usuarios, usuario];
    }
    this.UsuarioSeleccionado = usuario.id;
  }

  launchPopup(modo: string = 'CREATE') {
    if (modo === 'EDIT') {
      const usuario = this.usuarios.find((u) => String(u.id) === String(this.UsuarioSeleccionado));
      if (!usuario) {
        globalThis.alert('Selecciona un usuario para editar.');
        return;
      }
      this.usuarioSeleccionadoEnEdicion = { ...usuario, direcciones: usuario.direcciones ? [...usuario.direcciones] : [] };
    }
    this.modoPopup = modo;
  }

  eliminarUsuarioSeleccionado() {
    const usuario = this.usuarios.find((u) => u.id === this.UsuarioSeleccionado);
    if (!usuario) {
      globalThis.alert('Selecciona un usuario antes de eliminar.');
      return;
    }
    const confirmado = globalThis.confirm(`¿Estás seguro que quieres borrar al usuario ${usuario.nickUsuario}?`);
    if (!confirmado) {
      return;
    }
    this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
    this.UsuarioSeleccionado = this.usuarios[0]?.id || 0;
  }
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

}
