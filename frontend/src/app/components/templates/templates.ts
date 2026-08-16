import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { TemplatesService } from '../../services/templates';

@Component({
  selector: 'app-templates',
  imports: [Navbar, Footer],
  templateUrl: './templates.html',
  styleUrl: './templates.scss',
})
export class Templates implements OnInit {
  templates = signal<any[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(private templatesService: TemplatesService) {}

  ngOnInit() {
    this.templatesService.list().subscribe({
      next: (res) => {
        this.templates.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load templates');
        this.loading.set(false);
      },
    });
  }
}