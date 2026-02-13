import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/Button'
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

    navigate(returnTo, { replace: true })
  })

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <Input type="email" autoComplete="email" {...register('email')} />
        {errors.email?.message ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">Password</span>
        <Input type="password" autoComplete="current-password" {...register('password')} />
        {errors.password?.message ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </label>

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Login'}
      </Button>

      <p className="text-sm text-gray-600">
        Need an account?{' '}
        <Link to="/signup" className="text-blue-700 hover:text-blue-800">
          Sign up
        </Link>
      </p>
    </form>
  )
}
