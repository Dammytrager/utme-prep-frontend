import {IPopup} from './popup.interface';

export interface IAppState {
  route: string;
  isAdminLoggedIn: boolean;
  popupContent: IPopup;
  categories: any[];
  activeCategory: any;
  subjects: any[];
  topics: any[];
  lessons: any[];
  conversations: any[];
}

