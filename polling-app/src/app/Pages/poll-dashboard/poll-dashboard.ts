import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService, PollDto } from '../../Core/services/poll.service';

@Component({
  selector: 'app-poll-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll-dashboard.html',
  styleUrls: ['./poll-dashboard.scss']
})
export class PollDashboardComponent implements OnInit {
  polls: PollDto[] = [];
  searchTerm = '';
  sortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  selectedOptions: { [pollId: number]: number } = {};
  showResultsMap: { [pollId: number]: boolean } = {};

  // Array of colors for result bars
  barColors: string[] = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997'];

  // Inline error message instead of alert()
  errorMessage = '';

  private searchTimeout: any;

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.pollService.getAllPolls(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.polls = res.polls;
        this.polls.forEach(poll => {
          this.showResultsMap[poll.id] = poll.isVoted ?? false;
        });
        this.totalPages = Math.ceil(res.totalCount / this.pageSize);
        this.sortPolls();
      },
      error: () => {
        this.errorMessage = 'Failed to load polls. Please try again.';
      }
    });
  }

  // Debounced search
  onSearchChange(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadPolls(), 400);
  }

  sortPolls() {
    this.polls.sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortPolls();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPolls();
  }

  submitVote(poll: PollDto) {
    const optionIndex = this.selectedOptions[poll.id];
    if (optionIndex === undefined) return;

    const optionId = poll.options[optionIndex].id;

    // Optimistic update (immediate UI feedback)
    poll.options[optionIndex].voteCount++;
    poll.isVoted = true;
    this.showResultsMap[poll.id] = true;

    this.pollService.vote(poll.id, { pollOptionId: optionId }).subscribe({
      next: () => {
        // Optional: Refresh from backend for accuracy
        this.pollService.getPollById(poll.id).subscribe(updated => {
          const index = this.polls.findIndex(p => p.id === poll.id);
          if (index > -1) this.polls[index] = updated;
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong while voting!';
      }
    });
  }

  getVotePercentage(poll: PollDto, optionIndex: number): number {
    const totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);
    return totalVotes === 0 ? 0 : Math.round((poll.options[optionIndex].voteCount / totalVotes) * 100);
  }

  isActive(poll: PollDto): boolean {
    return new Date(poll.expiresAt) > new Date();
  }

  getBarColor(index: number): string {
    return this.barColors[index % this.barColors.length];
  }

  getBarStyle(poll: PollDto, optionIndex: number) {
    return {
      '--bar-width': this.getVotePercentage(poll, optionIndex) + '%',
      'background-color': this.getBarColor(optionIndex)
    };
  }
}
