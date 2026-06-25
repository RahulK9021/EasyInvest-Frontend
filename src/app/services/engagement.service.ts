import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AppNotification,
  ChatMessage,
  Conversation,
  FollowedStartup,
  Meeting,
  SavedStartup,
  StartupDocument,
  StartupUpdate
} from './api.models';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  private apiUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  addBookmark(startupId: number) {
    return this.http.post<SavedStartup>(`${this.apiUrl}/bookmarks/${startupId}`, {});
  }

  getBookmarks() {
    return this.http.get<SavedStartup[]>(`${this.apiUrl}/bookmarks`);
  }

  removeBookmark(startupId: number) {
    return this.http.delete(`${this.apiUrl}/bookmarks/${startupId}`, { responseType: 'text' });
  }

  followStartup(startupId: number) {
    return this.http.post<FollowedStartup>(`${this.apiUrl}/follow/${startupId}`, {});
  }

  getFollows() {
    return this.http.get<FollowedStartup[]>(`${this.apiUrl}/follow`);
  }

  unfollowStartup(startupId: number) {
    return this.http.delete(`${this.apiUrl}/follow/${startupId}`, { responseType: 'text' });
  }

  getNotifications() {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/notifications`);
  }

  markNotificationRead(id: number) {
    return this.http.put<AppNotification>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  deleteNotification(id: number) {
    return this.http.delete(`${this.apiUrl}/notifications/${id}`, { responseType: 'text' });
  }

  createConversation(startupId: number) {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations`, { startupId });
  }

  getConversations() {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getMessages(conversationId: number) {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${conversationId}`);
  }

  sendMessage(conversationId: number, content: string) {
    return this.http.post<ChatMessage>(`${this.apiUrl}/messages`, { conversationId, content });
  }

  getStartupUpdates(startupId: number) {
    return this.http.get<StartupUpdate[]>(`${this.apiUrl}/startup-updates/${startupId}`);
  }

  publishStartupUpdate(startupId: number, title: string, description: string) {
    return this.http.post<StartupUpdate>(`${this.apiUrl}/startup-updates`, { startupId, title, description });
  }

  requestMeeting(startupId: number, meetingDate: string) {
    return this.http.post<Meeting>(`${this.apiUrl}/meetings`, { startupId, meetingDate });
  }

  getMeetings() {
    return this.http.get<Meeting[]>(`${this.apiUrl}/meetings`);
  }

  updateMeeting(id: number, status: 'ACCEPTED' | 'REJECTED') {
    return this.http.put<Meeting>(`${this.apiUrl}/meetings/${id}`, { status });
  }

  getDocuments(startupId: number) {
    return this.http.get<StartupDocument[]>(`${this.apiUrl}/documents/${startupId}`);
  }

  uploadDocument(startupId: number, fileType: string, file: File) {
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('file', file);
    return this.http.post<StartupDocument>(`${this.apiUrl}/documents/${startupId}`, formData);
  }

  downloadDocument(id: number) {
    return `${this.apiUrl}/documents/download/${id}`;
  }

  deleteDocument(id: number) {
    return this.http.delete(`${this.apiUrl}/documents/${id}`, { responseType: 'text' });
  }
}
