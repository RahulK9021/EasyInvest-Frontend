import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Industry, InvestmentHistoryItem, InvestorDashboard, StartupSummary, TopStartup } from './api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {

  private baseUrl = `${environment.apiUrl}/investor/startups`;
  private investorUrl = `${environment.apiUrl}/investor/investments`;

  constructor(private http: HttpClient) {}

  getDashboard() {
  return this.http.get<InvestorDashboard>(`${this.baseUrl}/dashboard`);
}

getHistory() {
  return this.http.get<InvestmentHistoryItem[]>(`${this.investorUrl}/history`);
}

getTopFunded() {
  return this.http.get<TopStartup[]>(`${this.baseUrl}/top-funded`);
}

getRange(min: number, max: number) {
  return this.http.get<StartupSummary[]>(`${this.baseUrl}/range?min=${min}&max=${max}`);
}

getFilter(industryId: number, min: number, max: number) {
  return this.http.get<StartupSummary[]>(`${this.baseUrl}/filter?industryId=${industryId}&min=${min}&max=${max}`);
}

getIndustries() {
  return this.http.get<Industry[]>(`${environment.apiUrl}/industries`);
}
}
