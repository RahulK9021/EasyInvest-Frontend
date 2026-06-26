import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Industry, StartupDetail, UserRecord } from './api.models';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<UserRecord[]>(`${this.adminUrl}/users`);
  }

  getStartups() {
    return this.http.get<StartupDetail[]>(`${this.adminUrl}/startups`);
  }

  deleteStartup(id: number) {
    return this.http.delete(`${this.adminUrl}/startups/${id}`, { responseType: 'text' });
  }

  createIndustry(name: string) {
    return this.http.post<Industry>(`${this.adminUrl}/industries?name=${encodeURIComponent(name)}`, {});
  }
}