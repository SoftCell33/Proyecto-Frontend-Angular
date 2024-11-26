import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Core/Services/auth-service.service';
import { Router } from '@angular/router';
import { RegisterFormData } from '../../Shared/interfaces/auth.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  municipios: string[] = ['Neiva', 'Pitalito', 'Garzon', 'La Plata'];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  private createForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        ]],
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]],
        address: ['', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]],
        municipality: ['', [Validators.required]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
        ]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  get f() { return this.registerForm.controls; }

  get passwordValid() {
    const control = this.registerForm.get('password');
    return control?.errors && control.touched;
  }

  get passwordStrength(): string {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length;
    
    return strength < 2 ? 'débil' : strength < 3 ? 'media' : 'fuerte';
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    group.get('confirmPassword')?.setErrors(null);
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
  
    const formData: RegisterFormData = {
      nombreCompleto: this.registerForm.value.name,
      email: this.registerForm.value.email,
      telefono: this.registerForm.value.phone,
      direccion: this.registerForm.value.address,
      municipio: this.registerForm.value.municipality,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };
  
    console.log('Datos enviados:', formData);
  
    this.loading = true;
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Respuesta:', response);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('Error completo:', error);
        console.log('Error body:', error.error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error en el registro';
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.setErrors(null);
    });
  }
}
