import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InvestorService } from '../../services/investor.service';
import { StartupService } from '../../services/startup.service';
import { Industry, StartupSummary } from '../../services/api.models';
import { AuthService } from '../../services/auth.service';
import { EngagementService } from '../../services/engagement.service';

@Component({
  selector: 'app-startup-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './startup-list.component.html',
  styleUrl: './startup-list.component.css'
})
export class StartupListComponent implements OnInit {
  startups: StartupSummary[] = [];
  industries: Industry[] = [];
  searchTerm = '';
  loading = true;
  errorMessage = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  industryId: number | null = null;
  bookmarkedStartupIds = new Set<number>();
  followedStartupIds = new Set<number>();

  constructor(
    private startupService: StartupService,
    private investorService: InvestorService,
    private engagementService: EngagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStartups();
    this.loadIndustries();
    this.loadInvestorActions();
  }

  get isInvestor(): boolean {
    return this.authService.getCurrentRole() === 'INVESTOR';
  }

  loadStartups() {
    this.loading = true;
    this.errorMessage = '';

    this.startupService.getAllStartups().subscribe({
      next: (res) => {
        this.startups = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'We could not load startups right now. Please try again in a moment.';
      }
    });
  }

  loadIndustries() {
    this.investorService.getIndustries().subscribe({
      next: (res) => {
        this.industries = Array.isArray(res) ? res : [];
      }
    });
  }

  loadInvestorActions() {
    if (!this.isInvestor) {
      return;
    }

    this.engagementService.getBookmarks().subscribe({
      next: (res) => {
        this.bookmarkedStartupIds = new Set((Array.isArray(res) ? res : []).map((item) => item.startupId));
      }
    });

    this.engagementService.getFollows().subscribe({
      next: (res) => {
        this.followedStartupIds = new Set((Array.isArray(res) ? res : []).map((item) => item.startupId));
      }
    });
  }

  toggleBookmark(startupId: number) {
    if (this.bookmarkedStartupIds.has(startupId)) {
      this.engagementService.removeBookmark(startupId).subscribe({
        next: () => {
          this.bookmarkedStartupIds.delete(startupId);
          this.bookmarkedStartupIds = new Set(this.bookmarkedStartupIds);
        }
      });
      return;
    }

    this.engagementService.addBookmark(startupId).subscribe({
      next: () => {
        this.bookmarkedStartupIds.add(startupId);
        this.bookmarkedStartupIds = new Set(this.bookmarkedStartupIds);
      }
    });
  }

  toggleFollow(startupId: number) {
    if (this.followedStartupIds.has(startupId)) {
      this.engagementService.unfollowStartup(startupId).subscribe({
        next: () => {
          this.followedStartupIds.delete(startupId);
          this.followedStartupIds = new Set(this.followedStartupIds);
        }
      });
      return;
    }

    this.engagementService.followStartup(startupId).subscribe({
      next: () => {
        this.followedStartupIds.add(startupId);
        this.followedStartupIds = new Set(this.followedStartupIds);
      }
    });
  }

  applyFilters() {
    this.loading = true;
    this.errorMessage = '';

    const hasSearch = this.searchTerm.trim().length > 0;
    const hasStructuredFilters = this.industryId != null || this.minAmount != null || this.maxAmount != null;

    if (hasSearch) {
      this.startupService.searchStartups(this.searchTerm.trim()).subscribe({
        next: (res) => {
          this.startups = Array.isArray(res) ? res : [];

          if (hasStructuredFilters) {
            this.applyStructuredFilterLocally();
          }

          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Search is unavailable right now. Please try again.';
        }
      });
      return;
    }

    if (hasStructuredFilters) {
      this.startupService.filterStartups(this.industryId, this.minAmount, this.maxAmount).subscribe({
        next: (res) => {
          this.startups = Array.isArray(res) ? res : [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'We could not apply filters right now.';
        }
      });
      return;
    }

    this.loadStartups();
  }

  resetFilters() {
    this.searchTerm = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.industryId = null;
    this.loadStartups();
  }

  applyStructuredFilterLocally() {
    this.startups = this.startups.filter((startup) => {
      const selectedIndustry = this.industries.find((item) => item.id === this.industryId)?.name;
      const industryMatch = this.industryId == null || selectedIndustry === startup.industryName;
      const minMatch = this.minAmount == null || startup.amountRequired >= this.minAmount;
      const maxMatch = this.maxAmount == null || startup.amountRequired <= this.maxAmount;
      return industryMatch && minMatch && maxMatch;
    });
  }

  trackByStartup(_: number, startup: StartupSummary): number {
    return startup.id;
  }
}
