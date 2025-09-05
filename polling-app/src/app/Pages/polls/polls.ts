import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PollService, PollDto, PollCreateDto, VoteRequestDto } from '../../Core/services/poll.service';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './polls.html',
  styleUrls: ['./polls.scss']
})
export class PollsComponent implements OnInit {
  polls: PollDto[] = [];
  filteredPolls: PollDto[] = [];
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  showForm = false;
  formTitle = 'Create Poll';
  editingPollId: number | null = null;
  question = '';
  options: string[] = ['', ''];
  expiresAt = '';

  showVoteForm = false;
  activePoll: PollDto | null = null;
  selectedOptionIndex: number | null = null;

  // Track results for polls that user has voted
  showResultsMap: { [pollId: number]: boolean } = {};

  isSubmittingVote = false;

  constructor(
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.pollService.getMyPolls(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.polls = res.polls;
        this.totalPages = Math.ceil(res.totalCount / this.pageSize);

        this.polls.forEach(p => {
          this.showResultsMap[p.id] = p.isVoted || false;
        });

        this.applyFilters();
      }
    });
  }

  applyFilters() {
    let result = [...this.polls];

    if (this.searchTerm) {
      result = result.filter(p => p.question.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    if (this.sortColumn) {
      result.sort((a: any, b: any) => {
        const valA = (a as any)[this.sortColumn];
        const valB = (b as any)[this.sortColumn];
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredPolls = result;
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPolls();
  }

  showCreateForm() {
    this.showForm = true;
    this.formTitle = 'Create Poll';
    this.editingPollId = null;
    this.question = '';
    this.options = ['', ''];
    this.expiresAt = '';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  showEditForm(poll: PollDto) {
    this.showForm = true;
    this.formTitle = 'Edit Poll';
    this.editingPollId = poll.id;
    this.question = poll.question;
    this.options = poll.options.map(o => o.text);
    this.expiresAt = poll.expiresAt;
  }

  closeForm() {
    this.showForm = false;
  }

  addOption() {
    this.options.push('');
    setTimeout(() => this.focusLastOption(), 0);
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  savePoll() {
    if (!this.question.trim() || this.options.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least 2 valid options.');
      return;
    }

    const dto: PollCreateDto = {
      question: this.question.trim(),
      options: this.options.filter(o => o.trim()),
      expiresAt: this.expiresAt
    };

    if (this.editingPollId) {
      this.pollService.updatePoll(this.editingPollId, dto).subscribe({
        next: () => {
          this.closeForm();
          this.router.navigate(['/polls']); 
        }
      });
    } else {
      this.pollService.createPoll(dto).subscribe({
        next: () => {
          this.closeForm();
          this.router.navigate(['/polls']);
        }
      });
    }
  }

  get isPollValid(): boolean {
    if (!this.question?.trim()) return false;
    const validOptions = this.options.filter(o => !!o && o.trim().length > 0);
    return validOptions.length >= 2;
  }

  deletePoll(id: number) {
    if (confirm('Are you sure?')) {
      this.pollService.deletePoll(id).subscribe(() => this.loadPolls());
    }
  }

  vote(poll: PollDto) {
    this.showVoteForm = true;
    this.activePoll = poll;
    this.selectedOptionIndex = null;
  }

  closeVoteForm() {
    this.showVoteForm = false;
    this.activePoll = null;
  }

submitVote() {
  if (!this.activePoll || this.selectedOptionIndex === null || this.isSubmittingVote) return;

  this.isSubmittingVote = true;
  const optionId = this.activePoll.options[this.selectedOptionIndex].id;
  const dto: VoteRequestDto = { pollOptionId: optionId };

  this.pollService.vote(this.activePoll.id, dto).subscribe({
    next: () => {
      this.showResultsMap[this.activePoll!.id] = true;


      this.pollService.getPollById(this.activePoll!.id).subscribe(p => {
        this.activePoll = p;
        this.loadPolls();

        this.closeVoteForm();

        // ✅ Navigate to /polls so list reloads & results are visible
        this.router.navigate(['/polls']);
      });
    },
    error: () => {
      this.isSubmittingVote = false;
    }
  });
}

  getVotePercentage(optionIndex: number): number {
    if (!this.activePoll) return 0;
    const total = this.activePoll.options.reduce((sum, o) => sum + o.voteCount, 0);
    if (total === 0) return 0;
    return Math.round((this.activePoll.options[optionIndex].voteCount / total) * 100);
  }

  isActive(poll: PollDto): boolean {
    return new Date(poll.expiresAt) > new Date();
  }

  // 🔹 Focus management
  focusNextOption(index: number) {
    const inputs = document.querySelectorAll<HTMLInputElement>('.option-item input');
    const next = inputs[index + 1];
    if (next) next.focus();
  }

  focusLastOption() {
    const inputs = document.querySelectorAll<HTMLInputElement>('.option-item input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }
}
