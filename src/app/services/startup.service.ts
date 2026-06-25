import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FounderDashboardItem,
  FundingProgress,
  StartupDetail,
  StartupInvestor,
  StartupRequestPayload,
  StartupSummary,
  UpdateStartupPayload
} from './api.models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  private baseUrl = `${environment.apiUrl}/startups`;

  constructor(private http: HttpClient) {}

getAllStartups() {
  return this.http.get<StartupSummary[]>(this.baseUrl);
}

getStartupById(id: number) {
  return this.http.get<StartupDetail>(`${this.baseUrl}/${id}`);
}

searchStartups(keyword: string) {
  return this.http.get<StartupSummary[]>(`${this.baseUrl}/search?keyword=${encodeURIComponent(keyword)}`);
}

filterStartups(industryId?: number | null, minAmount?: number | null, maxAmount?: number | null) {
  const params = new URLSearchParams();

  if (industryId != null) {
    params.set('industryId', String(industryId));
  }

  if (minAmount != null) {
    params.set('minAmount', String(minAmount));
  }

  if (maxAmount != null) {
    params.set('maxAmount', String(maxAmount));
  }

  const query = params.toString();
  return this.http.get<StartupSummary[]>(`${this.baseUrl}/filter${query ? `?${query}` : ''}`);
}

getFounderDashboard() {
  return this.http.get<FounderDashboardItem[]>(`${this.baseUrl}/dashboard`);
}

createStartup(payload: StartupRequestPayload) {
  return this.http.post<StartupDetail>(this.baseUrl, payload);
}

updateStartup(id: number, payload: UpdateStartupPayload) {
  return this.http.put<StartupDetail>(`${this.baseUrl}/${id}`, payload);
}

deleteStartup(id: number) {
  return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
}

getFundingProgress(id: number) {
  return this.http.get<FundingProgress>(`${this.baseUrl}/progress/${id}`);
}

getStartupInvestors(id: number) {
  return this.http.get<StartupInvestor[]>(`${this.baseUrl}/${id}/investors`);
}

invest(startupId: number, amount: number) {
  return this.http.post(
    `${environment.apiUrl}/investor/investments/${startupId}?amount=${amount}`,
    {}
  );
}

showInterest(startupId: number) {
  return this.http.post(
    `${environment.apiUrl}/investor/interest/${startupId}`,
    {} // empty body
  );
}

}
