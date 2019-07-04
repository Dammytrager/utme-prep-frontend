import {Component, OnDestroy, OnInit} from '@angular/core';
import {faEllipsisV, faPlus} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from '../../system/services/http.service';
import {IHeader} from '../../system/interfaces/header.interface';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../../system/interfaces/appState.interface';
import {CHANGE_CATEGORIES, CHANGE_POPUP_CONTENT, CHANGE_SUBJECTS} from '../../system/store/actions';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../system/services/modals.service';
import {PopUpComponent} from '../components/pop-up.component';
import {Observable, Subscription} from 'rxjs';
import {HOSTAPI} from '../../system/utilities/constants';
import {CategoryService} from '../../system/services/category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'pl-categories',
  templateUrl: '../../system/templates/pages/categories.html'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @select('categories') categories$: Observable<any>;
  $categories$: Subscription;

  faEliipsisV = faEllipsisV;
  categories = [];
  headerData: IHeader = {
    title: 'Category',
    button: 'Add Category',
    popupContent: {
      title: 'Add Category',
      button: 'Add',
      placeholder: 'Category',
      content: '',
      endpoint: '/add-subject'
    }
  };

  constructor(private http: HttpService,
              private ngRedux: NgRedux<IAppState>,
              private modal: ModalService,
              private category: CategoryService,
              private router: Router) { }

  ngOnInit() {
    this.$categories$ = this.categories$.subscribe((data) => {
      this.categories = data;
    });
    this.getCategories();
  }

  onEvent($event) {
    $event.stopPropagation();
  }

  getCategories() {
    this.category.getCategories();
    this.ngRedux.dispatch({type: CHANGE_SUBJECTS, subjects: []});
  }

  editCategory(category) {
    const popupContent = {
      title: 'Edit Category',
      button: 'Save',
      placeholder: 'Category',
      content: category
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  deleteCategory(category) {
    const popupContent = {
      title: 'Delete Category',
      button: 'Delete',
      placeholder: 'Category',
      content: category
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  subjects(category) {
    this.router.navigate([`/admin/categories/${category._id}/subjects`]);
  }

  ngOnDestroy() {
    this.$categories$.unsubscribe();
  }
}
