import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nombreUsuario: string;
  password: string;
}

@Component({
  selector: 'app-usuarios-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  usuarios: Usuario[] = [];
  editMode = false;
  editUsuarioId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.http.get<Usuario[]>('http://localhost:8080/api/usuarios')
    .subscribe(data => {
      this.usuarios = data;
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.editMode && this.editUsuarioId !== null) {
        this.http.patch(`http://localhost:8080/api/usuarios/${this.editUsuarioId}`, this.form.value)
          .subscribe(() => {
            this.loadUsuarios();
            this.resetForm();
          });
      } else {
        this.http.post('http://localhost:8080/api/usuarios/register', this.form.value)
          .subscribe(() => {
            this.loadUsuarios();
            this.resetForm();
          });
      }
    }
  }

  editUsuario(usuario: Usuario) {
    this.editMode = true;
    this.editUsuarioId = usuario.id;
    this.form.patchValue({
      email: usuario.email,
      password: usuario.password
    });
  }

  deleteUsuario(id: number) {
    this.http.delete(`http://localhost:8080/api/usuarios/${id}`)
      .subscribe(() => {
        this.loadUsuarios();
      });
  }

  resetForm() {
    this.editMode = false;
    this.editUsuarioId = null;
    this.form.reset();
  }
}
