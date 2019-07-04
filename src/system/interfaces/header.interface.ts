import {IPopup} from './popup.interface';

export interface IHeader {
  title: string;
  button: string;
  popupContent: IPopup;
}
