import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username_email: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
    this.authService.login(this.form.value.username_email, this.form.value.password);
    this.form.reset();
  }
}
