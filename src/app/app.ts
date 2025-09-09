import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
  `,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'clinic-dashboard';
}
