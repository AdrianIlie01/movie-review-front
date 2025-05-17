import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RoomRoutingModule} from './room-routing.module';
import {ChatComponent} from './components/chat/chat.component';
import {RoomFormComponent} from './components/room-form/room-form.component';
import {VideoComponent} from './components/video/video.component';
import {AddRoomPageComponent} from './pages/add-room-page/add-room-page.component';
import {ListRoomPageComponent} from './pages/list-room-page/list-room-page.component';
import {RoomPageComponent} from './pages/room-page/room-page.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ChatComponent,
    RoomFormComponent,
    VideoComponent,
    AddRoomPageComponent,
    ListRoomPageComponent,
    RoomPageComponent
  ],
    imports: [
        CommonModule,
        RoomRoutingModule,
        FormsModule
    ]
})
export class RoomModule { }
