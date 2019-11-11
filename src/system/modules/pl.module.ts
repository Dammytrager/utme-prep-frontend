import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PlRoutingModule } from '../routes/pl-routing.module';
import { PlComponent } from '../../components/container/pl.component';
import {DevToolsExtension, NgRedux, NgReduxModule} from '@angular-redux/store';
import {StoreEnhancer} from 'redux';
import {environment} from '../../environments/environment';
import {IAppState} from '../interfaces/appState.interface';
import {INITIAL_STATE, reducerApp} from '../store/store';
import { NavbarComponent } from '../../components/components/navbar.component';
import { LoginComponent } from '../../components/pages/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import { LoaderComponent } from '../../components/components/loader.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CategoriesComponent } from '../../components/pages/categories.component';
import {AdminAuthGuard} from '../routes/admin.guard';
import { NotFoundComponent } from '../../components/pages/not-found.component';
import {LoginGuard} from '../routes/login.guard';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../components/components/header.component';
import { PopUpComponent } from '../../components/components/pop-up.component';
import {NgbActiveModal, NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { SubjectsComponent } from '../../components/pages/subjects.component';
import { TopicComponent } from '../../components/pages/topic.component';
import { LessonComponent } from '../../components/pages/lesson.component';
import { ConversationComponent } from '../../components/pages/conversation.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {RouteLinkComponent} from '../../components/components/route-link.component';

@NgModule({
  declarations: [
    PlComponent,
    NavbarComponent,
    LoginComponent,
    LoaderComponent,
    CategoriesComponent,
    NotFoundComponent,
    HeaderComponent,
    PopUpComponent,
    SubjectsComponent,
    TopicComponent,
    LessonComponent,
    ConversationComponent,
    RouteLinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PlRoutingModule,
    NgReduxModule,
    ReactiveFormsModule,
    NgbModalModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    LoadingBarHttpClientModule,
    FontAwesomeModule,
    FileUploadModule,
    CKEditorModule
  ],
  providers: [
    ToastrService,
    NgbActiveModal,
    NgbModal,
    AdminAuthGuard,
    LoginGuard
  ],
  entryComponents: [
    PopUpComponent
  ],
  bootstrap: [PlComponent]
})
export class PlModule {
  constructor(private ngredux: NgRedux<IAppState>,
              private reduxDevTools: DevToolsExtension) {
    const enhancers: StoreEnhancer<IAppState>[] = (this.reduxDevTools.isEnabled() && !environment.production)
      ? [this.reduxDevTools.enhancer()] : [];

    ngredux.configureStore(reducerApp, INITIAL_STATE, [], enhancers);
  }
}
