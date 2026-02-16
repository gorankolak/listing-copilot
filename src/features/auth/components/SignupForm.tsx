import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/Button'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'
import { FormFieldError } from '../../../components/ui/FormFieldError'
import { Input } from '../../../components/ui/Input'
import { authApi } from '../api'
import { signupSchema, type SignupFormValues } from '../schemas'

export function SignupForm() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    clearErrors()

    const parsed = signupSchema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (typeof path === 'string') {
          setError(path as keyof SignupFormValues, { type: 'manual', message: issue.message })
        }
      }
      return
    }

    const { error } = await authApi.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      setSubmitError(error.message)
      return
    }

    navigate('/app', {
      replace: true,
      state: {
        toast: {
          variant: 'success',
          title: 'Account created',
          description: 'You are now signed in.',
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
          aria-describedby={errors.email?.message ? 'signup-email-error' : undefined}
          {...register('email')}
        />
        <FormFieldError id="signup-email-error" message={errors.email?.message} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-[color:var(--color-text)]">Password</span>
        <Input
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password?.message ? true : undefined}
          aria-describedby={errors.password?.message ? 'signup-password-error' : undefined}
          {...register('password')}
        />
        <FormFieldError id="signup-password-error" message={errors.password?.message} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-[color:var(--color-text)]">Confirm password</span>
        <Input
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword?.message ? true : undefined}
          aria-describedby={errors.confirmPassword?.message ? 'signup-confirm-password-error' : undefined}
          {...register('confirmPassword')}
        />
        <FormFieldError
          id="signup-confirm-password-error"
          message={errors.confirmPassword?.message}
        />
      </label>

      {submitError ? <ErrorBanner title="Signup failed" message={submitError} /> : null}

      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-sm text-[color:var(--color-text-muted)]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-[color:var(--color-primary)] hover:text-[color:var(--color-text)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
