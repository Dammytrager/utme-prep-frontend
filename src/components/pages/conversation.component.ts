import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {IHeader} from '../../system/interfaces/header.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppState} from '../../system/interfaces/appState.interface';
import {ModalService} from '../../system/services/modals.service';
import {CHANGE_LESSONS, CHANGE_POPUP_CONTENT} from '../../system/store/actions';
import {PopUpComponent} from '../components/pop-up.component';
import {ConversationService} from '../../system/services/conversation.service';
import {faEnvelope, faFileImage, faFileVideo, faQuestionCircle} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'pl-conversation',
  templateUrl: '../../system/templates/pages/conversation.html'
})
export class ConversationComponent implements OnInit, OnDestroy {
  @select('conversations') conversations$: Observable<any>;
  $conversations$: Subscription;
  conversations = [];
  faEllipsisV = faEllipsisV;

  headerData: IHeader = {
    title: 'Conversations',
    button: 'Add',
    popupContent: {
      title: 'Add Lesson',
      button: 'Add',
      placeholder: 'Lesson',
      content: ''
    }
  };
  activeConversation = '';

  constructor(private route: ActivatedRoute,
              private conversation: ConversationService,
              private ngRedux: NgRedux<IAppState>,
              private modal: ModalService,
              private router: Router) {
    this.$conversations$ = this.conversations$.subscribe((data) => {
      this.conversations = data;
    });
  }

  ngOnInit() {
    this.getConversations();
  }

  getConversations() {
    const id = this.route.snapshot.paramMap.get('id');
    this.conversation.getConversations(id);
  }

  editConversation(conversation) {
    const popupContent = {
      title: `Edit ${conversation.type}`,
      button: 'Save',
      placeholder: 'Lesson',
      content: conversation
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  deleteConversation(conversation) {
    const popupContent = {
      title: `Delete ${conversation.type}`,
      button: 'Delete',
      placeholder: 'Lesson',
      content: conversation
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  // conversations(conversation) {
  //   this.router.navigate([`/admin/conversations/${conversation._id}`]);
  // }

  ngOnDestroy() {
    this.$conversations$.unsubscribe();
    this.ngRedux.dispatch({type: CHANGE_LESSONS, lesson: []});
  }
}
