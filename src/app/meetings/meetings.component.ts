import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meeting } from '../services/api.models';
import { AuthService } from '../services/auth.service';
import { EngagementService } from '../services/engagement.service';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = true;

  constructor(
    private engagementService: EngagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMeetings();
  }

  get isFounder(): boolean {
    return this.authService.getCurrentRole() === 'FOUNDER';
  }

  loadMeetings() {
    this.engagementService.getMeetings().subscribe({
      next: (res) => {
        this.meetings = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, status: 'ACCEPTED' | 'REJECTED') {
    this.engagementService.updateMeeting(id, status).subscribe({
      next: () => this.loadMeetings()
    });
  }
}
