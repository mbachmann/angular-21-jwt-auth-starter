import { InjectionToken } from '@angular/core';

export const API_BASE_URL: InjectionToken<string> = new InjectionToken<string>('basePath');

export default API_BASE_URL;

