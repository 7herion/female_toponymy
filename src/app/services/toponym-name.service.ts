import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToponymNameService {

  constructor() { }

  public extract(data: string): string {
    if (data.indexOf('-') != -1) {
      data = data.slice(0, (data.indexOf('-') - 1));
    } else {
      data = data.substring(data.indexOf(' ') + 1);

      let re = new RegExp('^[a-z].* ');
      if (re.test(data)) {
        data = data.substring(data.indexOf(" ") + 1);
      }
    }

    if (data.indexOf(' e ') != - 1) {
      let second_name = data.slice(data.indexOf(' e ') + 3);
      data = data.slice(0, data.indexOf(' e '));

      if (data.indexOf(' ') == - 1) {
        data = second_name;
      }
    }

    return data;
  }
}
