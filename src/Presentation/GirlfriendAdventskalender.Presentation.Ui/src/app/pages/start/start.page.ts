import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import { DoorContentComponent } from "./components/door-content/door-content.component";
import { environment } from "src/environments/environment";
import { DoorContentService } from "src/app/services/door-content.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-start",
  templateUrl: "start.page.html",
})
export class StartPage implements OnInit {
  public snowflakeCount = 50;
  public adminMode = false;

  public unlockDates: object = {};

  public now = new Date();
  private unsubscribe = new Subject();

  constructor(
    public modalController: ModalController,
    public platform: Platform,
    private doorContentService: DoorContentService,
    private cdRef: ChangeDetectorRef
  ) {}

  public isLoading = true;

  ngOnInit(): void {
    const isLowSpec =
      this.platform.is("android") ||
      this.platform.is("ios") ||
      this.platform.is("ipad") ||
      this.platform.is("iphone") ||
      this.platform.is("mobile") ||
      this.platform.is("mobileweb");
    this.snowflakeCount = isLowSpec ? 60 : 150;
    this.adminMode = environment.adminMode;
    this.doorContentService
      .getUnlockDates()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((x) => {
        x.forEach((doorContent) => {
          this.unlockDates[doorContent.id] = doorContent.unlocksAt;
        });
        this.isLoading = false;
        this.cdRef.detectChanges();
      });
    this.refreshLockStates();
  }

  public counter(i: number): Array<number> {
    return new Array(i);
  }

  public async openDoor(doorNumber: string) {
    if (this.unlockDates[doorNumber] > this.now && !this.adminMode) {
      return;
    }
    const modal = await this.modalController.create({
      component: DoorContentComponent,
      swipeToClose: true,
      componentProps: {
        doorNumber: doorNumber,
        editMode: this.adminMode,
      },
      cssClass: "border-fucking-radius",
    });
    return await modal.present();
  }

  private refreshLockStates() {
    console.log('Running update');
    this.now = new Date();
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.refreshLockStates();
    }, 1000);
  }
}
