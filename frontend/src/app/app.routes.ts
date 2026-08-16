import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';
import { Documents } from './components/documents/documents';
import { Templates } from './components/templates/templates';
import { Applications } from './components/applications/applications';
import { DocumentEditor } from './components/document-editor/document-editor';
import { Shares } from './components/shares/shares';
import { Faq } from './components/faq/faq';
import { authGuard } from './services/auth.guard';
import { guestGuard } from './services/guest.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'signup', component: Signup, canActivate: [guestGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'documents', component: Documents, canActivate: [authGuard] },
  { path: 'documents/:id', component: DocumentEditor, canActivate: [authGuard] },
  { path: 'templates', component: Templates, canActivate: [authGuard] },
  { path: 'applications', component: Applications, canActivate: [authGuard] },
  { path: 'shares', component: Shares, canActivate: [authGuard] },
  { path: 'faq', component: Faq, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];