import {render} from '@testing-library/svelte';
import {expect} from 'chai';
import App from './App2.svelte';

describe('<App>', () => {
  it('renders learn svelte link', () => {
    const {getByText} = render(App);
    const linkElement = getByText(/learn svelte/i);
    expect(document.body.contains(linkElement));
  });
});
