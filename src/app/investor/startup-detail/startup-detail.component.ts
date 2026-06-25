import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StartupService } from '../../services/startup.service';
import { FundingProgress, StartupDetail, StartupDocument, StartupInvestor, StartupUpdate } from '../../services/api.models';
import { AuthService } from '../../services/auth.service';
import { EngagementService } from '../../services/engagement.service';

@Component({
  selector: 'app-startup-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './startup-detail.component.html',
  styleUrl: './startup-detail.component.css'
})
export class StartupDetailComponent implements OnInit {
  startup: StartupDetail | null = null;
  progress: FundingProgress | null = null;
  investors: StartupInvestor[] = [];
  investSuccessMessage = '';
  investErrorMessage = '';
  interestSuccessMessage = '';
  interestErrorMessage = '';
  actionMessage = '';
  amount = 0;
  meetingDate = '';
  startupId!: number;
  loading = true;
  errorMessage = '';
  updates: StartupUpdate[] = [];
  documents: StartupDocument[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private startupService: StartupService,
    private engagementService: EngagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.startupId = id;
    this.loadStartup(id);
    this.loadFundingProgress(id);
    this.loadInvestors(id);
    this.loadUpdates(id);
    this.loadDocuments(id);
  }

  get isInvestor(): boolean {
    return this.authService.getCurrentRole() === 'INVESTOR';
  }

  get industryName(): string {
    return this.startup?.industryName ?? this.startup?.industry?.name ?? 'Emerging sector';
  }

  get founderName(): string {
    return this.startup?.founderName ?? this.startup?.founder?.user?.fullName ?? 'Founder profile pending';
  }

  loadStartup(id: number) {
    this.loading = true;
    this.errorMessage = '';

    this.startupService.getStartupById(id).subscribe({
      next: (res) => {
        this.startup = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'We could not load this startup profile right now.';
      }
    });
  }

  loadFundingProgress(id: number) {
    this.startupService.getFundingProgress(id).subscribe({
      next: (res) => {
        this.progress = res;
      }
    });
  }

  loadInvestors(id: number) {
    this.startupService.getStartupInvestors(id).subscribe({
      next: (res) => {
        this.investors = Array.isArray(res) ? res : [];
      }
    });
  }

  loadUpdates(id: number) {
    this.engagementService.getStartupUpdates(id).subscribe({
      next: (res) => {
        this.updates = Array.isArray(res) ? res : [];
      }
    });
  }

  loadDocuments(id: number) {
    this.engagementService.getDocuments(id).subscribe({
      next: (res) => {
        this.documents = Array.isArray(res) ? res : [];
      }
    });
  }

  invest() {
    this.investSuccessMessage = '';
    this.investErrorMessage = '';

    if (!this.amount || this.amount <= 0) {
      this.investErrorMessage = 'Enter a valid amount';
      return;
    }

    this.startupService.invest(this.startupId, this.amount).subscribe({
      next: (res: any) => {
        this.investSuccessMessage = res.message || 'Investment successful';
        this.loadFundingProgress(this.startupId);
        this.loadInvestors(this.startupId);
        this.loadStartup(this.startupId);
        setTimeout(() => {
          this.investSuccessMessage = '';
        }, 3000);
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.investErrorMessage = err.error;
        } else if (err.error?.message) {
          this.investErrorMessage = err.error.message;
        } else {
          this.investErrorMessage = 'You have already invested or something went wrong.';
        }

        setTimeout(() => {
          this.investErrorMessage = '';
        }, 3000);
      }
    });
  }

  showInterest() {
    this.interestSuccessMessage = '';
    this.interestErrorMessage = '';

    this.startupService.showInterest(this.startupId).subscribe({
      next: (res: any) => {
        this.interestSuccessMessage = res.message || 'Interest shown successfully';
        setTimeout(() => {
          this.interestSuccessMessage = '';
        }, 3000);
      },
      error: () => {
        this.interestErrorMessage = 'You have already shown interest or something went wrong.';
        setTimeout(() => {
          this.interestErrorMessage = '';
        }, 3000);
      }
    });
  }

  bookmark() {
    this.engagementService.addBookmark(this.startupId).subscribe({
      next: () => this.showActionMessage('Startup saved to bookmarks.')
    });
  }

  follow() {
    this.engagementService.followStartup(this.startupId).subscribe({
      next: () => this.showActionMessage('You are now following this startup.')
    });
  }

  startConversation() {
    this.engagementService.createConversation(this.startupId).subscribe({
      next: (conversation) => this.router.navigate(['/messages', conversation.id])
    });
  }

  requestMeeting() {
    if (!this.meetingDate) {
      this.showActionMessage('Choose a meeting date and time.');
      return;
    }

    this.engagementService.requestMeeting(this.startupId, this.meetingDate).subscribe({
      next: () => this.showActionMessage('Meeting request sent.')
    });
  }

  downloadUrl(document: StartupDocument): string {
    return this.engagementService.downloadDocument(document.id);
  }

  private showActionMessage(message: string) {
    this.actionMessage = message;
    setTimeout(() => {
      this.actionMessage = '';
    }, 3000);
  }
}
