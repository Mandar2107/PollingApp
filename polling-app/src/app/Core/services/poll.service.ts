import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// === DTOs ===
export interface PollOptionDto {
  id: number;
  text: string;
  voteCount: number;
}
export interface PollUpdateDto {
  question: string;
  options: { id: number; text: string }[];
  expiresAt?: string;
}

export interface PollDto {
  id: number;
  question: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  options: PollOptionDto[];
  totalVotes: number;
  isVoted?: boolean;
  CompltedPolls :number;
  TotalPolls :number;
  ActivePolls :number;
  MYpolls :number;
}

export interface PollCreateDto {
  question: string;
  options: string[];
  expiresAt?: string;
}

export interface VoteRequestDto {
  pollOptionId: number;
}

// === Service ===
@Injectable({
  providedIn: 'root'
})
export class PollService {
  private baseUrl = 'https://localhost:7219/api/Polls'; // Backend API
  private voteUrl = 'https://localhost:7219/api/Votes';

  constructor(private http: HttpClient) {}

  // Add Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  // === Poll CRUD ===
  getAllPolls(
    page: number = 1,
    pageSize: number = 5,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    status?: string
  ): Observable<{ polls: PollDto[]; totalCount: number }> {
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (search) query += `&search=${search}`;
    if (sortBy) query += `&sortBy=${sortBy}`;
    if (sortOrder) query += `&sortOrder=${sortOrder}`;
    if (status) query += `&status=${status}`;

    return this.http.get<{ polls: PollDto[]; totalCount: number }>(
      `${this.baseUrl}${query}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getPollById(id: number): Observable<PollDto> {
    return this.http.get<PollDto>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPoll(poll: PollCreateDto): Observable<PollDto> {
    console.log(poll);
    console.log("service creat ecalled ");
    return this.http.post<PollDto>(this.baseUrl, poll, { headers: this.getAuthHeaders() });
  }

  updatePoll(id: number, poll: PollUpdateDto): Observable<PollDto> {
    return this.http.put<PollDto>(`${this.baseUrl}/${id}`, poll, { headers: this.getAuthHeaders() });
  }

  deletePoll(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // === My Polls (User-specific) ===
  getMyPolls(page: number = 1, pageSize: number = 5): Observable<{ polls: PollDto[]; totalCount: number }> {
    const query = `?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ polls: PollDto[]; totalCount: number }>(
      `${this.baseUrl}/MyPolls${query}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // === Voting ===
  vote(pollId: number, dto: VoteRequestDto): Observable<any> {
    return this.http.post(`${this.voteUrl}/SubmitVote/${pollId}`, dto, { headers: this.getAuthHeaders() });
  }

  getVotes(pollId: number): Observable<any> {
    return this.http.get(`${this.voteUrl}/GetVotes/${pollId}`, { headers: this.getAuthHeaders() });
  }
}
