import { PollDashboardDto } from './../../Models/Dashboard';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, DoughnutController, Legend, LinearScale, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PollService, PollDto } from '../../Core/services/poll.service';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

Chart.register(
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  polls: PollDto[] = [];
  latestPolls: PollDto[] = [];
  isLoading = true;
public PollDashboardDto: PollDashboardDto = {
  totalPolls: 0,
  activePolls: 0,
  completedPolls: 0
};

  @ViewChild('pollChartCanvas') pollChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('votesChartCanvas') votesChartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: any;
  votesChart: any;

  constructor(private pollService: PollService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchPolls();
  }

  fetchPolls(): void {
  this.isLoading = true;

  this.pollService.getAllPolls().subscribe({
    next: (response) => {
      // Assign the array of polls
      this.polls = response.polls || [];

      // Assign total, active, and completed poll counts CORRECTLY
      this.PollDashboardDto.totalPolls = response.totalCount || this.polls.length;
this.PollDashboardDto.activePolls = this.polls.filter(
  p => new Date(p.expiresAt) > new Date()
).length;
this.PollDashboardDto.completedPolls = this.PollDashboardDto.totalPolls - this.PollDashboardDto.activePolls;

      this.latestPolls = [...this.polls]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      this.isLoading = false;

      this.cdr.detectChanges(); // This will update the view
      setTimeout(() => {
        this.renderStatusChart();
        this.renderVotesChart();
      }, 100);
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

  renderStatusChart(): void {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.pollChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Active Polls', 'Completed Polls'],
        datasets: [{
          data: [this.PollDashboardDto.activePolls, this.PollDashboardDto.completedPolls],
          backgroundColor: ['#3f51b5', '#ff4081'],
          hoverBackgroundColor: ['#303f9f', '#f50057'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: (value: number) => {
              const total = this.PollDashboardDto.activePolls + this.PollDashboardDto.completedPolls;
              return total ? `${Math.round((value / total) * 100)}%` : '0%';
            }
          },
          legend: { position: 'bottom' }
        }
      }
    });
  }

  renderVotesChart(): void {
    if (this.votesChart) this.votesChart.destroy();

    const labels = this.polls.map(p =>
      p.question.length > 20 ? p.question.substring(0, 20) + '...' : p.question
    );
    const votes = this.polls.map(p =>
      p.options.reduce((sum, o) => sum + o.voteCount, 0)
    );

    this.votesChart = new Chart(this.votesChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Votes',
          data: votes,
          backgroundColor: '#42a5f5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#000',
            anchor: 'end',
            align: 'top',
            formatter: (value: number) => value
          },
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

}
