import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {faEllipsisV, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import {IHeader} from '../../system/interfaces/header.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppState} from '../../system/interfaces/appState.interface';
import {ModalService} from '../../system/services/modals.service';
import {CHANGE_LESSONS, CHANGE_POPUP_CONTENT} from '../../system/store/actions';
import {PopUpComponent} from '../components/pop-up.component';
import {LessonService} from '../../system/services/lesson.service';

@Component({
  selector: 'pl-lesson',
  templateUrl: '../../system/templates/pages/lesson.html'
})
export class LessonComponent implements OnInit, OnDestroy {
  @select('lessons') lessons$: Observable<any>;
  $lessons$: Subscription;
  lessons = [];
  faEllipsisV = faEllipsisV;
  faPenSquare = faPenSquare;

  headerData: IHeader = {
    title: 'Lessons',
    button: 'Add Lesson',
    popupContent: {
      title: 'Add Lesson',
      button: 'Add',
      placeholder: 'Lesson',
      content: ''
    }
  };

  constructor(private route: ActivatedRoute,
              private lesson: LessonService,
              private ngRedux: NgRedux<IAppState>,
              private modal: ModalService,
              private router: Router) {
    this.$lessons$ = this.lessons$.subscribe((data) => {
      this.lessons = data;
    });
  }

  ngOnInit() {
    this.getLessons();
  }

  getLessons() {
    const id = this.route.snapshot.paramMap.get('id');
    this.lesson.getLessons(id);
  }

  editLesson(lesson) {
    const popupContent = {
      title: 'Edit Lesson',
      button: 'Save',
      placeholder: 'Lesson',
      content: lesson
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  deleteLesson(lesson) {
    const popupContent = {
      title: 'Delete Lesson',
      button: 'Delete',
      placeholder: 'Lesson',
      content: lesson
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  _conversations(lesson) {
    this.router.navigate([`/admin/conversations/${lesson._id}`]);
  }

  ngOnDestroy() {
    this.$lessons$.unsubscribe();
    this.ngRedux.dispatch({type: CHANGE_LESSONS, lesson: []});
  }
}
