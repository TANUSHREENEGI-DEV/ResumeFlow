import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Profile } from '../../services/profile';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  userName = signal('');
  userEmail = signal('');
  menuOpen = signal(false);
mobileMenuOpen = signal(false);

  constructor(
    private profileService: Profile,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.userName.set(res.name);
        this.userEmail.set(res.email);
      },
      error: (err) => {
        console.log('failed to load profile for navbar', err.message);
      },
    });
  }

  getInitials() {
    const name = this.userName();
    if (!name) {
      return '?';
    }
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
toggleMobileMenu() {
  this.mobileMenuOpen.set(!this.mobileMenuOpen());
}

closeMobileMenu() {
  this.mobileMenuOpen.set(false);
}

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
