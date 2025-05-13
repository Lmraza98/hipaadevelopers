"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChecklistForm } from "@/hooks/use-checklist-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { type ChecklistFormData } from "@/lib/schemas/checklist-form"
import { toast } from "sonner"
import CtaBanner from '@/components/ui/cta-banner'

export default function ChecklistLandingPage() {
  const { form, isLoading } = useChecklistForm();

  async function onSubmit(data: ChecklistFormData) {
    const loadingToast = toast.loading('Processing your request...');
    try {
      // const listId = process.env.NEXT_PUBLIC_EMAIL_OCTOPUS_LIST_ID;
      // if (!listId) {
      //   toast.dismiss(loadingToast);
      //   toast.error('Configuration error: Email list ID is missing.');
      //   console.error('EmailOctopus List ID is not configured in environment variables.');
      //   return;
      // }

      // await emailOctopus.addContactToList(listId, {
      //   email_address: data.email,
      //   fields: {
      //     FirstName: data.name || undefined,
      //   },
      //   tags: ['HIPAA-Checklist-Download'] // Optional: Add any relevant tags
      // });

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success('Thank you! Check your email for the checklist.');
      form.reset();

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              HIPAA Compliance Checklist
            </h1>
            <p className="text-xl text-muted-foreground">
              Get your comprehensive guide to HIPAA compliance. Perfect for healthcare providers and software developers.
            </p>
          </div>
          
          {/* Form Card */}
          <div className="bg-card rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Download Your Free Guide</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Your Name (Optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Your Email Address" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Get Your Checklist"}
                </Button>
              </form>
            </Form>
            <p className="text-sm text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 space-y-12">
        <h2 className="text-3xl font-bold text-center">What&apos;s Inside the Guide?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold">Comprehensive Checklist</h3>
            <p className="text-muted-foreground">
              Step-by-step guide covering all HIPAA requirements.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold">Security Guidelines</h3>
            <p className="text-muted-foreground">
              Detailed security measures and best practices.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold">Implementation Tips</h3>
            <p className="text-muted-foreground">
              Practical advice for successful compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16 space-y-8">
        <h2 className="text-3xl font-bold text-center">Trusted by Healthcare Professionals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Testimonial placeholders */}
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="italic">&ldquo;This checklist made our HIPAA compliance process so much easier.&rdquo;</p>
            <p className="mt-4 font-semibold">- Healthcare Provider</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="italic">&ldquo;A must-have resource for any healthcare software developer.&rdquo;</p>
            <p className="mt-4 font-semibold">- Software Engineer</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="italic">&ldquo;Clear, concise, and comprehensive. Exactly what we needed.&rdquo;</p>
            <p className="mt-4 font-semibold">- Compliance Officer</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAQ Items */}
          <div className="space-y-2">
            <h3 className="font-semibold">Is this checklist up to date?</h3>
            <p className="text-muted-foreground">Yes, our checklist is regularly updated to reflect the latest HIPAA requirements and guidelines.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Who is this checklist for?</h3>
            <p className="text-muted-foreground">Healthcare providers, software developers, and any organization handling protected health information (PHI).</p>
          </div>
        </div>
      </section>

      {/* Add CtaBanner here */}
      <CtaBanner
        title="Need Expert HIPAA Solutions?"
        bodyText="Go beyond the checklist. Our experts at hipaadevelopment.com can help you build and maintain fully compliant healthcare applications."
        buttonText="Get Custom Solutions"
        buttonLink="https://hipaadevelopment.com"
        className="my-16" // Added margin for spacing
      />

    </div>
  )
} 