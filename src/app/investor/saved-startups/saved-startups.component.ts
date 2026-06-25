import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SavedStartup } from '../../services/api.models';
import { EngagementService } from '../../services/engagement.service';

@Component({
  selector: 'app-saved-startups',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved-startups.component.html',
  styleUrl: './saved-startups.component.css'
})
export class SavedStartupsComponent implements OnInit {
  startups: SavedStartup[] = [];
  loading = true;

  constructor(private engagementService: EngagementService) {}

  ngOnInit() {
    this.loadSavedStartups();
  }

  loadSavedStartups() {
    this.engagementService.getBookmarks().subscribe({
      next: (res) => {
        this.startups = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  remove(startupId: number) {
    this.engagementService.removeBookmark(startupId).subscribe({
      next: () => {
        this.startups = this.startups.filter((startup) => startup.startupId !== startupId);
      }
    });
  }

  logoText(name: string): string {
    return (name || 'S').slice(0, 2).toUpperCase();
  }
}
