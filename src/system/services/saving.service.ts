import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_SUBJECTS,
  REMOVE_SUBJECTS,
  UPDATE_SUBJECTS
} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})

export class SavingService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {

  }


  async saveCategories(id, cb?) {
    const url = `${HOSTAPI}/edit-category/${id}/save`;
    this.http.put(url, {draft: false}).then((category) => {
      this.toast.info('Fetching subjects...', 'Success');
      if (cb) {
        cb();
      }
      return {message: 'success'};
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async saveSubject(id, cb?) {
    const url = `${HOSTAPI}/edit-subject/${id}/save`;
    this.http.put(url, {draft: false}).then((subject) => {
      if (cb) {
        cb();
      }
      return {message: 'success'};
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async saveTopic(id, cb?) {
    const url = `${HOSTAPI}/edit-topic/${id}/save`;
    this.http.put(url, {draft: false}).then((topic) => {
      if (cb) {
        cb();
      }
      return {message: 'success'};
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

}


