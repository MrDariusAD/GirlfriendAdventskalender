import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { StartPage } from "./start.page";

import { StartPageRoutingModule } from "./start-routing.module";
import { DoorContentComponent } from "./components/door-content/door-content.component";
import { DoorContentService } from "src/app/services/door-content.service";
import { IonCustomScrollbarModule } from "ion-custom-scrollbar";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DateInterceptor } from 'src/app/interceptors/date.interceptor';

@NgModule({
  declarations: [StartPage, DoorContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
    IonCustomScrollbarModule,
    HttpClientModule,
  ],
  providers: [
    DoorContentService,
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateInterceptor,
      multi: true,
    },
  ],
})
export class StartPageModule {}
