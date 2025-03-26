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
            { path: 'event/:id', component: EventPageComponent }

        ] 

        
    },
    { path: 'login', component: LoginPageComponent },
    { path: '**', redirectTo: '' }
];