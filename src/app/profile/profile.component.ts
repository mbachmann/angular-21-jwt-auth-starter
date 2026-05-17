import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [],
})
export class ProfileComponent implements OnInit {
  private storageService = inject(StorageService);

  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}
