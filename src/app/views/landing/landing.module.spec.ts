// import { LandingModule } from './landing.module';

import { LandingModule } from "src/views/landing/landing.module";

describe('LandingModule', () => {
  let landingModule: LandingModule;

  beforeEach(() => {
    landingModule = new LandingModule();
  });

  it('should create an instance', () => {
    expect(landingModule).toBeTruthy();
  });
});
