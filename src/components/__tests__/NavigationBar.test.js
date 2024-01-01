import { render, screen } from '@testing-library/react';
import NavigationBar from '../NavigationBar';

test('renders without crashing', () => {
  render(<NavigationBar/>);
  const linkElement = screen.getByText('Home')
  expect(linkElement).toBeInTheDocument();
});