import { Component } from '@angular/core';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { BUILD_INFO } from '../core/_shared/build-info.generated';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [DatePipe, KeyValuePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  info = BUILD_INFO;
}

