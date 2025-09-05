export interface PollDashboardDto {
  totalPolls: number;
  activePolls: number;
  completedPolls: number;
  myPolls?: number;   // optional if you want user-specific polls
}
