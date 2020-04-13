import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {IPopup} from '../../system/interfaces/popup.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Loader} from '../../system/interfaces/loader.interface';
import {SubjectService} from '../../system/services/subject.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'pl-add-users',
    templateUrl: '../../system/templates/components/add-users.html'
})
export class AddUsersComponent implements OnInit, OnDestroy {
    @select('popupContent') popupContent$: Observable<any>;
    $popupContent$: Subscription;
    popupContent: IPopup;
    usersForm: FormGroup;
    showLoader = false;
    loaderData: Loader = {
        color: 'white',
        type: 2
    };

    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private subject: SubjectService,
        private toastr: ToastrService
    ) {
        this.usersForm = fb.group({
            users: ['', Validators.required]
        });
    }

    get users() {
        return this.usersForm.get('users');
    }

    ngOnInit() {
        this.$popupContent$ = this.popupContent$.subscribe(async (data) => {
            this.popupContent = data;
            this.subject.getUsers(data.content._id).then((phone: any) => {
                let numbers = '';
                if (phone.length) {
                    phone.forEach((num) => {
                        numbers = numbers + num + '\n';
                    });
                }
                this.users.setValue(numbers);
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    closeModal() {
        this.activeModal.close();
    }

    addUsers() {
        this.showLoader = true;
        const users = this.users.value.split('\n');
        if (users[users.length - 1] === '') {
            users.pop();
        }
        const phonePattern = /^0\d{10}$/;
        const badNumbers = users.filter((user) => {
            return !phonePattern.test(user);
        });
        if (badNumbers.length) {
            this.toastr.error('Invalid Phone Number');
            this.showLoader = false;
        } else {
            this.subject.addUsers(this.popupContent.content._id, {users}).finally(() => {
                this.closeModal();
            });
        }
    }

    ngOnDestroy() {
        this.$popupContent$.unsubscribe();
    }
}
