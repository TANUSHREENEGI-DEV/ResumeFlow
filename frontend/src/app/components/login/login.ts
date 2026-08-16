import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.html",
  styleUrls: ["./login.scss"],
  imports: [FormsModule, RouterLink],
})
export class Login {
  email = "";
  password = "";
  error = "";

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.error = "Invalid email or password";
      },
    });
  }
}