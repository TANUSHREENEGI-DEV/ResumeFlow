import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-faq',
  imports: [Navbar, Footer],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  faqs = [
    {
      question: 'Is ResumeFlow free to use?',
      answer: 'Yes, all core features — building resumes, tracking applications, and sharing links — are free.',
    },
    {
      question: 'Can I use multiple templates for one resume?',
      answer: 'Each document is linked to one template at a time, but you can duplicate a document and switch its template freely.',
    },
    {
      question: 'How do shared links work?',
      answer: 'Create a public link from inside any document\'s Sharing tab. Anyone with the link can view the resume without signing in. You can revoke it any time.',
    },
    {
      question: 'Can I recover an old version of my resume?',
      answer: 'Yes. Save a version any time from the Versions tab in the editor, and restore it later if you need to undo changes.',
    },
    {
      question: 'Does exporting cost anything?',
      answer: 'No, exporting your resume is completely free and unlimited.',
    },
  ];
}