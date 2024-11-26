import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Core/Services/auth-service.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../Shared/interfaces/auth.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.loginError = null;

    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    const loginData: LoginRequest = this.loginForm.value;

    this.authService.login(loginData.email, loginData.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['']); 
      },
      error: (error) => {
        this.loading = false;
        this.loginError =
          error?.error?.message || 'Credenciales incorrectas o error del servidor.';
        console.error('Error de inicio de sesión:', error);
      },
    });
  }
}
