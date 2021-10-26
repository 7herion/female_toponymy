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

  /**
   * Sets the slidingDivComponent to show the information.
   * 
   * @param sd SlidingDivComponent in the DOM
   */
  public setSlidingDiv(sd: SlidingDivComponent): void {
    this.slidingDiv = sd;
  }

  /**
   * Opens the information div about the toponym.
   * Based on the value of the sharedData DataService,
   * the information will be displayed in a matDialog or in a slidingDiv.
   * 
   * @param toponym string containing the toponym
   */
  public openTab(toponym: string): void {
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

  /**
   * Closes all opened MatDialog or SlidingDiv
   */
  public close(): void {
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
