import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../system/interfaces/appState.interface';
import {CHANGE_ADMIN_LOGGEDIN, CHANGE_ROUTE} from '../../system/store/actions';
import {ForageService} from "../../system/services/storage.service";

@Component({
  selector: 'pl-root',
  templateUrl: '../../system/templates/container/pl.html'
})
export class PlComponent implements OnInit {

  constructor(
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private storage: ForageService
    ) {
  }

  ngOnInit() {
    this.setRoute();
  }

  setRoute() {
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.ngRedux.dispatch({
          type: CHANGE_ROUTE,
          route: data.urlAfterRedirects
        });
      }
    });
  }

  autoNavigate(route) {
    if (route === '/' || route === '/admin') {
      this.router.navigate(['/admin/login']);
    }
  }

}
