import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_PRESENT_CATEGORY, CHANGE_PRESENT_SUBJECT,
  CHANGE_TOPICS,
  REMOVE_TOPICS,
  UPDATE_TOPICS
} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})

export class TopicService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {

  }

  getTopics(id, cb?) {
    this.storage.localGet('token').then((token: any) => {
      this.http.setHeaders({token});
      const url = `${HOSTAPI}/subjects/${id}/topics`;
      this.http.get(url).then((data: any) => {
        const topics = data.topics;
        this.ngRedux.dispatch({type: CHANGE_TOPICS, topics});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_CATEGORY, activeCategory: data.subject.category});
        this.ngRedux.dispatch({type: CHANGE_PRESENT_SUBJECT, activeSubject: data.subject});
        if (cb) {
          cb(data.topics);
        }
      });
    });
  }


  async addTopic(topic, id) {
    const url = `${HOSTAPI}/add-topic/${id}`;
    this.http.post(url, topic).then((topic) => {
      this.toast.success('Category Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_TOPICS, topic});
    }).catch((err) => {
      return this.toast.error(err.error && err.error.message);
    });
  }

  async editTopic(topic, id) {
    this.http.put(`${HOSTAPI}/edit-topic/${id}`, topic).then((topic: any) => {
      this.toast.success('Topic Updated successfully');
      return this.ngRedux.dispatch({type: UPDATE_TOPICS, topic});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async deleteTopic(id) {
    this.http.delete(`${HOSTAPI}/remove-topic/${id}`).then((topic) => {
      return this.ngRedux.dispatch({type: REMOVE_TOPICS, topic});
    });
  }
}


