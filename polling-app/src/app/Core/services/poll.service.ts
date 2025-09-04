import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Poll DTOs
export interface PollOptionDto {
  id: number;
  text: string;
  voteCount: number;
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
}

export interface PollCreateDto {
  question: string;
  options: string[];
  expiresAt?: string;
}

export interface VoteRequestDto {
  pollOptionId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private baseUrl = 'https://localhost:7219/api/Polls'; // ✅ plural to match backend
 private  voteurl = 'https://localhost:7219/api/Votes'; // ✅ plural to match backend
  constructor(private http: HttpClient) {}

  // Utility to add JWT token header
  private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('accessToken');
   console.log('Token used for request:', token);
  return new HttpHeaders({
    Authorization: `Bearer ${token || ''}`
  });
}


  // Get all polls with pagination, search, sort, and status filter
  getAllPolls(
    page: number = 1,
    pageSize: number = 5,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    status?: string
  ): Observable<{ polls: PollDto[], totalCount: number }> {
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (search) query += `&search=${search}`;
    if (sortBy) query += `&sortBy=${sortBy}`;
    if (sortOrder) query += `&sortOrder=${sortOrder}`;
    if (status) query += `&status=${status}`;
 console.log('GET Polls request URL:', `${this.baseUrl}${query}`);
    return this.http.get<{ polls: PollDto[], totalCount: number }>(
      `${this.baseUrl}${query}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get a single poll by ID
  getPollById(id: number): Observable<PollDto> {
    return this.http.get<PollDto>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Create a new poll
  createPoll(poll: PollCreateDto): Observable<PollDto> {
    return this.http.post<PollDto>(
      `${this.baseUrl}`,
      poll,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update a poll
  updatePoll(id: number, poll: PollCreateDto): Observable<PollDto> {
    return this.http.put<PollDto>(
      `${this.baseUrl}/${id}`,
      poll,
      { headers: this.getAuthHeaders() }
    );
  }

getMyPolls(page: number = 1, pageSize: number = 5): Observable<{ polls: PollDto[], totalCount: number }> {
  const query = `?page=${page}&pageSize=${pageSize}`;
  return this.http.get<{ polls: PollDto[], totalCount: number }>(
    `${this.voteurl}/MyPolls${query}`,
    { headers: this.getAuthHeaders() }
  );
}

  // Delete a poll
  deletePoll(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Vote on a poll
  vote(pollId: number, dto: VoteRequestDto): Observable<any> {
    return this.http.post(`${this.voteurl}/SubmitVote/${pollId}`, dto, { headers: this.getAuthHeaders() });
  }

  // Get votes for a poll (GET)
  getVotes(pollId: number): Observable<any> {
    return this.http.get(`${this.voteurl}/GetVotes/${pollId}`, { headers: this.getAuthHeaders() });
  }
}

