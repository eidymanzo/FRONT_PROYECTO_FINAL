import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Cuenta {
  id: number;
  ahorro: number;
  ingresos: number;
  gastos: number;
}

@Component({
  selector: 'app-cuentas-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta.html'
})
export class CuentasComponent implements OnInit {
  form: FormGroup;
  cuentas: Cuenta[] = [];
  editMode = false;
  editCuentaId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      ahorro: ['', Validators.required], 
      ingresos: ['', [Validators.required]],
      gastos: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadCuentas();
  }

  loadCuentas() {
    this.http.get<Cuenta[]>('http://localhost:8080/api/cuentas')
    .subscribe(data => {
      this.cuentas = data;
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.editMode && this.editCuentaId !== null) {
        this.http.patch(`http://localhost:8080/api/cuentas/${this.editCuentaId}`, this.form.value)
          .subscribe(() => {
            this.loadCuentas();
            this.resetForm();
          });
      } else {
        this.http.post('http://localhost:8080/api/cuentas/register', this.form.value)
          .subscribe(() => {
            this.loadCuentas();
            this.resetForm();
          });
      }
    }
  }

  editCuenta(cuenta: Cuenta) {
    this.editMode = true;
    this.editCuentaId = cuenta.id;
    this.form.patchValue({
      id: cuenta.id,
      ahorro: cuenta.ahorro,
      ingresos: cuenta.ingresos,
      gastos: cuenta.gastos,
    });
  }

  deleteCuenta(id: number) {
    this.http.delete(`http://localhost:8080/api/cuentas/${id}`)
      .subscribe(() => {
        this.loadCuentas();
      });
  }

  resetForm() {
    this.editMode = false;
    this.editCuentaId = null;
    this.form.reset();
  }
}
