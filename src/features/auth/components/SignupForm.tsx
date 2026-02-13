import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { Button } from '../../../components/ui/Button'
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

    navigate('/app', { replace: true })
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
        <Input type="password" autoComplete="new-password" {...register('password')} />
        {errors.password?.message ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">Confirm password</span>
        <Input type="password" autoComplete="new-password" {...register('confirmPassword')} />
        {errors.confirmPassword?.message ? (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        ) : null}
      </label>

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-700 hover:text-blue-800">
          Login
        </Link>
      </p>
    </form>
  )
}
