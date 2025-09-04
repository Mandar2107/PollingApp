import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PollService, PollDto } from '../../Core/services/poll.service';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule,RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  totalPolls = 0;
  activePolls = 0;
  completedPolls = 0;
  polls: PollDto[] = [];
  latestPolls: PollDto[] = [];
  isLoading = true;
  chart: any;

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.fetchPolls();
  }

  fetchPolls(): void {
    this.isLoading = true;
    this.pollService.getAllPolls().subscribe({
      next: (response) => {
        this.polls = response.polls;
        this.totalPolls = response.totalCount;
        this.activePolls = this.polls.filter(p => new Date(p.expiresAt) > new Date()).length;
        this.completedPolls = this.totalPolls - this.activePolls;

        // latest 5 polls (sorted by created date)
        this.latestPolls = [...this.polls]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        this.isLoading = false;
        this.renderChart();
      },
      error: (err) => {
        console.error('Failed to fetch polls', err);
        this.isLoading = false;
      }
    });
  }

  isPollActive(expiresAt: string | Date): boolean {
    return new Date(expiresAt) > new Date();
  }

  renderChart(): void {
    const canvas = document.getElementById('pollChart') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Active Polls', 'Completed Polls'],
        datasets: [{
          data: [this.activePolls, this.completedPolls],
          backgroundColor: ['#3f51b5', '#ff4081'],
          hoverBackgroundColor: ['#303f9f', '#f50057'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: (value: number, context: any) => {
              const total = this.activePolls + this.completedPolls;
              return total ? `${Math.round((value / total) * 100)}%` : '0%';
            },
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
