import { Brain, CreditCard, BarChart3, TabletsIcon as Devices, Facebook, Twitter, Linkedin, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { FeatureCard } from "@/components/feature-card"
import { StepCard } from "@/components/step-card"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { InteractiveSection } from "@/components/landing/interactive-section"

export default async function LandingPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Woretto
            </h1>
            <div className="space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="default">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Effortless Expense Tracking with Woretto
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Harness AI to Plan, Track, and Save Smartly
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Woretto uses cutting-edge AI to make managing your finances easy and efficient. Stay in control of your budget with zero hassle.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            {user ? (
              <Link href="/dashboard">
                <GradientButton className="text-lg w-full md:w-auto">
                  Go to Dashboard
                </GradientButton>
              </Link>
            ) : (
              <Link href="/sign-up">
                <GradientButton className="text-lg w-full md:w-auto">
                  Start Tracking for Free
                </GradientButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-950/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Insights"
              description="Understand your spending patterns and get actionable insights instantly."
            />
            <FeatureCard
              icon={CreditCard}
              title="Seamless Integration"
              description="Connect your bank accounts and cards securely for real-time tracking."
            />
            <FeatureCard
              icon={BarChart3}
              title="Personalized Budgeting"
              description="AI-driven recommendations tailored to your financial goals."
            />
            <FeatureCard
              icon={Devices}
              title="Multi-Device Access"
              description="Access Woretto on web, mobile, and tablet for ultimate flexibility."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number={1}
              title="Sign Up in Seconds"
              description="Create your account and connect securely."
            />
            <StepCard
              number={2}
              title="Let AI Do the Work"
              description="Get instant categorization and tracking of all your expenses."
            />
            <StepCard
              number={3}
              title="Achieve Your Goals"
              description="Use smart insights and plans to stay on track and save more."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-slate-950/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            What Our Users Say
          </h2>
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-xl italic text-slate-300 mb-4">
              "Woretto changed the way I look at my finances. It's like having a personal financial advisor!"
            </p>
            <footer className="text-slate-400">
              — Early Adopter
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
              <p className="text-slate-400 mb-6">Basic features to get started</p>
              <InteractiveSection type="free-plan" />
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
              <p className="text-slate-400 mb-6">Advanced features for power users</p>
              <InteractiveSection type="premium-plan" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-950/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Sign up today and experience the Woretto difference.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            {user ? (
              <Link href="/dashboard">
                <GradientButton className="text-lg w-full md:w-auto">
                  Go to Dashboard
                </GradientButton>
              </Link>
            ) : (
              <Link href="/sign-up">
                <GradientButton className="text-lg w-full md:w-auto">
                  Start Tracking for Free
                </GradientButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <InteractiveSection type="footer-links" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Woretto</h3>
              <p className="text-slate-400">
                Your AI-powered financial companion
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-slate-400">
                Have questions? Reach us at<br />
                <a href="mailto:support@woretto.com" className="text-purple-500 hover:text-purple-400">
                  support@woretto.com
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Social</h4>
              <InteractiveSection type="social-links" />
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Woretto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
