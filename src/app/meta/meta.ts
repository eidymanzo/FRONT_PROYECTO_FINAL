import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Meta {
  id: number;
  plazo: number;
  monto: number;
  limite: number;
  objetivo: number;
}

@Component({
  selector: 'app-metas-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meta.html'
})
export class MetasComponent implements OnInit {
  form: FormGroup;
  metas: Meta[] = [];
  editMode = false;
  editMetaId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      plazo: ['', Validators.required], 
      monto: ['', [Validators.required]],
      limite: ['', [Validators.required]],
      objetivo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadMetas();
  }

  loadMetas() {
    this.http.get<Meta[]>('http://localhost:8080/api/metas')
    .subscribe(data => {
      this.metas = data;
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.editMode && this.editMetaId !== null) {
        this.http.patch(`http://localhost:8080/api/metas/${this.editMetaId}`, this.form.value)
          .subscribe(() => {
            this.loadMetas();
            this.resetForm();
          });
      } else {
        this.http.post('http://localhost:8080/api/metas/register', this.form.value)
          .subscribe(() => {
            this.loadMetas();
            this.resetForm();
          });
      }
    }
  }

  editMeta(meta: Meta) {
    this.editMode = true;
    this.editMetaId = meta.id;
    this.form.patchValue({
      id: meta.id,
      plazo: meta.plazo,
      monto: meta.monto,
      limite: meta.limite,
      objetivo: meta.objetivo,
    });
  }

  deleteMeta(id: number) {
    this.http.delete(`http://localhost:8080/api/metas/${id}`)
      .subscribe(() => {
        this.loadMetas();
      });
  }

  resetForm() {
    this.editMode = false;
    this.editMetaId = null;
    this.form.reset();
  }
}
