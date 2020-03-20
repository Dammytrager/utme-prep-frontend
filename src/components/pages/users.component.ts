import {Component, OnDestroy, OnInit} from '@angular/core';
import {IHeader} from '../../system/interfaces/header.interface';
import {NgRedux, select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../system/services/users.service';
import {IAppState} from '../../system/interfaces/appState.interface';
import {ModalService} from '../../system/services/modals.service';
import {CHANGE_POPUP_CONTENT, CHANGE_USERS} from '../../system/store/actions';
import {PopUpComponent} from '../components/pop-up.component';
import {faEllipsisV, faPenSquare} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'pl-users',
    templateUrl: '../../system/templates/pages/users.html'
})
export class UsersComponent implements OnInit, OnDestroy {
    @select('users') users$: Observable<any>;
    $users$: Subscription;
    users = [];
    faEllipsisV = faEllipsisV;
    faPenSquare = faPenSquare;


    headerData: IHeader = {
        title: 'Users',
        button: 'Add User',
        popupContent: {
            title: 'Add User',
            button: 'Add',
            placeholder: 'User',
            content: ''
        }
    };

    constructor(private route: ActivatedRoute,
                private user: UsersService,
                private ngRedux: NgRedux<IAppState>,
                private modal: ModalService) {
        this.$users$ = this.users$.subscribe((data) => {
            this.users = data;
        });
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.user.getUsers();
    }

    editUser(user) {
        const popupContent = {
            title: 'Edit User',
            button: 'Save',
            placeholder: 'User',
            content: user
        };
        this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
        this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
    }

    deleteUser(user) {
        const popupContent = {
            title: 'Delete User',
            button: 'Delete',
            placeholder: 'User',
            content: user
        };
        this.ngRedux.dispatch({type: CHANGE_POPUP_CONTENT, popupContent});
        this.modal.openModal(PopUpComponent, {size: 'md', centered: true});
    }

    ngOnDestroy() {
        this.$users$.unsubscribe();
        this.ngRedux.dispatch({type: CHANGE_USERS, lesson: []});
    }
}
