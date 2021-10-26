import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToponymNameService {

  constructor() { }

  /**
   * Extracts the person name from the string.
   * It does nothing if there is only one white space in the input string.
   * If there are two names with an 'e' character between them,
   * it will return the second name if the first name
   * does not contain at least one white space.
   * 
   * @param data string containing the name
   * @returns extracted person name
   */
  public extract(data: string): string {
    if (data.indexOf('-') != -1) {
      data = data.slice(0, (data.indexOf('-') - 1));
    } else {
      let spaceCount: number = data.split(' ').length - 1;

      if (spaceCount > 1) {
        data = data.substring(data.indexOf(' ') + 1);

        let re = new RegExp('^[a-z].* ');
        if (re.test(data)) {
          data = data.substring(data.indexOf(" ") + 1);
        }
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
