// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({ usePathname: () => '/products' }));

import { Nav } from '@/components/shell/Nav';
import { DemoBadge } from '@/components/shell/DemoBadge';
import { SoundToggle } from '@/components/shell/SoundToggle';
import { Footer } from '@/components/shell/Footer';

afterEach(cleanup);

describe('Nav', () => {
  it('shows the four main links and the Book a visit button', () => {
    render(<Nav />);
    const main = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Products', 'Services', 'About', 'Contact']) {
      expect(within(main).getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(within(main).getByRole('link', { name: 'Book a visit' })).toHaveAttribute('href', '/contact#book');
  });
  it('marks the current page', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  });
  it('opens the mobile menu and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('SoundToggle', () => {
  it('starts off and turns on when clicked', async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);
    const btn = screen.getByRole('button', { name: /sound off/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await user.click(btn);
    expect(await screen.findByRole('button', { name: /sound on/i })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('DemoBadge and Footer', () => {
  it('always says this is a concept demo by BSX Agency', () => {
    render(<DemoBadge />);
    expect(screen.getByText('Concept demo · BSX Agency')).toBeInTheDocument();
  });
  it('credits BSX Agency in the footer', () => {
    render(<Footer />);
    expect(screen.getByText('Designed & built by BSX Agency')).toBeInTheDocument();
  });
});
