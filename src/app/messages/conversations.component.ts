import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conversation } from '../services/api.models';
import { EngagementService } from '../services/engagement.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent implements OnInit {
  conversations: Conversation[] = [];
  loading = true;

  constructor(private engagementService: EngagementService) {}

  ngOnInit() {
    this.engagementService.getConversations().subscribe({
      next: (res) => {
        this.conversations = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
