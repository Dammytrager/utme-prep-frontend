import {AbstractControl, ValidatorFn} from '@angular/forms';

export function patternMatch(value: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const pass: boolean = value.test(control.value);
    return pass ? null : {patternFail: true};
  };
}
