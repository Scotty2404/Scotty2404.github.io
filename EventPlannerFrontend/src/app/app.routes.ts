import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ImprintPageComponent } from './pages/imprint-page/imprint-page.component';
import { EventEditPageComponent } from './pages/event-edit-page/event-edit-page.component';
import { AddEventPageComponent } from './pages/add-event-page/add-event-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { GuestTablePageComponent } from './pages/guest-table-page/guest-table-page.component';
import { QrEventPageComponent } from './pages/qr-event-page/qr-event-page.component';

export const routes: Routes = [
    { 
        path: '', 
        component: MainLayoutComponent, 
        children: [
            { path: '', component: LandingPageComponent },
            { path: 'calendar', component: CalendarPageComponent },
            { path: 'contact', component: ContactPageComponent },
            { path: 'imprint', component: ImprintPageComponent },
            { path: 'eventedit', component: EventEditPageComponent },
            { path: 'addevent', component: AddEventPageComponent },
            { path: 'guesttable', component: GuestTablePageComponent },
            { path: 'event/:id', component: EventPageComponent }
        ] 

        
    },
    { path: 'login', component: LoginPageComponent },
    { path: 'qr', component: QrEventPageComponent },
    { path: '**', redirectTo: '' }
];