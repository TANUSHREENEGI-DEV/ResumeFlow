import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { DocumentsService } from '../../services/documents';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-documents',
  imports: [Navbar, FormsModule, DatePipe, Footer],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  allDocuments = signal<any[]>([]);
  searchTerm = signal('');
  typeFilter = signal('all');
  loading = signal(true);
  errorMsg = signal('');
  openMenuId = signal<string | null>(null);

  filteredDocuments = computed(function (this: Documents) {
    var docs = this.allDocuments();
    var search = this.searchTerm().toLowerCase();
    var type = this.typeFilter();

    if (type !== 'all') {
      docs = docs.filter(function (d) {
        return d.type === type;
      });
    }

    if (search) {
      docs = docs.filter(function (d) {
        return d.title.toLowerCase().includes(search);
      });
    }

    return docs;
  }.bind(this));

  constructor(private documentsService: DocumentsService, private router: Router) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading.set(true);
    this.documentsService.list().subscribe({
      next: (res) => {
        this.allDocuments.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load documents');
        this.loading.set(false);
      },
    });
  }

  openDocument(id: string) {
    this.router.navigate(['/documents', id]);
  }

  createDocument() {
    this.documentsService.create('Untitled document', 'resume').subscribe({
      next: (res) => {
        this.router.navigate(['/documents', res.id]);
      },
      error: (err) => {
        console.log('create document failed', err.message);
      },
    });
  }

  toggleMenu(id: string) {
    if (this.openMenuId() === id) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(id);
    }
  }

  closeMenu() {
    this.openMenuId.set(null);
  }

  duplicateDocument(id: string) {
    this.documentsService.duplicate(id).subscribe({
      next: () => {
        this.closeMenu();
        this.loadDocuments();
      },
      error: (err) => {
        console.log('duplicate failed', err.message);
      },
    });
  }

  deleteDocument(id: string) {
    this.documentsService.remove(id).subscribe({
      next: () => {
        this.closeMenu();
        this.loadDocuments();
      },
      error: (err) => {
        console.log('delete failed', err.message);
      },
    });
  }
}