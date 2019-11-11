import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {CHANGE_CATEGORIES, REMOVE_CATEGORIES, UPDATE_CATEGORIES} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {
  }

  async getCategories(ret?) {
    this.storage.localGet('token').then((token: any) => {
      this.http.setHeaders({token});
      const url = `${HOSTAPI}/categories`;
      this.http.get(url).then((categories: any) => {
        // this.categories = categories;
        if (ret) {
          return categories;
        }
        this.ngRedux.dispatch({type: CHANGE_CATEGORIES, categories});
      });
    });
  }

  async addCategory(category) {
    const url = `${HOSTAPI}/add-category`;
    this.http.post(url, category).then((category) => {
      this.toast.success('Category Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_CATEGORIES, category});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async editCategory(category, id) {
    this.http.put(`${HOSTAPI}/edit-category/${id}`, category).then((category) => {
      this.toast.success('Category Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_CATEGORIES, category});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async deleteCategory(id) {
    this.http.delete(`${HOSTAPI}/remove-category/${id}`).then((category) => {
      return this.ngRedux.dispatch({type: REMOVE_CATEGORIES, category});
    });
  }
}


