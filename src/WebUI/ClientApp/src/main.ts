import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes, withViewTransitions } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app/app.component';
import { HomePage } from './app/pages/home-page/home.page';
import { TodoPage } from './app/pages/todo-page/todo.page';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'todo', component: TodoPage },
];

const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAnimations(),
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
    importProvidersFrom([ModalModule.forRoot()])
  ],

};

bootstrapApplication(
  AppComponent,
  appConfig
).catch(
  (err) => console.error(err)
);
