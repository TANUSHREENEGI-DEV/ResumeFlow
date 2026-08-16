import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { DashboardService } from '../../services/dashboard';
import { Profile } from '../../services/profile';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, RouterLink, Footer, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  userName = signal('');
  documentsCount = signal(0);
  applicationsCount = signal(0);
  savedVersionsCount = signal(0);
  exportsCount = signal(0);
  recentDocuments = signal<any[]>([]);
  pipeline = signal<any[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  statusLabels: { [key: string]: string } = {
    saved: 'Saved',
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  };

  constructor(
    private dashboardService: DashboardService,
    private profileService: Profile
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.userName.set(res.name);
      },
      error: (err) => {
        console.log('failed to load profile', err.message);
      },
    });

    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.documentsCount.set(res.documents);
        this.applicationsCount.set(res.applications);
        this.savedVersionsCount.set(res.savedVersions);
        this.exportsCount.set(res.exports);
        this.recentDocuments.set(res.recentDocuments ?? []);
this.pipeline.set(res.pipeline ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load dashboard');
        this.loading.set(false);
      },
    });
  }
}