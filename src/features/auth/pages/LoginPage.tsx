import { Card } from '../../../components/ui/Card'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-gray-600">Sign in to continue to your dashboard.</p>
      <LoginForm />
    </Card>
  )
}
