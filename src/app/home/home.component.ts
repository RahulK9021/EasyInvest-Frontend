import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly metrics = [
    { value: 'Investor-ready', label: 'startup discovery workflow' },
    { value: 'Founder-first', label: 'pitch and traction storytelling' },
    { value: 'Role-based', label: 'dashboards for every stakeholder' }
  ];

  readonly operatingLanes = [
    {
      title: 'Founder lane',
      copy: 'Create the startup, shape the narrative, and monitor funding progress with investor visibility.'
    },
    {
      title: 'Investor lane',
      copy: 'Search, filter, compare, invest, and review portfolio activity without jumping between disconnected views.'
    },
    {
      title: 'Admin lane',
      copy: 'Review users, moderate startup records, and expand industry coverage as the platform grows.'
    }
  ];

  readonly highlights = [
    {
      title: 'Evaluate with clarity',
      copy: 'Browse startups with the funding ask, industry, founder profile, and core problem in one focused flow.'
    },
    {
      title: 'Pitch with structure',
      copy: 'Help founders present the narrative investors need instead of burying the business in disconnected forms.'
    },
    {
      title: 'Operate from one workspace',
      copy: 'Keep admin, founder, and investor journeys connected so the product feels like one platform from day one.'
    }
  ];
}
