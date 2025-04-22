import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Settings } from "@/types/invoice"
import { useSettings } from "@/hooks/useSettings"
import toast from "react-hot-toast"

const settingsSchema = z.object({
  companyInfo: z.object({
    name: z.string().min(1, "Company name is required"),
    description: z.string().default(""),
    location: z.string().min(1, "Location is required"),
    contact: z.string().refine(
      (val) => /^\+?\d{10,15}(-\d{3,4})?$/.test(val),
      { message: "Invalid phone number (e.g., +1234567890 or 123-456-7890)" }
    ),
    website: z.string().default(""),
  }),
  defaultGauge: z.string().min(1, "Default gauge is required"),
  defaultTaxRates: z.object({
    nihil: z.number().min(0, "Tax rate cannot be negative"),
    getFund: z.number().min(0, "Tax rate cannot be negative"),
    covid: z.number().min(0, "Tax rate cannot be negative"),
    vat: z.number().min(0, "Tax rate cannot be negative"),
  }),
})

type SettingsFormData = z.infer<typeof settingsSchema>

interface SettingsSectionProps {
  initialSettings: Settings
}

export function SettingsSection({ initialSettings }: SettingsSectionProps) {
  const { settings, updateSettings } = useSettings(initialSettings)

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  const onSubmit = (data: SettingsFormData) => {
    updateSettings(data)
    toast.success("Settings saved successfully")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Invoice Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium">Company Information</h3>
              <FormField
                control={form.control}
                name="companyInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyInfo.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyInfo.contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyInfo.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter website URL" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-md font-medium">Default Settings</h3>
              <FormField
                control={form.control}
                name="defaultGauge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Gauge</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter default gauge" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="defaultTaxRates.nihil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIHIL Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultTaxRates.getFund"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GETFund Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultTaxRates.covid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>COVID-19 Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultTaxRates.vat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}