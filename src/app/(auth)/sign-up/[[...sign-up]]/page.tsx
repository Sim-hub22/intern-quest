import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function Page() {
  return (
    <SignUp />
  )
}