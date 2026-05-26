import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Direccion } from 'src/app/core/models/direccion.model';
import { Usuario, usuarioInicial } from 'src/app/core/models/user.model';

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [ CommonModule, FormsModule ]
})
export class UserPopupComponent implements OnInit, OnChanges {

    @Input() modo: string = 'CREATE';
    @Input() usuario: Usuario | null = null;
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();
    @Output() guardarUsuario = new EventEmitter<Usuario>();

    formUsuario: Usuario = usuarioInicial;
    generos = [
        { id: 1, nombre: 'Masculino' },
        { id: 2, nombre: 'Femenino' },
        { id: 3, nombre: 'Otro' }
    ];
    puestos = [
        { id: 1, nombre: 'Desarrollador' },
        { id: 2, nombre: 'Diseñador' },
        { id: 3, nombre: 'Project Manager' },
        { id: 4, nombre: 'Carpintera' },
        { id: 5, nombre: 'Mariachi' }
    ];
    nuevaDireccion = {
        nombreCalle: '',
        numeroCalle: null
    };
    selectedAddressId: number | null = null;
    fechaHoraCreacionString = '';
    fechaNacimientoString = '';

    constructor() {
    }

    ngOnInit() {
        this.resetForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['modo'] || changes['usuario']) {
            if (this.modo === 'EDIT' && this.usuario) {
                this.loadFormFromUsuario(this.usuario);
            } else {
                this.resetForm();
            }
        }
    }

    resetForm() {
        this.formUsuario = {
            ...usuarioInicial,
            genero: { id: 0, nombre: '' },
            puestoTrabajo: { id: 0, nombre: '' },
            direcciones: []
        };
        const now = new Date();
        this.fechaHoraCreacionString = now.toISOString().slice(0, 16);
        this.fechaNacimientoString = '';
        this.selectedAddressId = null;
    }

    loadFormFromUsuario(usuario: Usuario) {
        this.formUsuario = {
            ...usuario,
            genero: { ...usuario.genero },
            puestoTrabajo: { ...usuario.puestoTrabajo },
            direcciones: usuario.direcciones ? [...usuario.direcciones] : []
        };
        this.fechaHoraCreacionString = usuario.fechaHoraCreacion ? new Date(usuario.fechaHoraCreacion).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
        this.fechaNacimientoString = usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().slice(0, 10) : '';
        this.selectedAddressId = this.formUsuario.direcciones.find((direccion: Direccion) => direccion.direccionPrincipal)?.id ?? null;
    }

    addDireccion() {
        if (!this.nuevaDireccion.nombreCalle || this.nuevaDireccion.numeroCalle == null) {
            return;
        }
        const nuevaId = (this.formUsuario.direcciones?.length || 0) + 1;
        const direccion: Direccion = {
            id: nuevaId,
            nombreCalle: this.nuevaDireccion.nombreCalle,
            numeroCalle: this.nuevaDireccion.numeroCalle,
            usuario: undefined as any,
            direccionPrincipal: this.formUsuario.direcciones.length === 0
        };
        this.formUsuario.direcciones = [...this.formUsuario.direcciones, direccion];
        if (direccion.direccionPrincipal) {
            this.selectedAddressId = direccion.id;
        }
        this.nuevaDireccion = { nombreCalle: '', numeroCalle: null };
    }

    seleccionarDireccionPrincipal(id: number) {
        this.formUsuario.direcciones = this.formUsuario.direcciones.map((direccion: Direccion) => ({
            ...direccion,
            direccionPrincipal: direccion.id === id
        }));
        this.selectedAddressId = id;
    }

    onSave() {
        if (this.fechaHoraCreacionString) {
            this.formUsuario.fechaHoraCreacion = new Date(this.fechaHoraCreacionString);
        }
        if (this.fechaNacimientoString) {
            this.formUsuario.fechaNacimiento = new Date(this.fechaNacimientoString);
        }
        this.formUsuario.direcciones = this.formUsuario.direcciones || [];
        this.guardarUsuario.emit({ ...this.formUsuario });
        this.cerrarPopUpOk.emit();
        this.resetForm();
    }

    onCancel() {
        this.cerrarPopUpCancel.emit();
        this.resetForm();
    }
}
