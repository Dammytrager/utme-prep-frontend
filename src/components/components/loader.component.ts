import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pl-loader',
  templateUrl: '../../system/templates/components/loader.html'
})
export class LoaderComponent implements OnInit {

  @Input() data;
  _dataDefaults = {
    type: 1,
    color: 'blue',
    size: '1x'
  };

  constructor() { }

  ngOnInit() {
    this.data = {...this._dataDefaults, ...this.data};
  }

}
