import { Card } from '../../../components/ui/Card'
import { SignupForm } from '../components/SignupForm'

export function SignupPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold">Sign up</h1>
      <p className="mt-2 text-sm text-gray-600">Create your account to access the app.</p>
      <SignupForm />
    </Card>
  )
}
