import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_LESSONS, CHANGE_PRESENT_CATEGORY, CHANGE_PRESENT_SUBJECT, CHANGE_PRESENT_TOPIC, REMOVE_LESSONS, UPDATE_LESSONS,
} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})

export class LessonService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {

  }

  getLessons(id) {
    this.storage.localGet('token').then((token: any) => {
      this.http.setHeaders({token});
      const url = `${HOSTAPI}/topics/${id}/lessons`;
      this.http.get(url).then((data: any) => {
        this.ngRedux.dispatch({type: CHANGE_LESSONS, lessons: data.lessons});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_TOPIC, activeTopic: data.topic});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_SUBJECT, activeSubject: data.subject});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_CATEGORY, activeCategory: data.subject.category});
      });
    });
  }

  async addLesson(lesson, id) {
    const url = `${HOSTAPI}/add-lesson/${id}`;
    this.http.post(url, lesson).then((lesson) => {
      this.toast.success('Lesson Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_LESSONS, lesson});
    }).catch((err) => {
      return this.toast.error(err.error && err.error.message);
    });
  }

  async editLesson(lesson, id) {
    this.http.put(`${HOSTAPI}/edit-lesson/${id}`, lesson).then((lesson: any) => {
      this.toast.success('Lesson Updated successfully');
      return this.ngRedux.dispatch({type: UPDATE_LESSONS, lesson});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async deleteLesson(id) {
    this.http.delete(`${HOSTAPI}/remove-lesson/${id}`).then((lesson) => {
      return this.ngRedux.dispatch({type: REMOVE_LESSONS, lesson});
    });
  }
}


