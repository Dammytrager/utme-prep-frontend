import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_PRESENT_CATEGORY,
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

export class SubjectService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {

  }

  async getSubjects(id, cb?) {
    this.storage.localGet('token').then((token: any) => {
      this.http.setHeaders({token});
      const url = `${HOSTAPI}/categories/${id}/subjects`;
      this.http.get(url).then((data: any) => {
        this.ngRedux.dispatch({type: CHANGE_SUBJECTS, subjects: data.subjects});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_CATEGORY, activeCategory: data.category[0]});
        if (cb) {
          cb(data.subjects);
        }
      });
    });
  }

  async addSubject(subject, id) {
    const url = `${HOSTAPI}/add-subject/${id}`;
    this.http.post(url, subject).then((subject) => {
      this.toast.success('Category Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_SUBJECTS, subject});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async editSubject(subject, id) {
    this.http.put(`${HOSTAPI}/edit-subject/${id}`, subject).then((retSubject: any) => {
      this.toast.success('Subject Updated successfully');
      const presentCategory = this.router.url.split('/')[3];
      if (retSubject.category !== presentCategory) {
        return this.ngRedux.dispatch({type: REMOVE_SUBJECTS, subject: retSubject});
      }
      return this.ngRedux.dispatch({type: UPDATE_SUBJECTS, subject: retSubject});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async deleteSubject(id) {
    this.http.delete(`${HOSTAPI}/remove-subject/${id}`).then((subject) => {
      return this.ngRedux.dispatch({type: REMOVE_SUBJECTS, subject});
    });
  }
}


