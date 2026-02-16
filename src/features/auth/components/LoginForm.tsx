import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/Button'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'
import { FormFieldError } from '../../../components/ui/FormFieldError'
import { Input } from '../../../components/ui/Input'
import { authApi } from '../api'
import { loginSchema, type LoginFormValues } from '../schemas'

function getSafeReturnTo(returnTo: string | null): string {
  if (!returnTo) {
    return '/app'
  }

  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
    return '/app'
  }

  return returnTo
}

export function LoginForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const returnTo = useMemo(() => getSafeReturnTo(searchParams.get('returnTo')), [searchParams])

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    clearErrors()

    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (typeof path === 'string') {
          setError(path as keyof LoginFormValues, { type: 'manual', message: issue.message })
        }
      }
      return
    }

    const { error } = await authApi.signInWithPassword(parsed.data)
    if (error) {
      const invalidCredentials =
        error.message.toLowerCase().includes('invalid login credentials') || error.status === 400
      setSubmitError(invalidCredentials ? 'Invalid email or password.' : error.message)
      return
    }

    navigate(returnTo, {
      replace: true,
      state: {
        toast: {
          variant: 'success',
          title: 'Signed in',
          description: 'Welcome back to your dashboard.',
        },
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-[color:var(--color-text)]">Email</span>
        <Input
          type="email"
          autoComplete="email"
          aria-invalid={errors.email?.message ? true : undefined}
          aria-describedby={errors.email?.message ? 'login-email-error' : undefined}
          {...register('email')}
        />
        <FormFieldError id="login-email-error" message={errors.email?.message} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-[color:var(--color-text)]">Password</span>
        <Input
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password?.message ? true : undefined}
          aria-describedby={errors.password?.message ? 'login-password-error' : undefined}
          {...register('password')}
        />
        <FormFieldError id="login-password-error" message={errors.password?.message} />
      </label>

      {submitError ? <ErrorBanner title="Login failed" message={submitError} /> : null}

      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="text-sm text-[color:var(--color-text-muted)]">
        Need an account?{' '}
        <Link
          to="/signup"
          className="text-[color:var(--color-primary)] hover:text-[color:var(--color-text)]"
        >
          Create account
        </Link>
      </p>
    </form>
  )
}
