import {Component, OnDestroy, OnInit} from '@angular/core';
import {IHeader} from '../../system/interfaces/header.interface';
import {faEllipsisV, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '../../system/services/subject.service';
import {NgRedux, select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {CHANGE_POPUP_CONTENT} from '../../system/store/actions';
import {PopUpComponent} from '../components/pop-up.component';
import {ModalService} from '../../system/services/modals.service';
import {IAppState} from '../../system/interfaces/appState.interface';

@Component({
  selector: 'pl-subjects',
  templateUrl: '../../system/templates/pages/subjects.html'
})
export class SubjectsComponent implements OnInit, OnDestroy {
  @select('subjects') subjects$: Observable<any>;
  $subjects$: Subscription;
  subjects = [];

  faEllipsisV = faEllipsisV;
  faPenSquare = faPenSquare;
  headerData: IHeader = {
    title: 'Subjects',
    button: 'Add Subject',
    popupContent: {
      title: 'Add Subject',
      button: 'Add',
      placeholder: 'Subject',
      content: ''
    }
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private subject: SubjectService,
              private ngRedux: NgRedux<IAppState>,
              private modal: ModalService) { }

  ngOnInit() {
    this.$subjects$ = this.subjects$.subscribe((data) => {
      this.subjects = data;
    });
    this.getSubjects();
  }

  getSubjects() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subject.getSubjects(id);
  }

  editSubject(subject) {
    const popupContent = {
      title: 'Edit Subject',
      button: 'Save',
      placeholder: 'Category',
      content: subject
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  deleteSubject(subject) {
    const popupContent = {
      title: 'Delete Subject',
      button: 'Delete',
      placeholder: 'Category',
      content: subject
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  topics(subject) {
    this.router.navigate([`/admin/subjects/${subject._id}/topics`]);
  }

  ngOnDestroy() {
    this.$subjects$.unsubscribe();
  }

}
