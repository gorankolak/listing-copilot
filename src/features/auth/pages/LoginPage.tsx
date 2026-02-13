import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to continue to your dashboard.</CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  )
}
