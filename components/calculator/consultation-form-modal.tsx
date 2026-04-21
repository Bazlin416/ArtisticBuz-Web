"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Mail, Upload, X } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),

  hairLossDuration: z.string().optional(),
  familyHistory: z.string().optional(),
  previousTreatments: z.array(z.string()).optional(),
  medicalConditions: z.string().optional(),

  hairType: z.string().optional(),
  scalpCondition: z.string().optional(),
  desiredDensity: z.string().optional(),
  preferredClinicLocation: z.string().optional(),

  preferredContact: z.string().optional(),
  bestTimeToContact: z.string().optional(),
  additionalNotes: z.string().optional(),

  termsAccepted: z
    .boolean()
    .refine((v) => v === true, "You must confirm the information is accurate"),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string;
  estimatedGrafts: string;
  estimatedPrice?: string;
  userEmail?: string;
}

export function ConsultationFormModal({
  isOpen,
  onClose,
  selectedType,
  estimatedGrafts,
  estimatedPrice,
  userEmail,
}: ConsultationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: userEmail ?? "",
      phone: "",
      country: "",
      dateOfBirth: "",
      hairLossDuration: "",
      familyHistory: "",
      previousTreatments: [],
      medicalConditions: "",
      hairType: "",
      scalpCondition: "",
      desiredDensity: "",
      preferredClinicLocation: "",
      preferredContact: "",
      bestTimeToContact: "",
      additionalNotes: "",
      termsAccepted: false,
    },
  });

  // Update email default if prop changes after first render
  const currentEmail = form.watch("email");
  if (userEmail && !currentEmail) {
    form.setValue("email", userEmail);
  }

  const previousTreatmentOptions = [
    "Minoxidil (Rogaine)",
    "Finasteride (Propecia)",
    "PRP Therapy",
    "Previous Hair Transplant",
    "Low-Level Laser Therapy",
    "None",
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoRef.current) photoRef.current.value = "";
  };

  const buildEmailHtml = (values: FormValues) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
        .section-title { color: #059669; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .field { margin-bottom: 8px; }
        .label { font-weight: bold; color: #4b5563; }
        .highlight { background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #059669; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0">New Hair Transplant Consultation Request</h1>
        </div>
        <img src="https://res.cloudinary.com/duubjpry8/image/upload/v1768150529/Hair_graft_procedure_demonstration_rsksbu.png"
          alt="ArtisticBuz" style="width:100%;max-width:600px;display:block;margin:0 auto;" />
        <div class="content">
          <div class="highlight">
            <h2 style="margin:0 0 8px;color:#059669">Calculator Summary</h2>
            <p><strong>Selected Pattern:</strong> ${selectedType}</p>
            <p><strong>Estimated Grafts:</strong> ${estimatedGrafts}</p>
            ${estimatedPrice ? `<p><strong>Estimated Cost:</strong> ${estimatedPrice}</p>` : ""}
          </div>

          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="field"><span class="label">Name:</span> ${values.firstName} ${values.lastName}</div>
            <div class="field"><span class="label">Email:</span> ${values.email}</div>
            <div class="field"><span class="label">Phone:</span> ${values.phone}</div>
            ${values.country ? `<div class="field"><span class="label">Country:</span> ${values.country}</div>` : ""}
            ${values.dateOfBirth ? `<div class="field"><span class="label">Date of Birth:</span> ${values.dateOfBirth}</div>` : ""}
          </div>

          <div class="section">
            <div class="section-title">Hair Loss History</div>
            ${values.hairLossDuration ? `<div class="field"><span class="label">Duration:</span> ${values.hairLossDuration}</div>` : ""}
            ${values.familyHistory ? `<div class="field"><span class="label">Family History:</span> ${values.familyHistory}</div>` : ""}
            ${values.previousTreatments?.length ? `<div class="field"><span class="label">Previous Treatments:</span> ${values.previousTreatments.join(", ")}</div>` : ""}
            ${values.medicalConditions ? `<div class="field"><span class="label">Medical Conditions / Medications:</span> ${values.medicalConditions}</div>` : ""}
          </div>

          <div class="section">
            <div class="section-title">Hair & Scalp Profile</div>
            ${values.hairType ? `<div class="field"><span class="label">Hair Type:</span> ${values.hairType}</div>` : ""}
            ${values.scalpCondition ? `<div class="field"><span class="label">Scalp Condition:</span> ${values.scalpCondition}</div>` : ""}
            ${values.desiredDensity ? `<div class="field"><span class="label">Desired Density:</span> ${values.desiredDensity}</div>` : ""}
            ${values.preferredClinicLocation ? `<div class="field"><span class="label">Preferred Clinic Location:</span> ${values.preferredClinicLocation}</div>` : ""}
          </div>

          <div class="section">
            <div class="section-title">Contact Preferences</div>
            ${values.preferredContact ? `<div class="field"><span class="label">Preferred Method:</span> ${values.preferredContact}</div>` : ""}
            ${values.bestTimeToContact ? `<div class="field"><span class="label">Best Time:</span> ${values.bestTimeToContact}</div>` : ""}
            ${values.additionalNotes ? `<div class="field"><span class="label">Additional Notes:</span> ${values.additionalNotes}</div>` : ""}
          </div>

          ${photoFile ? `<div class="section"><div class="section-title">Attached Photo</div><p>${photoFile.name} (attached)</p></div>` : ""}

          <p style="color:#6b7280;font-size:13px;margin-top:20px">
            Automatically generated from the ArtisticBuz Hair Graft Calculator.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append("subject", `Hair Transplant Consultation — ${values.firstName} ${values.lastName}`);
      fd.append("selectedType", selectedType);
      fd.append("estimatedGrafts", estimatedGrafts);
      if (estimatedPrice) fd.append("estimatedPrice", estimatedPrice);
      fd.append("html", buildEmailHtml(values));
      fd.append("formData", JSON.stringify({ ...values, selectedType, estimatedGrafts, estimatedPrice }));
      if (photoFile) fd.append("currentHairImage", photoFile);

      const res = await fetch("/api/send-email", { method: "POST", body: fd });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send");

      // Optional DB save — non-blocking
      fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, selectedType, estimatedGrafts, estimatedPrice }),
      }).catch(() => {});

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        form.reset();
        removePhoto();
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to send. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[92vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-gray-600 mb-4">
              Our specialist team will review your details and respond within 24 hours.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              <Mail className="w-4 h-4" />
              Confirmation sent to our support team.
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Mail className="w-6 h-6" /> Hair Transplant Consultation
              </DialogTitle>
              <DialogDescription>
                Share your details and our specialist team will respond within 24 hours.
              </DialogDescription>
            </DialogHeader>

            {/* Calculator summary */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                Your Calculator Summary
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hair Loss Pattern:</span>
                  <span className="font-semibold text-emerald-700">{selectedType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Grafts:</span>
                  <span className="font-semibold text-emerald-700">{estimatedGrafts}</span>
                </div>
                {estimatedPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-semibold text-emerald-700">{estimatedPrice}</span>
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Section 1: Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">1.</span> Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl><Input placeholder="John" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl><Input placeholder="+1 555 000 0000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country / Location</FormLabel>
                        <FormControl><Input placeholder="e.g. United Kingdom" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Section 2: Hair Loss History */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">2.</span> Hair Loss History
                  </h3>

                  <FormField control={form.control} name="hairLossDuration" render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long have you been experiencing hair loss?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "More than 10 years"].map(o => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="familyHistory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family history of hair loss?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yes — father's side">Yes — father's side</SelectItem>
                          <SelectItem value="Yes — mother's side">Yes — mother's side</SelectItem>
                          <SelectItem value="Yes — both sides">Yes — both sides</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Unsure">Unsure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="previousTreatments" render={() => (
                    <FormItem>
                      <FormLabel>Previous treatments tried (select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {previousTreatmentOptions.map((opt) => (
                          <FormField key={opt} control={form.control} name="previousTreatments"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(opt)}
                                    onCheckedChange={(checked) =>
                                      field.onChange(
                                        checked
                                          ? [...(field.value ?? []), opt]
                                          : (field.value ?? []).filter((v) => v !== opt)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm">{opt}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="medicalConditions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any medical conditions or current medications?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. diabetes, blood thinners — or write 'None'"
                          className="resize-none" rows={3} {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Section 3: Hair & Scalp Profile */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">3.</span> Hair & Scalp Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="hairType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hair texture</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Straight", "Wavy", "Curly", "Afro / Coily"].map(o => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="scalpCondition" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scalp condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Normal", "Dry", "Oily", "Sensitive / Itchy"].map(o => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Section 4: Goals */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">4.</span> Your Goals
                  </h3>

                  <FormField control={form.control} name="desiredDensity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired hair density after transplant</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select density" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Natural coverage (light, low-maintenance)">Natural coverage (light, low-maintenance)</SelectItem>
                          <SelectItem value="Medium density (balanced look)">Medium density (balanced look)</SelectItem>
                          <SelectItem value="High density (full, thick appearance)">High density (full, thick appearance)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="preferredClinicLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred clinic location (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Istanbul, Nairobi, London" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Photo upload */}
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Upload a photo of your current hair (optional)
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={photoRef}
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div className="flex items-center gap-3 mt-2 p-2 border rounded-lg">
                        <img src={photoPreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        <span className="text-sm text-gray-600 flex-1">{photoFile?.name}</span>
                        <button type="button" onClick={removePhoto} className="text-red-500 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </FormItem>
                </div>

                {/* Section 5: Contact Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">5.</span> Contact Preferences
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="preferredContact" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred contact method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Email", "Phone Call", "WhatsApp", "Video Call"].map(o => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bestTimeToContact" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best time to reach you</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–9pm)", "Any time"].map(o => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional questions or concerns</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Anything else you'd like the specialist to know..."
                          className="resize-none" rows={4} {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Section 6: Terms */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">6.</span> Confirmation
                  </h3>

                  <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                    <FormItem className="flex items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer font-normal text-sm">
                          I confirm that all information provided is accurate and understand that this
                          is an estimate, not a medical diagnosis. *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Mail className="mr-2 h-4 w-4" /> Send Consultation Request</>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  This form will be sent to our specialist support team.
                  {photoFile && " Your photo will be attached."}
                </p>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
