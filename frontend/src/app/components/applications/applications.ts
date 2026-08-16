import { Component, OnInit, signal, computed } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from '../../services/applications';

@Component({
  selector: 'app-applications',
  imports: [Navbar, DatePipe, FormsModule, Footer],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit {
  allApplications = signal<any[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  view = signal<'board' | 'table'>('board');
  draggedAppId = signal<string | null>(null);
  toastMsg = signal('');
  showForm = signal(false);
  newCompany = signal('');
  newRole = signal('');

  statuses = ['saved', 'applied', 'interview', 'offer', 'rejected'];

  statusLabels: { [key: string]: string } = {
    saved: 'Saved',
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  };

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loading.set(true);
    this.applicationsService.list().subscribe({
      next: (res) => {
        this.allApplications.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load applications');
        this.loading.set(false);
      },
    });
  }

  getAppsForStatus(status: string) {
    return this.allApplications().filter(function (a) {
      return a.status === status;
    });
  }

  setView(v: 'board' | 'table') {
    this.view.set(v);
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.newCompany.set('');
    this.newRole.set('');
  }

  submitForm() {
    if (!this.newCompany() || !this.newRole()) {
      return;
    }

    this.applicationsService.create(this.newCompany(), this.newRole()).subscribe({
      next: () => {
        this.loadApplications();
        this.closeForm();
      },
      error: (err) => {
        console.log('create application failed', err.message);
      },
    });
  }

  onDragStart(appId: string) {
    this.draggedAppId.set(appId);
  }

  onDrop(newStatus: string) {
    const appId = this.draggedAppId();
    if (!appId) {
      return;
    }

    this.applicationsService.updateStatus(appId, newStatus).subscribe({
      next: () => {
        this.loadApplications();
        this.showToast('Moved to ' + this.statusLabels[newStatus]);
        this.draggedAppId.set(null);
      },
      error: (err) => {
        console.log('status update failed', err.message);
        this.draggedAppId.set(null);
      },
    });
  }

  showToast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => {
      this.toastMsg.set('');
    }, 2000);
  }
}