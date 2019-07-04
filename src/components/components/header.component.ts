import {Component, Input, OnInit} from '@angular/core';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {IHeader} from '../../system/interfaces/header.interface';
import {ModalService} from '../../system/services/modals.service';
import {PopUpComponent} from './pop-up.component';
import {NgRedux, select} from '@angular-redux/store';
import {CHANGE_POPUP_CONTENT} from '../../system/store/actions';
import {IAppState} from '../../system/interfaces/appState.interface';
import {faEnvelope, faFileImage, faFileVideo, faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {SavingService} from '../../system/services/saving.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from "rxjs";
import {SubjectService} from "../../system/services/subject.service";
import {TopicService} from "../../system/services/topic.service";
import {ToastrService} from "ngx-toastr";
import {LessonService} from "../../system/services/lesson.service";

@Component({
  selector: 'pl-header',
  templateUrl: '../../system/templates/components/header.html'
})
export class HeaderComponent implements OnInit {
  @Input('data') data: IHeader;
  @select('popupContent') popupContent$: Observable<any>;
  $popupContent$: Subscription;
  popupContent;
  dataDefaults = {
    title: '',
    button: '',
    popupContent: {}
  };


  saveButton = 'Save';
  faPlus = faPlus;
  faEnvelope = faEnvelope;
  faFileImage = faFileImage;
  faFileVideo = faFileVideo;
  faQuestionCircle = faQuestionCircle;

  constructor(private modal: ModalService,
              private ngRedux: NgRedux<IAppState>,
              private saveService: SavingService,
              private router: Router,
              private route: ActivatedRoute,
              private subject: SubjectService,
              private topic: TopicService,
              private toast: ToastrService,
              private lesson: LessonService) {
    this.data = {...this.dataDefaults, ...this.data};
  }

  ngOnInit() {
    this.$popupContent$ = this.popupContent$.subscribe((data) => {
      this.popupContent = data;
    });
  }

  editDetails() {
    const popupContent = this.data.popupContent;
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  addConversation(type) {
    const popupContent = {
      title: `Add ${type}`,
      button: `Add ${type}`,
      placeholder: `${type.toLowerCase()}`,
      content: ''
    };
    this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
    this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
  }

  save() {
    const id = this.route.snapshot.paramMap.get('id');
    switch (this.data.title) {
      case 'Subjects':
        this.saveButton = 'Saving...';
        this.saveService.saveCategories(id, async (data: any) => {
          this.subject.getSubjects(id,(data: any) => {
            data.forEach(subject => {
              this.saveService.saveSubject(subject._id, () => {
                this.topic.getTopics(subject._id, (topics) => {
                  topics.forEach((topic) => {
                    this.saveService.saveTopic(topic._id).then(() => {
                    });
                  });
                });
              });
            });
            this.saveButton = 'save';
          });
        });
        break;
      case 'Topics':
        this.saveButton = 'Saving...';
        this.saveService.saveSubject(id, async (data: any) => {
          this.topic.getTopics(id, (topics) => {
            topics.forEach((topic) => {
              this.saveService.saveTopic(topic._id).then(() => {
                this.saveButton = 'save';
              });
            });
          });
          this.saveButton = 'Save';
        });
        break;
      case 'Lessons':
        this.saveButton = 'Saving...';
        this.saveService.saveTopic(id).then(async (data: any) => {
          await this.lesson.getLessons(id);
          this.saveButton = 'Save';
        });
    }
  }

}
