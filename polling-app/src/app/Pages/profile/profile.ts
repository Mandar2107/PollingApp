import { Component } from '@angular/core';

interface UserProfile {
  username: string;
  email: string;
  joined: string;
  status: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {

  user: UserProfile = {
    username: 'Mandar Wagale',
    email: 'mandarwagale0@gmail.com',
    joined: '29-Sep-2025',
    status: 'Active',
    avatarUrl: 'https://tse4.mm.bing.net/th/id/OIP.oM71KD-EN9AG92eLdv6WwwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
  };

  // Form fields (bound to input)
  newUsername: string = this.user.username;
  newEmail: string = this.user.email;
  newPassword: string = '';

  /** Save changes */
  saveProfile() {
    this.user.username = this.newUsername;
    this.user.email = this.newEmail;
    if (this.newPassword) {
      console.log('Password updated (not shown for security).');
    }

    alert('Profile updated successfully ✅');
  }

  /** Change avatar (placeholder for now) */
  changeAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.avatarUrl = URL.createObjectURL(file);
    }
  }
}
