import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DescriptionComponent } from '../description/description.component';
import { SlidingDivComponent } from '../sliding-div/sliding-div.component';

@Injectable({
  providedIn: 'root'
})
export class InfoDivService {

  private dialogConfig = new MatDialogConfig();
  private slidingDiv!: SlidingDivComponent;
  public canBeClosed: boolean = false;

  public setSlidingDiv(sd: SlidingDivComponent) {
    this.slidingDiv = sd;
  }

  public openTab(toponym: string) {
    this.canBeClosed = false;
    if (this.sharedData.getRadioValue() == 1) {
      this.dialogConfig.data = toponym;
      if (this.matDialog.openDialogs.length == 0) {
        this.matDialog.open(DescriptionComponent, this.dialogConfig);
      }
    } else {
      this.slidingDiv.open(toponym);
    }
    setTimeout(() => {
      this.canBeClosed = true;
    }, 250);
  }

  public close() {
    this.slidingDiv.close();
    this.matDialog.closeAll();
  }

  constructor(
    private readonly sharedData: DataService,
    private readonly matDialog: MatDialog,
  ) {
    this.dialogConfig.height = "80vh";
    this.dialogConfig.width = "95vw";
    this.dialogConfig.maxWidth = "650px";
  }
}
