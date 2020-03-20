import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from '../../components/pages/login.component';
import {CategoriesComponent} from '../../components/pages/categories.component';
import {AdminAuthGuard} from './admin.guard';
import {NotFoundComponent} from '../../components/pages/not-found.component';
import {LoginGuard} from './login.guard';
import {SubjectsComponent} from '../../components/pages/subjects.component';
import {TopicComponent} from '../../components/pages/topic.component';
import {LessonComponent} from '../../components/pages/lesson.component';
import {ConversationComponent} from '../../components/pages/conversation.component';
import {UsersComponent} from '../../components/pages/users.component';

const routes: Routes = [
  {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
  {
    path: 'admin',
    children: [
      {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
      {path: 'categories', component: CategoriesComponent, canActivate: [AdminAuthGuard]},
      {path: 'categories/:id/subjects', component: SubjectsComponent, canActivate: [AdminAuthGuard]},
      {path: 'subjects/:id/topics', component: TopicComponent, canActivate: [AdminAuthGuard]},
      {path: 'topics/:id/lessons', component: LessonComponent, canActivate: [AdminAuthGuard]},
      {path: 'conversations/:id', component: ConversationComponent, canActivate: [AdminAuthGuard]},
      {path: 'users', component: UsersComponent, canActivate: [AdminAuthGuard]}
    ]
  },
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PlRoutingModule { }
