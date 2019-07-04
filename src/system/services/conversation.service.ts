import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_CONVERSATIONS,
  CHANGE_TOPICS, REMOVE_CONVERSATIONS,
  REMOVE_TOPICS, UPDATE_CONVERSATIONS,
  UPDATE_TOPICS
} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';
import {FileUploader} from "ng2-file-upload";

@Injectable({
  providedIn: 'root'
})

export class ConversationService {
  file;
  id;
  uploader: FileUploader;

  constructor(private ngRedux: NgRedux<IAppState>,
              private storage: ForageService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpService,
              private toast: ToastrService) {
    // this.id = this.router.url.split('/')[3];
    // const url = `${HOSTAPI}/add-chat_image/${this.id}`;
    // this.uploader = new FileUploader({
    //   url,
    //   itemAlias: 'image'});
    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

  }

  getConversations(id) {
    this.storage.localGet('token').then((token: any) => {
      this.http.setHeaders({token});
      const url = `${HOSTAPI}/lessons/${id}/conversations`;
      this.http.get(url).then((data: any) => {
        const conversations = data.conversations;
        this.ngRedux.dispatch({type: CHANGE_CONVERSATIONS, conversations});
      });
    });
  }

  async addQuestion(question, id) {
    const url = `${HOSTAPI}/add-chat_question/${id}`;
    this.http.post(url, question).then((conversation) => {
      this.toast.success('Question Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error && err.error.message);
    });
  }

  async editQuestion(question, id) {
    this.http.put(`${HOSTAPI}/edit-chat_question/${id}`, question).then((conversation: any) => {
      this.toast.success('Conversation Updated successfully');
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async addMessage(message, id) {
    const url = `${HOSTAPI}/add-chat_message/${id}`;
    this.http.post(url, message).then((conversation) => {
      this.toast.success('Message Added successfully');
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error && err.error.message);
    });
  }

  async editMessage(message, id) {
    this.http.put(`${HOSTAPI}/edit-chat_message/${id}`, message).then((conversation: any) => {
      this.toast.success('Conversation Updated successfully');
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async addUpload(content?, id?, type?) {
    const url = type === 'image' ? `${HOSTAPI}/add-chat_image/${id}` :
      `${HOSTAPI}/add-chat_video/${id}`;
    this.http.post(url, content).then((conversation) => {
      this.toast.success(`${type} Added successfully`);
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error && err.error.message);
    });
  }

  async editUpload(content, id, type) {
    const url = type === 'image' ? `${HOSTAPI}/edit-chat_image/${id}` :
      `${HOSTAPI}/edit-chat_video/${id}`;
    this.http.put(url, content).then((conversation: any) => {
      this.toast.success(`${type} Updated successfully`);
      return this.ngRedux.dispatch({type: UPDATE_CONVERSATIONS, conversation});
    }).catch((err) => {
      return this.toast.error(err.error.message);
    });
  }

  async deleteConversation(id) {
    this.http.delete(`${HOSTAPI}/remove-conversation/${id}`).then((conversation) => {
      return this.ngRedux.dispatch({type: REMOVE_CONVERSATIONS, conversation});
    });
  }
}


