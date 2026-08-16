import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { SharesService } from '../../services/shares';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shares',
  imports: [Navbar, Footer, DatePipe],
  templateUrl: './shares.html',
  styleUrl: './shares.scss',
})
export class Shares implements OnInit {
  shares = signal<any[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(private sharesService: SharesService, private router: Router) {}

  ngOnInit() {
    this.loadShares();
  }

  loadShares() {
    this.loading.set(true);
    this.sharesService.list().subscribe({
      next: (res) => {
        this.shares.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load shared links');
        this.loading.set(false);
      },
    });
  }

  getPublicUrl(slug: string) {
    return 'http://localhost:4200/r/' + slug;
  }

  copyLink(slug: string) {
    navigator.clipboard.writeText(this.getPublicUrl(slug));
  }

  revoke(id: string) {
    this.sharesService.remove(id).subscribe({
      next: () => {
        this.loadShares();
      },
      error: (err) => {
        console.log('revoke failed', err.message);
      },
    });
  }

  goToDocuments() {
    this.router.navigate(['/documents']);
  }
}