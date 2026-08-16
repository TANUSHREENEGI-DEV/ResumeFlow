import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.html",
  styleUrls: ["./signup.scss"],
  imports: [ReactiveFormsModule, RouterLink],
})
export class Signup {
  error = "";

  signupForm = new FormGroup({
    name: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    const { name, email, password } = this.signupForm.value;
    this.auth.register(name!, email!, password!).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.router.navigate(["/profile"]);
      },
      error: (err) => {
        this.error = err.error?.error || "Something went wrong";
      },
    });
  }
}