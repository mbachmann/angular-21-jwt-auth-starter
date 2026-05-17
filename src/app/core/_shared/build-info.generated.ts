export interface BuildInfo {
  app: {
    name: string;
    version: string;
  };
  features: {
    standalone: boolean;
    zoneless: boolean;
    flowSyntax: boolean;
    signals: boolean;
    formsTemplate: boolean;
    formsReactive: boolean;
  };
  buildTime: string;
  dependencies: Record<string, string>;
}

export const BUILD_INFO: BuildInfo = {
  "app": {
    "name": "angular-21-jwt-auth",
    "version": "0.0.0"
  },
  "features": {
    "standalone": true,
    "zoneless": true,
    "flowSyntax": true,
    "signals": true,
    "formsTemplate": true,
    "formsReactive": false
  },
  "buildTime": "2026-05-17T10:34:16.788Z",
  "dependencies": {
    "@angular/build": "^21.2.11",
    "@angular/cli": "^21.2.11",
    "@angular/compiler-cli": "^21.2.13",
    "angular-eslint": "21.4.0",
    "vitest": "^4.1.6",
    "jsdom": "^29.1.1",
    "@fortawesome/fontawesome-free": "6.7.2",
    "bootstrap": "^5.3.7",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  }
};
