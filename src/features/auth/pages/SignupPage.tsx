import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { SignupForm } from '../components/SignupForm'

export function SignupPage() {
  return (
    <Card className="relative w-full overflow-hidden p-7 md:p-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[image:var(--gradient-primary)]" />
      <CardHeader className="relative">
        <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
          Start free
        </p>
        <CardTitle className="mt-4 text-3xl md:text-[2rem]">Create your ListingCopilot account</CardTitle>
        <CardDescription className="max-w-sm">
          Set up a focused workspace for turning rough product input into polished listing output.
        </CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  )
}
