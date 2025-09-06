import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule,RouterLink],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class Welcome {}
