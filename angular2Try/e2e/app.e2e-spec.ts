import { Angular2TryPage } from './app.po';

describe('angular2-try App', function() {
  let page: Angular2TryPage;

  beforeEach(() => {
    page = new Angular2TryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
