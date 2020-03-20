import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import {ForageService} from '../../system/services/storage.service';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import {patternMatch} from '../../system/utilities/validators';
import * as $ from 'jquery';
import {UsersService} from '../../system/services/users.service';

@Component({
  selector: 'pl-pop-up',
  templateUrl: '../../system/templates/components/pop-up.html'
})
export class PopUpComponent implements OnInit, OnDestroy {
  @select('popupContent') popupContent$: Observable<any>;
  ckeConfig: any;
  $popupContent$: Subscription;
  popupContent: IPopup;
  value;
  subjects = [];
  localFields = { text: 'title', value: '_id' };
  categories;
  faPlus = faPlus;
  optionsControl: FormControl;
  imageError = '';
  file;
  id;
  type;
  editor = ClassicEditor;
  editorData = '';
  editorConfig = {
    toolbar: {
      items: [
          'bold',
          'italic',
          'NumberedList',
          'BulletedList',
          'Link',
          'Blockquote',
          'Table',
          '|',
          'undo',
          'redo'
      ],

      viewportTopOffset: 30
    }
  };
  queryForm: FormGroup;
  showLoader = false;
  loaderData: Loader = {
    color: 'white',
    type: 2
  };
  imgUrl;

  constructor(private fb: FormBuilder,
              private activeModal: NgbActiveModal,
              private http: HttpService,
              private category: CategoryService,
              private subject: SubjectService,
              private topic: TopicService,
              private lesson: LessonService,
              private conversation: ConversationService,
              private user: UsersService,
              private router: Router,
              private storage: ForageService) {


    this.id = this.router.url.split('/')[3];
    this.queryForm = this.fb.group({
      query: ['', Validators.required]
    });
    this.optionsControl = this.fb.control(['', Validators.required]);
  }

