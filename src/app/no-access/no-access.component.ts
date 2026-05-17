import { Component } from '@angular/core';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [],
  templateUrl: './no-access.component.html',
  styleUrl: './no-access.component.css',
})
export class NoAccessComponent {
  content = 'You do not have the required rights for accessing this page!';
}
