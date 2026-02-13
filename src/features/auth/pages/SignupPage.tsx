import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { SignupForm } from '../components/SignupForm'

export function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your account to access the app.</CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  )
}
