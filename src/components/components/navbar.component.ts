import { Component, OnInit } from '@angular/core';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {AdminService} from '../../system/services/admin.service';

@Component({
  selector: 'pl-navbar',
  templateUrl: '../../system/templates/components/navbar.html'
})
export class NavbarComponent implements OnInit {

  faSignOutAlt = faSignOutAlt;

  constructor(private admin: AdminService) { }

  ngOnInit() {
  }

  logout() {
    this.admin.adminLogout();
  }

}
