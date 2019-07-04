import {AbstractControl} from '@angular/forms';

export  function classes(control: AbstractControl) {
  return {
    'text-blue': control.valid,
    'text-red': control.invalid && (control.dirty || control.touched)
  };
}


export function updateArray(arr: any[], newItem: any)   {
  const oldItem = arr.filter((a) => {
    return a._id === newItem._id;
  })[0];
  if (newItem.constructor === Array) {
    return arr.concat(newItem);
  }
  else if (oldItem) {
    const index = arr.indexOf(oldItem);
    arr[index] = newItem;
    return arr;
  }
  else {
    arr.push(newItem);
    return arr;
  }
}

export function removeItem(arr: any[], item: any) {
  const removedItem = arr.filter((a) => {
    return a._id === item._id;
  })[0];
  const index = arr.indexOf(removedItem);
  arr.splice(index, 1);
  return arr;
}

