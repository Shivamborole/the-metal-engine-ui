import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './AuthGaurds/jwt-interceptor';
import { tokenInterceptor } from './AuthGaurds/tokeninterceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
       withInterceptors([jwtInterceptor])
      // provideHttpClient(),
    )
  ]
};

