import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {CHANGE_ADMIN_LOGGEDIN} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from "ngx-toastr";
import {HOSTAPI} from "../utilities/constants";

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService
              ) {
  }

  async isAdminLoggedin() {
    await this.storage.localGet('token').then((token) => {
      if (token) {
        this.ngRedux.dispatch({type: CHANGE_ADMIN_LOGGEDIN, isAdminLoggedIn: true});
      }
    });
  }

  adminLogin(loginDetails) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin/categories';
    const url = `${HOSTAPI}/login`;
    return this.http.post(url, loginDetails)
      .then((response: any) => {
        this.storage.localSet({key: 'token', data: response.token}).then((data) => {
          this.router.navigate([returnUrl]);
          this.ngRedux.dispatch({type: CHANGE_ADMIN_LOGGEDIN, isAdminLoggedIn: true});
        });
        this.toast.success('login successful');
      })
      .catch(err => {
        this.toast.error(err.error.message);
      });
  }

  adminLogout() {
    this.storage.localRemove('token').then((data) => {
      this.ngRedux.dispatch({type: CHANGE_ADMIN_LOGGEDIN, isAdminLoggedIn: false});
      this.router.navigate(['/admin/login']);
    });
  }
}

