import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  // closeAll() {
  //   this.matDialog.closeAll();
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: string,
    // private readonly matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
