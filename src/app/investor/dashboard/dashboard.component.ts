import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InvestorService } from '../../services/investor.service';
import { Industry, InvestmentHistoryItem, InvestorDashboard, StartupSummary, TopStartup } from '../../services/api.models';

@Component({
  selector: 'app-investor-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class InvestorDashboardComponent implements OnInit {
  dashboard: InvestorDashboard = { totalInvested: 0, totalStartups: 0, largestInvestment: 0 };
  history: InvestmentHistoryItem[] = [];
  filteredOpportunities: StartupSummary[] = [];
  topFunded: TopStartup[] = [];
  industries: Industry[] = [];
  loading = true;

  min: number | null = null;
  max: number | null = null;
  industryId: number | null = null;

  constructor(private investorService: InvestorService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.investorService.getDashboard().subscribe((res) => {
      this.dashboard = res ?? this.dashboard;
      this.loading = false;
    });

    this.investorService.getHistory().subscribe((res) => {
      this.history = Array.isArray(res) ? res : [];
    });

    this.investorService.getTopFunded().subscribe((res) => {
      this.topFunded = Array.isArray(res) ? res : [];
    });

    this.investorService.getIndustries().subscribe((res) => {
      this.industries = Array.isArray(res) ? res : [];
    });
  }

  applyFilter() {
    if (this.min == null || this.max == null) {
      this.filteredOpportunities = [];
      return;
    }

    const request = this.industryId != null
      ? this.investorService.getFilter(this.industryId, this.min, this.max)
      : this.investorService.getRange(this.min, this.max);

    request.subscribe((res) => {
      this.filteredOpportunities = Array.isArray(res) ? res : [];
    });
  }
}
