import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../system/services/http.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../system/interfaces/appState.interface';
import {patternMatch} from '../../system/utilities/validators';
import {REGEX} from '../../system/utilities/constants';
import {classes} from 'src/system/utilities/functions';
import {Loader} from '../../system/interfaces/loader.interface';
import {ForageService} from '../../system/services/storage.service';
import {CHANGE_ADMIN_LOGGEDIN} from "../../system/store/actions";
import {AdminService} from "../../system/services/admin.service";

@Component({
  selector: 'pl-login',
  templateUrl: '../../system/templates/pages/login.html'
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup;
  showLoader = false;
  classes = classes;
  loaderData: Loader = {
    color: 'white',
    type: 2
  };

  constructor(
    private fb: FormBuilder,
    private admin: AdminService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, patternMatch(REGEX.EMAIL)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  async signin() {
    if (this.signinForm.valid) {
      this.showLoader = true;
      await this.admin.adminLogin(this.signinForm.value);
      this.showLoader = false;
    }
  }

}
