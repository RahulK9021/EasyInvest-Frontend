import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FollowedStartup } from '../../services/api.models';
import { EngagementService } from '../../services/engagement.service';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css'
})
export class FollowingComponent implements OnInit {
  startups: FollowedStartup[] = [];
  loading = true;

  constructor(private engagementService: EngagementService) {}

  ngOnInit() {
    this.loadFollowing();
  }

  loadFollowing() {
    this.engagementService.getFollows().subscribe({
      next: (res) => {
        this.startups = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  unfollow(startupId: number) {
    this.engagementService.unfollowStartup(startupId).subscribe({
      next: () => {
        this.startups = this.startups.filter((startup) => startup.startupId !== startupId);
      }
    });
  }
}
