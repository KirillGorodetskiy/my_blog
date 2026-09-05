import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from '@/app/register/page';

const register = vi.hoisted(() => vi.fn());
const reset = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      isAuthenticated: false,
      username: null,
      email: null,
      isStaff: false,
      isSuperuser: false,
    },
    ready: true,
    login: vi.fn(),
    register,
    logout: vi.fn(),
  }),
}));

vi.mock('@/components/auth/TurnstileWidget', () => ({
  TurnstileWidget: ({
    onToken,
    resetSignal = 0,
  }: {
    onToken: (token: string) => void;
    resetSignal?: number;
  }) => {
    if (resetSignal > 0) {
      reset(resetSignal);
    }

    return (
      <button
        type='button'
        onClick={() => onToken('fresh-token')}
      >
        Solve Turnstile
      </button>
    );
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    register.mockReset();
    reset.mockReset();
  });

  it('resets Turnstile after a failed registration', async () => {
    register.mockRejectedValue(new Error('weak password'));
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(
      screen.getByLabelText('Username'),
      'reader',
    );
    await user.type(
      screen.getByLabelText('Email'),
      'reader@example.com',
    );
    await user.type(
      screen.getByLabelText('Password'),
      'short',
    );
    await user.type(
      screen.getByLabelText('Confirm password'),
      'short',
    );
    await user.click(
      screen.getByRole('button', { name: 'Solve Turnstile' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Create account' }),
    );

    expect(register).toHaveBeenCalled();
    expect(reset).toHaveBeenCalled();
  });
});
