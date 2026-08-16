import { Component, OnInit, signal } from "@angular/core";
import { Profile as ProfileService } from "../../services/profile";
import { Auth } from "../../services/auth";
import { Router } from "@angular/router";
import { Navbar } from "../navbar/navbar";

@Component({
  selector: "app-profile",
  imports: [Navbar],
  templateUrl: "./profile.html",
  styleUrls: ["./profile.scss"],
})
export class Profile implements OnInit {
  user = signal<any>(null);
  errorMsg = signal<string>("");
  constructor(private profileService: ProfileService, private auth: Auth, private router: Router) {}
  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        this.errorMsg.set("Could not load profile");
      },
    });
  }
  onLogout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}