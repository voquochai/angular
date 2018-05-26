import { Aj4Page } from './app.po';

describe('aj4 App', () => {
  let page: Aj4Page;

  beforeEach(() => {
    page = new Aj4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Chào mừng Angular 4!!');
  });
});
