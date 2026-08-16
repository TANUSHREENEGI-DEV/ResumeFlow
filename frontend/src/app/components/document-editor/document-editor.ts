import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';
import { DocumentsService } from '../../services/documents';
import { SharesService } from '../../services/shares';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-document-editor',
  imports: [Navbar, FormsModule, DatePipe, Footer],
  templateUrl: './document-editor.html',
  styleUrl: './document-editor.scss',
})
export class DocumentEditor implements OnInit {
  docId = signal('');
  document = signal<any>(null);
  loading = signal(true);
  errorMsg = signal('');
  newSectionTitle = signal('');
  activeTab = signal<'editor' | 'sharing' | 'versions'>('editor');
  documentShares = signal<any[]>([]);
  sharesLoading = signal(false);
  versions = signal<any[]>([]);
  versionsLoading = signal(false);
  toastMsg = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService,
    private sharesService: SharesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.docId.set(id);
      this.loadDocument();
    }
  }

  loadDocument() {
    this.loading.set(true);
    this.documentsService.getOne(this.docId()).subscribe({
      next: (res) => {
        this.document.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Could not load document');
        this.loading.set(false);
      },
    });
  }

  setTab(tab: 'editor' | 'sharing' | 'versions') {
    this.activeTab.set(tab);
    if (tab === 'sharing') {
      this.loadShares();
    }
    if (tab === 'versions') {
      this.loadVersions();
    }
  }

  loadShares() {
    this.sharesLoading.set(true);
    this.sharesService.list().subscribe({
      next: (res) => {
        const docId = this.docId();
        const filtered = res.filter(function (s: any) {
          return s.documentId === docId;
        });
        this.documentShares.set(filtered);
        this.sharesLoading.set(false);
      },
      error: (err) => {
        console.log('load shares failed', err.message);
        this.sharesLoading.set(false);
      },
    });
  }

  createShareLink() {
    this.sharesService.create(this.docId()).subscribe({
      next: () => {
        this.loadShares();
      },
      error: (err) => {
        console.log('create share failed', err.message);
      },
    });
  }

  revokeShare(shareId: string) {
    this.sharesService.remove(shareId).subscribe({
      next: () => {
        this.loadShares();
      },
      error: (err) => {
        console.log('revoke share failed', err.message);
      },
    });
  }

  getPublicUrl(slug: string) {
    return 'http://localhost:4200/r/' + slug;
  }

  loadVersions() {
    this.versionsLoading.set(true);
    this.documentsService.listVersions(this.docId()).subscribe({
      next: (res) => {
        this.versions.set(res);
        this.versionsLoading.set(false);
      },
      error: (err) => {
        console.log('load versions failed', err.message);
        this.versionsLoading.set(false);
      },
    });
  }

  saveVersion() {
    this.documentsService.createVersion(this.docId()).subscribe({
      next: () => {
        this.loadVersions();
        this.loadDocument();
        this.showToast('Version saved');
      },
      error: (err) => {
        console.log('save version failed', err.message);
      },
    });
  }

  restoreVersion(versionId: string) {
    this.documentsService.restoreVersion(this.docId(), versionId).subscribe({
      next: () => {
        this.loadDocument();
        this.showToast('Version restored');
      },
      error: (err) => {
        console.log('restore version failed', err.message);
      },
    });
  }

  showToast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => {
      this.toastMsg.set('');
    }, 2000);
  }

  printView() {
    window.print();
  }

 exportDocument() {
  const doc = this.document();
  let content = doc.title + '\n\n';

  doc.sections.forEach(function (section: any) {
    content += section.title.toUpperCase() + '\n';
    section.items.forEach(function (item: any) {
      content += '- ' + item.text + '\n';
    });
    content += '\n';
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = doc.title + '.txt';
  link.click();
  window.URL.revokeObjectURL(url);

  this.documentsService.logExport(this.docId()).subscribe({
    next: () => {},
    error: (err) => {
      console.log('log export failed', err.message);
    },
  });
}

  addSection() {
    const title = this.newSectionTitle().trim();
    if (!title) {
      return;
    }

    const order = this.document().sections.length + 1;

    this.documentsService.addSection(this.docId(), 'custom', title, order).subscribe({
      next: () => {
        this.newSectionTitle.set('');
        this.loadDocument();
      },
      error: (err) => {
        console.log('add section failed', err.message);
      },
    });
  }

  deleteSection(sectionId: string) {
    this.documentsService.removeSection(this.docId(), sectionId).subscribe({
      next: () => {
        this.loadDocument();
      },
      error: (err) => {
        console.log('delete section failed', err.message);
      },
    });
  }

  updateSectionTitle(sectionId: string, newTitle: string) {
    this.documentsService.updateSectionTitle(this.docId(), sectionId, newTitle).subscribe({
      next: () => {},
      error: (err) => {
        console.log('update section title failed', err.message);
      },
    });
  }

  addBullet(sectionId: string) {
    this.documentsService.addItem(this.docId(), sectionId, 'New bullet point').subscribe({
      next: () => {
        this.loadDocument();
      },
      error: (err) => {
        console.log('add bullet failed', err.message);
      },
    });
  }

  updateBullet(sectionId: string, itemId: string, newText: string) {
    this.documentsService.updateItem(this.docId(), sectionId, itemId, newText).subscribe({
      next: () => {},
      error: (err) => {
        console.log('update bullet failed', err.message);
      },
    });
  }

  deleteBullet(sectionId: string, itemId: string) {
    this.documentsService.removeItem(this.docId(), sectionId, itemId).subscribe({
      next: () => {
        this.loadDocument();
      },
      error: (err) => {
        console.log('delete bullet failed', err.message);
      },
    });
  }

  goBack() {
    this.router.navigate(['/documents']);
  }
}