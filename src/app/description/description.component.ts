import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToponymNameService } from '../services/toponym-name.service';
import { WikipediaQueryService } from '../services/wikipedia-query.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  public name!: string;
  public dataFound: boolean = false;
  public imageFound: boolean = false;

  public descr!: string;
  public imageSource: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: string,
    private readonly toponymName: ToponymNameService,
    private readonly wikiQuery: WikipediaQueryService,
  ) { }

  ngOnInit(): void {
    this.name = this.toponymName.extract(this.data)

    this.wikiQuery.getInfo(this.name).subscribe(res => {
      let pageNr = +Object.getOwnPropertyNames(res.query.pages)[0];
      if (pageNr != -1) {
        this.descr = res.query.pages[pageNr].extract;
        this.dataFound = true;
      } else {
        this.descr = '<i>Nessun dato trovato su Wikipedia.</i>';
      }
    });

    this.wikiQuery.getImage(this.name).subscribe(res => {
      let pageNr = +Object.getOwnPropertyNames(res.query.pages)[0];
      if (pageNr != -1 && res.query.pages[pageNr].original) {
        this.imageSource = res.query.pages[pageNr].original.source;
        this.imageFound = true;
      }
    });
  }

}
