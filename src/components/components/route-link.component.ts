import {Component, Input, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';

@Component({
    selector: 'pl-route-link',
    templateUrl: '../../system/templates/components/route-link.html'
})

export class RouteLinkComponent implements OnInit {
    @select('activeCategory') activeCategory;
    @select('activeSubject') activeSubject;
    @select('activeTopic') activeTopic;
    @select('activeLesson') activeLesson;
    @Input() showSubject = false;
    @Input() showTopic = false;
    @Input() showLesson = false;
    @Input() page: string;
    constructor() { }

    ngOnInit() {
    }
}
