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
import { SurveyPageComponent } from './pages/survey-page/survey-page.component';
import { EventWishlistPageComponent } from './pages/event-wishlist-page/event-wishlist-page.component';
import { EventToDoListPageComponent } from './pages/event-to-do-list-page/event-to-do-list-page.component';
import { GuestTablePageComponent } from './pages/guest-table-page/guest-table-page.component';
import { QrEventPageComponent } from './pages/qr-event-page/qr-event-page.component';
import { QrSurveyPageComponent } from './pages/qr-survey-page/qr-survey-page.component';


export const routes: Routes = [
    { 
        path: '', 
        component: MainLayoutComponent, 
        children: [
            { path: '', component: LandingPageComponent },
            { path: 'calendar', component: CalendarPageComponent },
            { path: 'contact', component: ContactPageComponent },
            { path: 'imprint', component: ImprintPageComponent },
            { path: 'eventedit/:id', component: EventEditPageComponent },
            { path: 'addevent', component: AddEventPageComponent },
            { path: 'event', component: EventPageComponent },
            { path: 'survey/:id', component: SurveyPageComponent }, // Changed to accept an ID parameter
            { path: 'survey', component: SurveyPageComponent }, // Keep this for backward compatibility
            { path: 'wishlist', component: EventWishlistPageComponent },
            { path: 'to-do-list/:id', component: EventToDoListPageComponent },
            { path: 'guesttable/:id', component: GuestTablePageComponent },
            { path: 'event/:id', component: EventPageComponent }
        ] 
    },
    { path: 'login', component: LoginPageComponent },
    { path: 'qr/event/:id', component: QrEventPageComponent },
    { path: 'EventPlannerFrontend/event/:id', component: QrEventPageComponent },
    { path: 'qrSurvey', component: QrSurveyPageComponent },
    { path: '**', redirectTo: '' }
];
