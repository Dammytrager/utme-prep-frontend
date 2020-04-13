import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ForageService} from './storage.service';
import {IAppState} from '../interfaces/appState.interface';
import {
    CHANGE_USERS,
    REMOVE_LESSONS, REMOVE_USERS,
    UPDATE_USERS,
} from '../store/actions';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {HOSTAPI} from '../utilities/constants';

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    constructor(private ngRedux: NgRedux<IAppState>,
                private storage: ForageService,
                private route: ActivatedRoute,
                private router: Router,
                private http: HttpService,
                private toast: ToastrService) {

    }

    getUsers() {
        this.storage.localGet('token').then((token: any) => {
            this.http.setHeaders({token});
            const url = `${HOSTAPI}/user`;
            this.http.get(url).then((data: any) => {
                this.ngRedux.dispatch({type: CHANGE_USERS, users: data});
            });
        });
    }

    async addUser(user) {
        const url = `${HOSTAPI}/user`;
        this.http.post(url, user).then((data: any) => {
            this.toast.success('User Added successfully');
            console.log(data);
            return this.ngRedux.dispatch({type: UPDATE_USERS, users: data.user});
        }).catch((err) => {
            return this.toast.error(err.error && err.error.message);
        });
    }

    async editUser(id, user) {
        this.http.put(`${HOSTAPI}/user/${id}`, user).then((data: any) => {
            this.toast.success('User Updated successfully');
            return this.ngRedux.dispatch({type: UPDATE_USERS, users: data});
        }).catch((err) => {
            return this.toast.error(err.error.message);
        });
    }

    async deleteUser(id) {
        this.http.delete(`${HOSTAPI}/user/${id}`).then((user) => {
            this.toast.success('User deleted successfully');
            return this.ngRedux.dispatch({type: REMOVE_USERS, user});
        });
    }
}
