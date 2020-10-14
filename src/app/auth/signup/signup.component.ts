import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email, Validators.minLength(3)]}),
      password: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  onSignup() {
    if (!this.form.valid) {
      return;
    }

    this.authService.createUser(this.form.get('username').value, this.form.get('email').value, this.form.get('password').value);
    this.form.reset();
  }

}
