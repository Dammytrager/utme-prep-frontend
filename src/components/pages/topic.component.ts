import {Component, OnDestroy, OnInit} from '@angular/core';
import {IHeader} from '../../system/interfaces/header.interface';
import {NgRedux, select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicService} from '../../system/services/topic.service';
import {faEllipsisV, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import {IAppState} from '../../system/interfaces/appState.interface';
import {CHANGE_POPUP_CONTENT, CHANGE_TOPICS} from '../../system/store/actions';
import {PopUpComponent} from '../components/pop-up.component';
import {ModalService} from '../../system/services/modals.service';

@Component({
  selector: 'pl-topic',
  templateUrl: '../../system/templates/pages/topic.html'
})
export class TopicComponent implements OnInit, OnDestroy {
  @select('topics') topics$: Observable<any>;
  $topics$: Subscription;
  topics = [];
  faEllipsisV = faEllipsisV;
  faPenSquare = faPenSquare;

  headerData: IHeader = {
    title: 'Topics',
    button: 'Add Topic',
    popupContent: {
      title: 'Add Topic',
      button: 'Add',
      placeholder: 'Topic',
      content: ''
    }
  };

  constructor(private route: ActivatedRoute,
              private topic: TopicService,
              private router: Router,
              private ngRedux: NgRedux<IAppState>,
              private modal: ModalService) {
    this.$topics$ = this.topics$.subscribe((data) => {
      this.topics = data;
    });
  }

  ngOnInit() {
    this.getTopics();
  }

  getTopics() {
    const id = this.route.snapshot.paramMap.get('id');
    this.topic.getTopics(id);
  }

  editTopic(topic) {
    const popupContent = {
      title: 'Edit Topic',
      button: 'Save',
      placeholder: 'Topic',
      content: topic
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  deleteTopic(topic) {
    const popupContent = {
      title: 'Delete Topic',
      button: 'Delete',
      placeholder: 'Topic',
      content: topic
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  lessons(topic) {
    this.router.navigate([`/admin/topics/${topic._id}/lessons`]);
  }

  ngOnDestroy() {
    this.$topics$.unsubscribe();
    this.ngRedux.dispatch({type: CHANGE_TOPICS, topic: []});
  }

}
