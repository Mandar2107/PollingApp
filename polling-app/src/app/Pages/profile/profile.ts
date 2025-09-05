import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/services/auth.service';

interface UserProfile {
  username: string;
  email: string;
  status: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  user: UserProfile = {
    username: '',
    email: '',
    status: 'Active',
    avatarUrl: 'https://tse4.mm.bing.net/th/id/OIP.oM71KD-EN9AG92eLdv6WwwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
  };

  newUsername: string = '';
  newEmail: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadLoggedInUser();
  }

  loadLoggedInUser() {
    // Try reading from localStorage
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const savedUser = JSON.parse(userData);
      this.user = { ...this.user, ...savedUser };
      this.newUsername = this.user.username;
      this.newEmail = this.user.email;
      return;
    }

    // Optionally: decode JWT to get user info
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        this.user.username = decoded.FullName || '';
        this.user.email = decoded.unique_name || '';
        this.newUsername = this.user.username;
        this.newEmail = this.user.email;
      } catch {
        console.warn('Cannot decode token');
      }
    }
  }

  saveProfile() {
    this.user.username = this.newUsername;
    this.user.email = this.newEmail;

    // Persist in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(this.user));

    if (this.newPassword) {
      console.log('Password updated (not sent to backend yet)');
    }

    alert('Profile updated ✅');
  }

  changeAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Update preview
      this.user.avatarUrl = URL.createObjectURL(file);

      // Save in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(this.user));

      // Later: send file to backend API to persist permanently
    }
  }
}
