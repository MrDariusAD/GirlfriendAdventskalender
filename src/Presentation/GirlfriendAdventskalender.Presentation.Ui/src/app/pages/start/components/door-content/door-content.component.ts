import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { DoorContentService } from "src/app/services/door-content.service";
import { DoorContent } from "src/app/models/door-content.model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  templateUrl: "./door-content.component.html",
})
export class DoorContentComponent implements OnInit, OnDestroy {
  @Input() doorNumber: string;
  @Input() editMode = false;

  public doorContent: DoorContent;
  public isLoading = true;

  public creationImageUrl: string = "";
  public creationText: string = "";
  public creationUnlocksAt: string = new Date().toString();

  private unsubscribe = new Subject();

  constructor(
    public modalController: ModalController,
    private doorContentService: DoorContentService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.doorContentService
      .getDoorContent(this.doorNumber)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.doorContent = response;
        this.isLoading = false;
        if (this.editMode && response) {
          this.creationImageUrl = response?.imageUrl;
          this.creationText = response?.text;
        }
        const thisYear = new Date().getFullYear();
        this.creationUnlocksAt = response?.unlocksAt
          ? response.unlocksAt.toISOString()
          : new Date(thisYear - 1, 12, +this.doorNumber).toISOString();
      });
  }

  public save(closeAfterSave: boolean) {
    this.isLoading = true;
    if (this.doorContent) {
      this.doorContentService
        .editDoorContent({
          id: this.doorNumber,
          imageUrl: this.creationImageUrl,
          text: this.creationText,
          unlocksAt: new Date(this.creationUnlocksAt),
        })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.creationImageUrl = response?.imageUrl;
          this.creationText = response?.text;
          this.isLoading = false;
          this.showToast("DoorContent saved!");
          if (closeAfterSave) {
            this.closeModal();
          }
        });
    } else {
      this.doorContentService
        .createDoorContent({
          id: this.doorNumber,
          imageUrl: this.creationImageUrl,
          text: this.creationText,
          unlocksAt: new Date(this.creationUnlocksAt),
        })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.doorContent = response;
          this.creationImageUrl = response?.imageUrl;
          this.creationText = response?.text;
          this.isLoading = false;
          this.showToast("DoorContent saved!");
          if (closeAfterSave) {
            this.closeModal();
          }
        });
    }
  }

  public async showToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
    });
    toast.present();
  }

  public closeModal(): void {
    this.modalController.dismiss();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
