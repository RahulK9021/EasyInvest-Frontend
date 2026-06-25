import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ChatMessage } from '../services/api.models';
import { AuthService } from '../services/auth.service';
import { EngagementService } from '../services/engagement.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  conversationId!: number;
  messages: ChatMessage[] = [];
  content = '';
  timer?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private engagementService: EngagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.conversationId = Number(this.route.snapshot.params['id']);
    this.loadMessages();
    this.timer = interval(5000).subscribe(() => this.loadMessages());
  }

  ngOnDestroy() {
    this.timer?.unsubscribe();
  }

  get currentName(): string {
    return this.authService.getCurrentEmail();
  }

  loadMessages() {
    this.engagementService.getMessages(this.conversationId).subscribe({
      next: (res) => {
        this.messages = Array.isArray(res) ? res : [];
      }
    });
  }

  sendMessage() {
    const trimmed = this.content.trim();
    if (!trimmed) {
      return;
    }
    this.engagementService.sendMessage(this.conversationId, trimmed).subscribe({
      next: () => {
        this.content = '';
        this.loadMessages();
      }
    });
  }
}
