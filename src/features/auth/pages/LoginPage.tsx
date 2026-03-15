import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <Card className="relative w-full overflow-hidden p-7 md:p-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[image:var(--gradient-primary)]" />
      <CardHeader className="relative">
        <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
          Welcome back
        </p>
        <CardTitle className="mt-4 text-[1.9rem] md:text-[2.15rem]">Sign in to your workspace</CardTitle>
        <CardDescription className="max-w-sm">
          Generate, polish, and save marketplace listings from one structured utility app.
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  )
}
