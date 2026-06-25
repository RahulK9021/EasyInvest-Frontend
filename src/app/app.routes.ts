import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

import { InvestorDashboardComponent } from './investor/dashboard/dashboard.component';
import { FounderDashboardComponent } from './founder/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { StartupListComponent } from './investor/startup-list/startup-list.component';
import { StartupDetailComponent } from './investor/startup-detail/startup-detail.component';
import { SavedStartupsComponent } from './investor/saved-startups/saved-startups.component';
import { FollowingComponent } from './investor/following/following.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConversationsComponent } from './messages/conversations.component';
import { ChatComponent } from './messages/chat.component';
import { MeetingsComponent } from './meetings/meetings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'investor/dashboard',
    component: InvestorDashboardComponent,
    canActivate: [authGuard, roleGuard(['INVESTOR'])]
  },
  {
    path: 'founder/dashboard',
    component: FounderDashboardComponent,
    canActivate: [authGuard, roleGuard(['FOUNDER'])]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])]
  },
  { path: 'startups', component: StartupListComponent },
  { path: 'startups/:id', component: StartupDetailComponent },
  {
    path: 'saved-startups',
    component: SavedStartupsComponent,
    canActivate: [authGuard, roleGuard(['INVESTOR'])]
  },
  {
    path: 'following',
    component: FollowingComponent,
    canActivate: [authGuard, roleGuard(['INVESTOR'])]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'messages',
    component: ConversationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'messages/:id',
    component: ChatComponent,
    canActivate: [authGuard]
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    canActivate: [authGuard]
  }
];
