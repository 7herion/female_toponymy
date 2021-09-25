import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const WIKIPEDIA_API_ENDPOINT = `https://it.wikipedia.org/w/api.php`;
const WIKIPEDIA_API_OPTIONS = `?format=json&action=query&prop=extracts&redirects=1&origin=*`;
const WIKIPEDIA_API_IMAGE_OPTIONS = `?format=json&action=query&prop=pageimages&piprop=original&origin=*`;

@Injectable({
  providedIn: 'root'
})
export class WikipediaQueryService {

  public getInfo(name: string) {
    return this.http.get<any>(`${WIKIPEDIA_API_ENDPOINT}${WIKIPEDIA_API_OPTIONS}&titles=${name}`);
  }

  public getImage(name: string) {
    return this.http.get<any>(`${WIKIPEDIA_API_ENDPOINT}${WIKIPEDIA_API_IMAGE_OPTIONS}&titles=${name}`);
  }

  constructor(
    private readonly http: HttpClient
  ) { }
}
