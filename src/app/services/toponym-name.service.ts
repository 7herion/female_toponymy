import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToponymNameService {

  constructor() { }

  public extract(data: string): string {
    // TODO: extract name from toponym

    if (data.indexOf('-') != -1) {
      data = data.slice(0, (data.indexOf('-') - 1));
    }
    return data;
  }
}
