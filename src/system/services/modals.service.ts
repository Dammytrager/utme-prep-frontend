import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})

export class ModalService {
    constructor(private ngbmodal: NgbModal) {}

    openModal(component: any,
              options: {
                  ariaLabelledBy?: string;
                  backdrop?: boolean | 'static';
                  beforeDismiss?: () => boolean | Promise<boolean>;
                  centered?: boolean;
                  container?: string;
                  // injector?: Injector;
                  keyboard?: boolean;
                  size?: 'sm' | 'lg' | any;
                  windowClass?: string;
                  backdropClass?: string;
              } = {size: 'xl', centered: true, keyboard: false}) {
        return this.ngbmodal.open(component, {
            windowClass: 'center',
            ...options
        });
    }

    dismissAllModal() {
        this.ngbmodal.dismissAll();
    }

}
