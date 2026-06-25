import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { StartupDetail, UserRecord } from '../../services/api.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  users: UserRecord[] = [];
  startups: StartupDetail[] = [];
  industryName = '';
  successMessage = '';
  errorMessage = '';
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdminData();
  }

  loadAdminData() {
    this.loading = true;

    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = Array.isArray(res) ? res : [];
      }
    });

    this.adminService.getStartups().subscribe({
      next: (res) => {
        this.startups = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createIndustry() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.industryName.trim()) {
      this.errorMessage = 'Enter an industry name.';
      return;
    }

    this.adminService.createIndustry(this.industryName.trim()).subscribe({
      next: () => {
        this.successMessage = 'Industry created successfully.';
        this.industryName = '';
      },
      error: () => {
        this.errorMessage = 'We could not create the industry right now.';
      }
    });
  }

  deleteStartup(id?: number) {
    if (id == null) {
      return;
    }

    this.adminService.deleteStartup(id).subscribe({
      next: () => {
        this.startups = this.startups.filter((startup) => startup.id !== id);
      }
    });
  }
}