  async ngOnInit() {
    this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true
    };
    this.$popupContent$ = this.popupContent$.subscribe(async (data) => {
      this.popupContent = data;
      this.imgUrl = this.popupContent.content.imageUrl;
      this.popupContent.content._id ?
        this.query.setValue(this.popupContent.content.title ||
          this.popupContent.content.message ||
          this.popupContent.content._id) :
        this.query.setValue(this.popupContent.content);
      this.type = this.popupContent.title.split(' ')[1].toLowerCase();

      if (this.popupContent.title.split(' ')[1] === 'User') {
        this.query.setValue('hi'); // to make query field valid
        const phoneNoRegex = /^0[0-9]{10}$/;
        const phoneNumber = this.fb.control('', [Validators.required, patternMatch(phoneNoRegex)]);
        const courses = this.fb.control('', [Validators.required]);
        this.queryForm.addControl('phoneNumber', phoneNumber);
        this.queryForm.addControl('courses', courses);
        this.storage.localGet('token').then((token: any) => {
          this.http.setHeaders({token});
          const url = `${HOSTAPI}/subjects`;
          this.http.get(url).then((data: any) => {
            this.subjects = data;
            this.localFields = { text: 'title', value: '_id' };
          });
        });
        if (this.popupContent.title === 'Edit User') {
          this.phoneNumber.setValue(this.popupContent.content.phone);
          this.courses.setValue(this.popupContent.content.courses);
        }
      }

      if (this.popupContent.title.split(' ')[1] === 'Subject') {
        const featured = this.fb.control(false);
        const recommended = this.fb.control(false);
        const author = this.fb.control('', [Validators.required]);
        const duration = this.fb.control('', [Validators.required]);
        const otherDetails = this.fb.control('', []);
        this.queryForm.addControl('featured', featured);
        this.queryForm.addControl('recommended', recommended);
        this.queryForm.addControl('author', author);
        this.queryForm.addControl('duration', duration);
        this.queryForm.addControl('otherDetails', otherDetails);

        if (this.popupContent.title === 'Edit Subject') {
          this.queryForm.addControl('options', this.optionsControl);
          this.featured.setValue(this.popupContent.content.featured);
          this.recommended.setValue(this.popupContent.content.recommended);
          this.author.setValue(this.popupContent.content.author);
          this.duration.setValue(this.popupContent.content.duration);
          this.otherDetails.setValue(this.popupContent.content.otherDetails);
          const url = `${HOSTAPI}/categories`;
          this.http.get(url).then((categories: any) => {
            this.categories = categories;
            const id = this.router.url.split('/')[3];
            this.options.setValue(id);
          });
        }
      }
      // Add Image Input
      if (this.popupContent.title.split(' ')[1] === 'Subject' ||
        this.popupContent.title.split(' ')[1] === 'Topic' ||
        this.popupContent.title.split(' ')[1] === 'Lesson') {
          const image = this.fb.control('');
          this.queryForm.addControl('image', image);
    }
      // Add Questions control
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
        const questionArray = this.fb.array([]);
        this.queryForm.addControl('question', questionArray);
        this.question.push(question);
        if (this.popupContent.title.split(' ')[0] === 'Edit') {
          this.question.controls[0].setValue({...this.popupContent.content.question, ...{rightAnswer: ''}});
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
      if (this.popupContent.title.split(' ')[1] === 'Message') {
        this.query.setValue('hi'); // to make query field valid
        const message = this.fb.group({
          content: ['', Validators.required]
        });
        this.queryForm.addControl('message', message);
        if (this.popupContent.title.split(' ')[0] === 'Edit') {
          this.editorData = this.popupContent.content.message;
          this.message.get('content').patchValue(this.editorData);
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
    return this.queryForm.get('question') as FormArray;
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
  get message() {
    return this.queryForm.get('message');
  }
  get featured() {
    return this.queryForm.get('featured');
  }
  get recommended() {
    return this.queryForm.get('recommended');
  }
  get author() {
    return this.queryForm.get('author');
  }
  get duration() {
    return this.queryForm.get('duration');
  }
  get otherDetails() {
    return this.queryForm.get('otherDetails');
  }
  get image() {
      return this.queryForm.get('image');
  }

  get phoneNumber() {
    return this.queryForm.get('phoneNumber');
  }

  get courses() {
    return this.queryForm.get('courses');
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.$popupContent$.unsubscribe();
  }

  initControl(type, key?, value?) {
    // initialize our controls
    if (type === 'question') {
      return this.fb.group({
        ques: ['', Validators.required],
        op1: ['', Validators.required],
        op2: ['', Validators.required],
        op3: ['', Validators.required],
        op4: ['', Validators.required],
        rightAnswer: ['', Validators.required],
        failure: ['', Validators.required],
        success: ['', Validators.required]
      });
    }
  }

  addControl(type) {
    type = type === 'video' || type === 'image' ?
      'upload' : type;
    this[type].push(this.initControl(type));
  }

  removeControl(type, index) {
    this[type].removeAt(index);
  }

  editorOnChange({ editor }: ChangeEvent) {
    const messageContent = this.message.get('content');
    this.editorData = editor.getData();
    messageContent.patchValue(this.editorData);
  }

  imageUpload(event) {
      this.imageError = '';
      const acceptedImageTypes = ['png', 'jpg', 'jpeg'];
      const uploadedFile = event.target.files[0];
      const uploadedFileType = uploadedFile.type.split('/')[1];
      if (acceptedImageTypes.indexOf(uploadedFileType) === -1) {
          this.imageError = 'The uploaded file type is not accepted';
      } else if (uploadedFile.size > 102400) {
          this.imageError = 'Max file size should be 100kb';
      } else {
          const reader = new FileReader();
          reader.readAsDataURL(uploadedFile);
          reader.onload = (event) => {
              this.imgUrl = reader.result;
              this.file = uploadedFile;
          };
      }
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
        const subjectData = new FormData();
        subjectData.append('image', this.file);
        subjectData.append('title', this.query.value);
        subjectData.append('author', this.author.value);
        subjectData.append('duration', this.duration.value);
        subjectData.append('otherDetails', this.otherDetails.value);
        this.subject.addSubject(subjectData, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Subject':
        const editSubjectData = new FormData();
        editSubjectData.append('image', this.file);
        editSubjectData.append('title', this.query.value);
        editSubjectData.append('featured', this.featured.value);
        editSubjectData.append('recommended', this.recommended.value);
        editSubjectData.append('category', this.options.value);
        editSubjectData.append('author', this.author.value);
        editSubjectData.append('duration', this.duration.value);
        editSubjectData.append('otherDetails', this.otherDetails.value);
        this.subject.editSubject(editSubjectData, this.popupContent.content._id).then(() => {
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
        const formattedQuestion = [];
        this.question.value.forEach(quest => {
          const options = {
              a: quest.op1,
              b: quest.op2,
              c: quest.op3,
              d: quest.op4
            };
          const rightAnswer = options[quest.rightAnswer];
          const question = {...quest, ...{rightAnswer}};
          formattedQuestion.push(question);
        });
        this.conversation.addQuestion(formattedQuestion, id).then(() => {
            this.closeModal();
          });
        break;
      case 'Edit Question':
        const quest = this.question.value[0];
        const UOptions = {
          a: quest.op1,
          b: quest.op2,
          c: quest.op3,
          d: quest.op4
        }; // UOptions means Updated Options
        const UrightAnswer = UOptions[quest.rightAnswer];
        const UQuestion = {...quest, ...{UrightAnswer}};
        this.conversation.editQuestion(UQuestion, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add User':
        const data = {
          phone: this.phoneNumber.value,
          courses: this.courses.value
        };
        this.user.addUser(data).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit User':
          const editdata = {
            phone: this.phoneNumber.value,
            courses: this.courses.value
          };
          this.user.editUser(this.popupContent.content._id, editdata).then(() => {
            this.closeModal();
          });
          break;
      case 'Delete User':
          this.user.deleteUser(this.popupContent.content._id).then(() => {
            this.closeModal();
          });
          break;
      case 'Add Message':
        const messageArr = [];
        let messages = this.message.value.content.split('</p>');
        const regex = /^\s+$/;
        messages = messages.filter(message => {
          return !(!message || message.match(regex));
        });
        messages.forEach(message => {
          message = message + '</p>';
          const obj = {content: message};
          messageArr.push(obj);
        });
        this.conversation.addMessage(messageArr, id).then(() => {
          this.closeModal();
        });
        break;
      case 'Edit Message':
        const msg = this.editorData;
        this.conversation.editMessage({message: msg}, this.popupContent.content._id).then(() => {
          this.closeModal();
        });
        break;
      case 'Add Image':
        this.storage.localGet('token').then((token: any) => {
          this.http.setHeaders({token});
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
