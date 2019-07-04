import {Injectable, OnInit} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {ROUTES} from '../utilities/constants';
import {select} from '@angular-redux/store';
import {ForageService} from '../services/storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {AdminService} from "../services/admin.service";

@Injectable()

export class AdminAuthGuard implements CanActivate {
  @select('isAdminLoggedIn') $isAdminLoggedIn: Observable<IAppState>;
  $isAdminLoggedIn$: Subscription;
  private isAdminLoggedIn;

  constructor(
    private router: Router,
    private storage: ForageService,
    private admin: AdminService
    ) {
    this.$isAdminLoggedIn$ = this.$isAdminLoggedIn.subscribe((data) => this.isAdminLoggedIn = data);
    // this._storage.localGet('user').then((data) => {
    //     this._userType = data['type'];
    //     this._signedIn = data['data']['data'];
    //     console.log(data, this._signedIn, this._userType);
    // });
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.admin.isAdminLoggedin();
    if (!this.isAdminLoggedIn) {
      this.router.navigate(['/admin/login'], {queryParams: {
         returnUrl: state.url
        }});
      return false;
    }
    return true;
  }


}
