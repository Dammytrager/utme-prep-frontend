import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Loader} from '../../system/interfaces/loader.interface';
import {IPopup} from '../../system/interfaces/popup.interface';
import {HttpService} from '../../system/services/http.service';
import {CategoryService} from '../../system/services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HOSTAPI} from '../../system/utilities/constants';
import {SubjectService} from '../../system/services/subject.service';
import {TopicService} from '../../system/services/topic.service';
import {LessonService} from '../../system/services/lesson.service';
import {ConversationService} from '../../system/services/conversation.service';
import {FileUploader} from 'ng2-file-upload';
import {ForageService} from '../../system/services/storage.service';

@Component({
  selector: 'pl-pop-up',
  templateUrl: '../../system/templates/components/pop-up.html'
})
export class PopUpComponent implements OnInit, OnDestroy {
  @select('popupContent') popupContent$: Observable<any>;
  $popupContent$: Subscription;
  popupContent: IPopup;
  categories;
  optionsControl: FormControl;
  file;
  id;
  queryForm: FormGroup;
  showLoader = false;
  loaderData: Loader = {
    color: 'white',
    type: 2
  };

  constructor(private fb: FormBuilder,
              private activeModal: NgbActiveModal,
              private http: HttpService,
              private category: CategoryService,
              private subject: SubjectService,
              private topic: TopicService,
              private lesson: LessonService,
              private conversation: ConversationService,
              private router: Router,
              private storage: ForageService) {


    this.id = this.router.url.split('/')[3];
    // const url = `${HOSTAPI}/add-chat_image/${this.id}`;
    // this.uploader = new FileUploader({
    //   url,
    //   itemAlias: 'file'});
    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.queryForm = this.fb.group({
      query: ['', Validators.required]
    });
    this.optionsControl = this.fb.control(['', Validators.required]);
  }

  async ngOnInit() {
    this.$popupContent$ = this.popupContent$.subscribe(async (data) => {
      this.popupContent = data;
      this.popupContent.content._id ?
        this.query.setValue(this.popupContent.content.title ||
          this.popupContent.content.message ||
          this.popupContent.content._id) :
        this.query.setValue(this.popupContent.content);
      if (this.popupContent.title === 'Edit Subject') {
        this.queryForm.addControl('options', this.optionsControl);
        const url = `${HOSTAPI}/categories`;
        this.http.get(url).then((categories: any) => {
          this.categories = categories;
          const id = this.router.url.split('/')[3];
          this.options.setValue(id);
        });

      }
      if (this.popupContent.title.split(' ')[1] === 'Question') {
        this.query.setValue('hi'); // to make query field valid
        const question = this.fb.group({
          ques: ['', Validators.required],
          op1: ['', Validators.required],
          op2: ['', Validators.required],
          op3: ['', Validators.required],
          op4: ['', Validators.required],
          rightAnswer: ['', Validators.required],
          failure: ['', Validators.required],
          success: ['', Validators.required]
        });
        this.queryForm.addControl('question', question);
        if (this.popupContent.title.split(' ')[0] === 'Edit') {
          this.question.setValue({...this.popupContent.content.question, ...{rightAnswer: ''}});
        }
      }
      if (this.popupContent.title.split(' ')[1] === 'Image' ||
        this.popupContent.title.split(' ')[1] === 'Video') {
        this.query.setValue('hi'); // to make query field valid
        const upload = this.fb.group({
          content: ['', Validators.required],
          caption: ['', Validators.required]
        });
        this.queryForm.addControl('upload', upload);
        if (this.popupContent.title === 'Edit Image') {
          this.caption.setValue(this.popupContent.content.image.caption);
          this.content.clearValidators();
        }
        if (this.popupContent.title === 'Edit Video') {
          this.caption.setValue(this.popupContent.content.video.caption);
          this.content.clearValidators();
        }
      }
    });
  }

  get query() {
    return this.queryForm.get('query');
  }
  get options() {
    return this.queryForm.get('options');
  }
  get question() {
    return this.queryForm.get('question');
  }
  get ques() {
    return this.queryForm.get('question').get('ques');
  }
  get op1() {
    return this.queryForm.get('question').get('op1');
  }
  get op2() {
    return this.queryForm.get('question').get('op2');
  }
  get op3() {
    return this.queryForm.get('question').get('op3');
  }
  get op4() {
    return this.queryForm.get('question').get('op4');
  }
  get rightAnswer() {
    return this.queryForm.get('question').get('rightAnswer');
  }
  get failure() {
    return this.queryForm.get('question').get('failure');
  }
  get success() {
    return this.queryForm.get('question').get('success');
  }
  get upload() {
    return this.queryForm.get('upload');
  }
  get content() {
    return this.queryForm.get('upload').get('content');
  }
  get caption() {
    return this.queryForm.get('upload').get('caption');
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.$popupContent$.unsubscribe();
  }


  action() {
    this.showLoader = true;
    const id = this.router.url.split('/')[3];
    switch (this.popupContent.title) {
      case 'Add Category':
        this.category.addCategory({title: this.query.value}).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Category':
        this.category.editCategory({title: this.query.value}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Delete Category':
        this.category.deleteCategory(this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Subject':
        this.subject.addSubject({title: this.query.value}, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Subject':
        this.subject.editSubject({title: this.query.value, category: this.options.value}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Delete Subject':
        this.subject.deleteSubject(this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Topic':
        this.topic.addTopic({title: this.query.value}, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Topic':
        this.topic.editTopic({title: this.query.value}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Delete Topic':
        this.topic.deleteTopic(this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Lesson':
        this.lesson.addLesson({title: this.query.value}, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Lesson':
        this.lesson.editLesson({title: this.query.value}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Delete Lesson':
        this.lesson.deleteLesson(this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Question':
        const options = {
          a: this.op1.value,
          b: this.op2.value,
          c: this.op3.value,
          d: this.op4.value
        };
        const rightAnswer = options[this.rightAnswer.value];
        const question = {...this.question.value, ...{rightAnswer}};
        this.conversation.addQuestion(question, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Question':
        const UOptions = {
          a: this.op1.value,
          b: this.op2.value,
          c: this.op3.value,
          d: this.op4.value
        }; // UOptions means Updated Options
        const URightAnswer = UOptions[this.rightAnswer.value];
        const UQuestion = {...this.question.value, ...{UrightAnswer: URightAnswer}};
        this.conversation.editQuestion(UQuestion, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Message':
        this.conversation.addMessage({message: this.query.value}, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Message':
        this.conversation.editMessage({message: this.query.value}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Image':
        this.storage.localGet('token').then((token: any) => {
          this.http.setHeaders({token});
          console.log(this.http.Headers);
        });
        const content = new FormData();
        content.append('file', this.file);
        content.append('caption', this.caption.value);
        this.conversation.addUpload(content, id, 'image').then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Image':
        const updcontent = new FormData();
        updcontent.append('file', this.file);
        updcontent.append('caption', this.caption.value);
        this.conversation.editUpload(updcontent, this.popupContent.content._id, 'image').then(() => {
          this.closeModal();
        });
        break;
      case 'Add Video':
        this.storage.localGet('token').then((token: any) => {
          this.http.setHeaders({token});
          console.log(this.http.Headers);
        });
        const videocontent = new FormData();
        videocontent.append('file', this.file);
        videocontent.append('caption', this.caption.value);
        this.conversation.addUpload(videocontent, id, 'video').then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Video':
        const updvidcontent = new FormData();
        updvidcontent.append('file', this.file);
        updvidcontent.append('caption', this.caption.value);
        this.conversation.editUpload(updvidcontent, this.popupContent.content._id, 'video').then(() => {
          this.closeModal();
        });
        break;
      case 'Delete Question':
      case 'Delete Message':
      case 'Delete Video':
      case 'Delete Image':
        this.conversation.deleteConversation(this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
    }
  }
}
