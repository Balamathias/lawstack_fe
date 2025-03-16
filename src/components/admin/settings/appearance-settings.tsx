"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Save, Upload, Trash2, Moon, Sun, Monitor, Paintbrush, Image } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label'

// Define schema for appearance settings
const appearanceSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  default_theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme",
  }),
  primary_color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
  enable_dark_mode: z.boolean().default(true),
  enable_high_contrast: z.boolean().default(false),
  custom_css: z.string().optional(),
  custom_font: z.string().optional(),
})

type AppearanceValues = z.infer<typeof appearanceSchema>

const AppearanceSettings = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  
  // Initialize the form
  const form = useForm<AppearanceValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      site_name: "LegalX",
      default_theme: "system",
      primary_color: "#0066FF",
      enable_dark_mode: true,
      enable_high_contrast: false,
      custom_css: "",
      custom_font: "",
    },
  })
  
  // Handle form submission
  const onSubmit = (values: AppearanceValues) => {
    setIsSaving(true)
    
    // Create FormData to handle file uploads
    const formData = new FormData()
    
    // Add form values
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    // Add files if they exist
    if (logoFile) {
      formData.append('logo', logoFile)
    }
    
    if (faviconFile) {
      formData.append('favicon', faviconFile)
    }
    
    // Simulate API call
    setTimeout(() => {
      console.log("Appearance Settings:", values)
      console.log("Logo:", logoFile)
      console.log("Favicon:", faviconFile)
      
      toast.success("Appearance settings saved successfully")
      setIsSaving(false)
    }, 1500)
  }
  
  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle favicon upload
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFaviconFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setFaviconPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Clear logo
  const clearLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }
  
  // Clear favicon
  const clearFavicon = () => {
    setFaviconFile(null)
    setFaviconPreview(null)
  }
  
  // Color themes for demonstration
  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Appearance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-primary" />
                Basic Appearance
              </CardTitle>
              <CardDescription>
                Configure the general appearance of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="site_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed in the browser title bar and throughout the application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default_theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Theme</FormLabel>
                    <div className="pt-2">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        {themes.map(({ value, label, icon: Icon }) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={value} />
                            <Label htmlFor={value} className="flex items-center cursor-pointer">
                              <Icon className="h-4 w-4 mr-2" />
                              {label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: field.value }}
                      />
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormControl>
                        <Input 
                          type="color" 
                          {...field}
                          className="w-10 h-10 p-1 cursor-pointer"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Enter a color in HEX format (e.g., #0066FF)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="enable_dark_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Dark Mode Option
                        </FormLabel>
                        <FormDescription>
                          Allow users to switch to dark mode
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

                <FormField
                  control={form.control}
                  name="enable_high_contrast"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          High Contrast
                        </FormLabel>
                        <FormDescription>
                          Enable high contrast mode for accessibility
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
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Branding & Images
              </CardTitle>
              <CardDescription>
                Upload your logo and favicon for the site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <FormLabel>Logo</FormLabel>
                <div className="border rounded-md p-4 space-y-3">
                  {logoPreview && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md inline-block">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-h-16 max-w-full object-contain" 
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button" 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    {logoPreview && (
                      <Button
                        type="button" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={clearLogo}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 200x60 pixels. Max file size: 2MB. Supported formats: PNG, JPG, SVG.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <FormLabel>Favicon</FormLabel>
                <div className="border rounded-md p-4 space-y-3">
                  {faviconPreview && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md inline-block">
                        <img 
                          src={faviconPreview} 
                          alt="Favicon preview" 
                          className="h-8 w-8 object-contain" 
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button" 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('favicon-upload')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                    </Button>
                    {faviconPreview && (
                      <Button
                        type="button" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={clearFavicon}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    <input
                      id="favicon-upload"
                      type="file"
                      accept="image/png,image/x-icon,image/ico"
                      className="hidden"
                      onChange={handleFaviconChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 32x32 or 64x64 pixels. Supported formats: ICO, PNG.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-primary" />
                Advanced Customization
              </CardTitle>
              <CardDescription>
                Custom CSS and font settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="custom_font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Font</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">System Default</SelectItem>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="open-sans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The main font used throughout the application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custom_css"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom CSS</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder=":root { --custom-color: #ff0000; }"
                        className="font-mono min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add custom CSS styles to override the default theme
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Theme Preview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
              <CardDescription>
                See how your current settings look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 flex flex-col space-y-4">
                <div className="flex gap-2 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: form.watch('primary_color') }}
                  ></div>
                  <p className="text-sm">Primary Color: {form.watch('primary_color')}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Switch checked={true} />
                  <p>Toggle switch</p>
                </div>

                <div className="p-3 bg-primary/10 text-primary rounded border border-primary/20 mt-2">
                  This is a sample alert with your primary color
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardFooter className="flex justify-between p-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset to Defaults
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default AppearanceSettings
