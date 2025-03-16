"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Save, Play, Mail, Lock, Server, AlertTriangle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const emailSettingsSchema = z.object({
  smtp_host: z.string().min(1, "SMTP host is required"),
  smtp_port: z.coerce.number().int().min(1, "Port must be a positive number"),
  smtp_username: z.string().min(1, "Username is required"),
  smtp_password: z.string().min(1, "Password is required"),
  smtp_secure: z.boolean().default(true),
  from_email: z.string().email("Please enter a valid email address"),
  from_name: z.string().min(1, "From name is required"),
  reply_to: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  throttle_rate: z.coerce.number().int().min(0, "Must be a positive number or zero"),
  max_per_minute: z.coerce.number().int().min(1, "Must be at least 1"),
})

const emailTemplateSchema = z.object({
  welcome_subject: z.string().min(1, "Subject is required"),
  welcome_body: z.string().min(10, "Email body must be at least 10 characters"),
  password_reset_subject: z.string().min(1, "Subject is required"),
  password_reset_body: z.string().min(10, "Email body must be at least 10 characters"),
  verification_subject: z.string().min(1, "Subject is required"),
  verification_body: z.string().min(10, "Email body must be at least 10 characters"),
})

type EmailSettingsValues = z.infer<typeof emailSettingsSchema>
type EmailTemplateValues = z.infer<typeof emailTemplateSchema>

const EmailSettings = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "success" | "error">("idle")
  
  // SMTP Form
  const smtpForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtp_host: "smtp.example.com",
      smtp_port: 587,
      smtp_username: "username@example.com",
      smtp_password: "",
      smtp_secure: true,
      from_email: "no-reply@example.com",
      from_name: "LegalX App",
      reply_to: "",
      throttle_rate: 0,
      max_per_minute: 60,
    },
  })
  
  // Templates Form
  const templatesForm = useForm<EmailTemplateValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      welcome_subject: "Welcome to LegalX",
      welcome_body: "Hello {{name}},\n\nWelcome to LegalX! We're excited to have you on board.\n\nBest regards,\nThe LegalX Team",
      password_reset_subject: "Reset Your Password",
      password_reset_body: "Hello {{name}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nBest regards,\nThe LegalX Team",
      verification_subject: "Verify Your Email",
      verification_body: "Hello {{name}},\n\nClick the link below to verify your email address:\n{{verification_link}}\n\nBest regards,\nThe LegalX Team",
    },
  })
  
  // Handle SMTP Form Submission
  const onSaveSettings = (values: EmailSettingsValues) => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("SMTP Settings:", values)
      toast.success("Email settings saved successfully")
      setIsSaving(false)
    }, 1500)
  }
  
  // Handle Templates Form Submission
  const onSaveTemplates = (values: EmailTemplateValues) => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Email Templates:", values)
      toast.success("Email templates saved successfully")
      setIsSaving(false)
    }, 1500)
  }
  
  // Handle Test Email
  const handleTestEmail = () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }
    
    setIsTesting(true)
    setTestEmailStatus("idle")
    
    // Simulate sending a test email
    setTimeout(() => {
      console.log("Sending test email to:", testEmailAddress)
      setIsTesting(false)
      setTestEmailStatus("success")
      toast.success(`Test email sent to ${testEmailAddress}`)
    }, 2000)
  }
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList>
          <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="test">Test Email</TabsTrigger>
        </TabsList>
        
        {/* SMTP Configuration Tab */}
        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                SMTP Settings
              </CardTitle>
              <CardDescription>
                Configure your email server settings for sending emails from the application
              </CardDescription>
            </CardHeader>
            <Form {...smtpForm}>
              <form onSubmit={smtpForm.handleSubmit(onSaveSettings)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={smtpForm.control}
                      name="smtp_host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smtpForm.control}
                      name="smtp_port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={smtpForm.control}
                      name="smtp_username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smtpForm.control}
                      name="smtp_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={smtpForm.control}
                    name="smtp_secure"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Use Secure Connection (TLS)
                          </FormLabel>
                          <FormDescription>
                            Enable TLS encryption for SMTP connection
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <FormField
                      control={smtpForm.control}
                      name="from_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            From Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="no-reply@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smtpForm.control}
                      name="from_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input placeholder="LegalX App" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={smtpForm.control}
                    name="reply_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reply-To Email (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="support@example.com" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <FormField
                      control={smtpForm.control}
                      name="throttle_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Throttle Rate (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Delay between emails in seconds (0 for no delay)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={smtpForm.control}
                      name="max_per_minute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Emails Per Minute</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-5">
                  <Button
                    type="submit"
                    className="ml-auto"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        {/* Email Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize the email templates sent to users
              </CardDescription>
            </CardHeader>
            <Form {...templatesForm}>
              <form onSubmit={templatesForm.handleSubmit(onSaveTemplates)}>
                <CardContent className="space-y-8">
                  {/* Welcome Email Template */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Welcome Email</h3>
                    <FormField
                      control={templatesForm.control}
                      name="welcome_subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Line</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={templatesForm.control}
                      name="welcome_body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={5} 
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Available variables: <code>{"{{name}}"}</code>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <hr />
                  
                  {/* Password Reset Template */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password Reset Email</h3>
                    <FormField
                      control={templatesForm.control}
                      name="password_reset_subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Line</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={templatesForm.control}
                      name="password_reset_body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={5} 
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Available variables: <code>{"{{name}}"}</code>, <code>{"{{reset_link}}"}</code>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <hr />
                  
                  {/* Verification Email Template */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Verification</h3>
                    <FormField
                      control={templatesForm.control}
                      name="verification_subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Line</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={templatesForm.control}
                      name="verification_body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={5} 
                              className="font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Available variables: <code>{"{{name}}"}</code>, <code>{"{{verification_link}}"}</code>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-5">
                  <Button
                    type="submit"
                    className="ml-auto"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Templates
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        {/* Test Email Tab */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Test Email Sending
              </CardTitle>
              <CardDescription>
                Send a test email to verify your email configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testEmailStatus === "success" && (
                <Alert className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Test Email Sent Successfully</AlertTitle>
                  <AlertDescription>
                    An email has been sent to {testEmailAddress}. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}
              
              {testEmailStatus === "error" && (
                <Alert className="bg-destructive/20 text-destructive border-destructive/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Failed to send email</AlertTitle>
                  <AlertDescription>
                    There was an error sending the test email. Please check your SMTP settings and try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormLabel htmlFor="test-email">Recipient Email</FormLabel>
                  <Input 
                    id="test-email"
                    type="email" 
                    placeholder="Enter email address" 
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="self-end">
                  <Button 
                    type="button" 
                    onClick={handleTestEmail}
                    disabled={isTesting || !testEmailAddress}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-6">
                <p>The test email will use your current SMTP settings and the welcome email template.</p>
                <p className="mt-2">
                  If you haven&apos;t saved your settings yet, the test will use the default configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmailSettings
