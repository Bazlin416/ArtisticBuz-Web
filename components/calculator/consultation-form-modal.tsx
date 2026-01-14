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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  CheckCircle,
  Mail,
  Upload,
  X,
  Plus,
  Trash2,
} from "lucide-react";

const formSchema = z.object({
  // Client Information
  clientsName: z.object({
    first: z.string().min(1, "First name is required"),
    last: z.string().min(1, "Last name is required"),
  }),
  clientsEmail: z.string().email("Invalid email address"),
  clientsPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  occupation: z.string().optional(),
  dateOfBirth: z.string().optional(),

  // Hair Service Selection
  hairServices: z
    .array(z.string())
    .min(1, "Please select at least one service"),
  preferredHairStyle: z.string().optional(),
  hairStyleImage: z.any().optional(),
  currentHairImage: z.any().optional(),

  // Hair Information
  hairLength: z.string().optional(),
  scalpCondition: z.string().optional(),
  shampooFrequency: z.string().optional(),
  currentHairCondition: z.array(z.string()).optional(),
  pastTreatments: z.array(z.string()).optional(),

  // Hair History
  lastSalonVisit: z.string().optional(),
  lastColorApplication: z.string().optional(),
  hairLossHistory: z.string().optional(),
  hairDescription: z.string().optional(),

  // Products and Medications
  currentProducts: z
    .array(
      z.object({
        productName: z.string(),
        purpose: z.string(),
      })
    )
    .optional(),
  medications: z
    .array(
      z.object({
        medicationName: z.string(),
        purpose: z.string(),
      })
    )
    .optional(),

  // Salon Visit Frequency
  salonFrequency: z.array(z.string()).optional(),

  // How did you hear about us
  referralSource: z.array(z.string()).optional(),

  // Additional Information
  specialInstructions: z.string().optional(),

  // Terms and Signature
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
  minorTermsAccepted: z.boolean().optional(),
  signature: z.string().optional(),
  dateSigned: z.string().optional(),
});

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string;
  estimatedGrafts: string;
  estimatedPrice?: string;
}

export function ConsultationFormModal({
  isOpen,
  onClose,
  selectedType,
  estimatedGrafts,
  estimatedPrice,
}: ConsultationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [hairStyleImagePreview, setHairStyleImagePreview] = useState<
    string | null
  >(null);
  const [currentHairImagePreview, setCurrentHairImagePreview] = useState<
    string | null
  >(null);
  const [currentProducts, setCurrentProducts] = useState<
    Array<{ productName: string; purpose: string }>
  >([]);
  const [medications, setMedications] = useState<
    Array<{ medicationName: string; purpose: string }>
  >([]);

  const hairStyleImageRef = useRef<HTMLInputElement>(null);
  const currentHairImageRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientsName: {
        first: "",
        last: "",
      },
      clientsEmail: "",
      clientsPhone: "",
      occupation: "",
      dateOfBirth: "",
      hairServices: [],
      preferredHairStyle: "",
      hairLength: "",
      scalpCondition: "",
      shampooFrequency: "",
      currentHairCondition: [],
      pastTreatments: [],
      lastSalonVisit: "",
      lastColorApplication: "",
      hairLossHistory: "",
      hairDescription: "",
      currentProducts: [],
      medications: [],
      salonFrequency: [],
      referralSource: [],
      specialInstructions: "",
      termsAccepted: false,
      minorTermsAccepted: false,
      signature: "",
      dateSigned: "",
    },
  });

  const hairServices = [
    "Adult Hair Cut",
    "Kid Hair Cut",
    "Cut & Shampoo",
    "Hair color (Permanent)",
    "Hair color (Semi)",
    "Hair Color Blending",
    "Hair Conditioning",
    "Hair styling (Formal)",
    "Hair styling (Special Occasion)",
    "Perms",
    "Relaxers",
    "Retexturizing",
    "Highlights",
  ];

  const hairLengthOptions = [
    { value: "Short", label: "Short" },
    { value: "Medium", label: "Medium" },
    { value: "Long", label: "Long" },
  ];

  const scalpConditionOptions = [
    { value: "Dry", label: "Dry" },
    { value: "Normal", label: "Normal" },
    { value: "Oily", label: "Oily" },
  ];

  const shampooFrequencyOptions = [
    "Every day",
    "Every other day",
    "Twice a week",
    "Once a week",
  ];

  const hairConditionOptions = [
    "Hair loss",
    "Damage due to heat",
    "Split ends",
    "Breakage",
    "Itchy scalp",
    "Hair is dry",
    "Dandruff",
  ];

  const pastTreatmentOptions = [
    "Permanent hair color",
    "Keratin Treatment",
    "Razor cut/Thinning",
    "Relaxer",
    "Henna",
  ];

  const salonFrequencyOptions = [
    "Every week",
    "Every 2 weeks",
    "Every 3-4 weeks",
    "Every 2 months",
    "Every 2-6 months",
    "Twice a year",
    "Once a year",
  ];

  const referralSourceOptions = [
    "Facebook",
    "Twitter",
    "Instagram",
    "YouTube",
    "Online Advertisement",
    "Google Search",
    "Referred by a friend",
    "Newspaper/Magazine",
  ];

  const handleHairStyleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("hairStyleImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHairStyleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCurrentHairImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("currentHairImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentHairImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHairStyleImage = () => {
    form.setValue("hairStyleImage", null);
    setHairStyleImagePreview(null);
    if (hairStyleImageRef.current) {
      hairStyleImageRef.current.value = "";
    }
  };

  const removeCurrentHairImage = () => {
    form.setValue("currentHairImage", null);
    setCurrentHairImagePreview(null);
    if (currentHairImageRef.current) {
      currentHairImageRef.current.value = "";
    }
  };

  const addCurrentProduct = () => {
    setCurrentProducts([...currentProducts, { productName: "", purpose: "" }]);
  };

  const updateCurrentProduct = (
    index: number,
    field: "productName" | "purpose",
    value: string
  ) => {
    const updatedProducts = [...currentProducts];
    updatedProducts[index][field] = value;
    setCurrentProducts(updatedProducts);
    form.setValue("currentProducts", updatedProducts);
  };

  const removeCurrentProduct = (index: number) => {
    const updatedProducts = currentProducts.filter((_, i) => i !== index);
    setCurrentProducts(updatedProducts);
    form.setValue("currentProducts", updatedProducts);
  };

  const addMedication = () => {
    setMedications([...medications, { medicationName: "", purpose: "" }]);
  };

  const updateMedication = (
    index: number,
    field: "medicationName" | "purpose",
    value: string
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
    form.setValue("medications", updatedMedications);
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
    form.setValue("medications", updatedMedications);
  };

  const sendEmail = async (formData: FormData) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        // DO NOT set Content-Type header - browser will set it with boundary
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const generateEmailHTML = (formData: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
          .section-title { color: #059669; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #4b5563; }
          .value { color: #111827; }
          .highlight { background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #059669; margin: 15px 0; }
          .image-info { background: #eff6ff; padding: 10px; border-radius: 6px; margin: 10px 0; font-size: 14px; }
          .product-list, .medication-list { background: #f8fafc; padding: 10px; border-radius: 6px; margin: 10px 0; }
          .product-item, .medication-item { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .product-item:last-child, .medication-item:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Hair Consultation Request</h1>
            <p>You have received a new consultation request from the website.</p>
          </div>

          <!-- Banner Image -->
          <img
            src="https://res.cloudinary.com/duubjpry8/image/upload/v1768150529/Hair_graft_procedure_demonstration_rsksbu.png"
            alt="Hair Graft Calculator Consultation"
            style="
              width:100%;
              max-width:600px;
              display:block;
              margin:0 auto;
              border-radius:0 0 8px 8px;
            "
          />
          
          <div class="content">
            <div class="highlight">
              <h2 style="margin: 0; color: #059669;">Calculation Summary</h2>
              <p><strong>Selected Type:</strong> ${selectedType}</p>
              <p><strong>Estimated Grafts:</strong> ${estimatedGrafts}</p>
              ${estimatedPrice ? `<p><strong>Estimated Price:</strong> ${estimatedPrice}</p>` : ""}
            </div>
            
            <div class="section">
              <div class="section-title">Client Information</div>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.clientsName.first} ${formData.clientsName.last}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${formData.clientsEmail}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${formData.clientsPhone}</div>
              </div>
              ${
                formData.occupation
                  ? `<div class="field">
                <div class="label">Occupation:</div>
                <div class="value">${formData.occupation}</div>
              </div>`
                  : ""
              }
              ${
                formData.dateOfBirth
                  ? `<div class="field">
                <div class="label">Date of Birth:</div>
                <div class="value">${formData.dateOfBirth}</div>
              </div>`
                  : ""
              }
            </div>
            
            <div class="section">
              <div class="section-title">Selected Hair Services</div>
              <ul>
                ${formData.hairServices.map((service: string) => `<li>${service}</li>`).join("")}
              </ul>
            </div>
            
            ${
              formData.preferredHairStyle
                ? `<div class="section">
              <div class="section-title">Preferred Hair Style</div>
              <div class="value">${formData.preferredHairStyle}</div>
            </div>`
                : ""
            }
            
            ${
              formData.hairStyleImage
                ? `<div class="section">
              <div class="section-title">Hair Style Image</div>
              <div class="image-info">
                <p><strong>File Uploaded:</strong> ${formData.hairStyleImage.name}</p>
                <p><em>Note: Image is attached to this email as a file.</em></p>
              </div>
            </div>`
                : ""
            }
            
            ${
              formData.currentHairImage
                ? `<div class="section">
              <div class="section-title">Current Hair Image</div>
              <div class="image-info">
                <p><strong>File Uploaded:</strong> ${formData.currentHairImage.name}</p>
                <p><em>Note: Image is attached to this email as a file.</em></p>
              </div>
            </div>`
                : ""
            }
            
            <div class="section">
              <div class="section-title">Hair Information</div>
              ${
                formData.hairLength
                  ? `<div class="field">
                <div class="label">Hair Length:</div>
                <div class="value">${formData.hairLength}</div>
              </div>`
                  : ""
              }
              ${
                formData.scalpCondition
                  ? `<div class="field">
                <div class="label">Scalp Condition:</div>
                <div class="value">${formData.scalpCondition}</div>
              </div>`
                  : ""
              }
              ${
                formData.shampooFrequency
                  ? `<div class="field">
                <div class="label">Shampoo Frequency:</div>
                <div class="value">${formData.shampooFrequency}</div>
              </div>`
                  : ""
              }
              ${
                formData.hairDescription
                  ? `<div class="field">
                <div class="label">Hair Description:</div>
                <div class="value">${formData.hairDescription}</div>
              </div>`
                  : ""
              }
            </div>
            
            ${
              formData.currentHairCondition &&
              formData.currentHairCondition.length > 0
                ? `<div class="section">
              <div class="section-title">Current Hair Conditions</div>
              <ul>
                ${formData.currentHairCondition.map((condition: string) => `<li>${condition}</li>`).join("")}
              </ul>
            </div>`
                : ""
            }
            
            ${
              formData.pastTreatments && formData.pastTreatments.length > 0
                ? `<div class="section">
              <div class="section-title">Past Treatments</div>
              <ul>
                ${formData.pastTreatments.map((treatment: string) => `<li>${treatment}</li>`).join("")}
              </ul>
            </div>`
                : ""
            }
            
            ${
              formData.currentProducts && formData.currentProducts.length > 0
                ? `<div class="section">
              <div class="section-title">Current Hair Products</div>
              <div class="product-list">
                ${formData.currentProducts
                  .map(
                    (product: any, index: number) => `
                  <div class="product-item">
                    <strong>Product ${index + 1}:</strong> ${product.productName}<br>
                    <strong>Purpose:</strong> ${product.purpose}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
            
            ${
              formData.medications && formData.medications.length > 0
                ? `<div class="section">
              <div class="section-title">Current Medications</div>
              <div class="medication-list">
                ${formData.medications
                  .map(
                    (medication: any, index: number) => `
                  <div class="medication-item">
                    <strong>Medication ${index + 1}:</strong> ${medication.medicationName}<br>
                    <strong>Purpose:</strong> ${medication.purpose}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
            
            ${
              formData.lastSalonVisit
                ? `<div class="section">
              <div class="section-title">Last Salon Visit</div>
              <div class="value">${formData.lastSalonVisit}</div>
            </div>`
                : ""
            }
            
            ${
              formData.lastColorApplication
                ? `<div class="section">
              <div class="section-title">Last Color Application</div>
              <div class="value">${formData.lastColorApplication}</div>
            </div>`
                : ""
            }
            
            ${
              formData.hairLossHistory
                ? `<div class="section">
              <div class="section-title">Hair Loss History</div>
              <div class="value">${formData.hairLossHistory}</div>
            </div>`
                : ""
            }
            
            ${
              formData.salonFrequency && formData.salonFrequency.length > 0
                ? `<div class="section">
              <div class="section-title">Salon Visit Frequency</div>
              <ul>
                ${formData.salonFrequency.map((frequency: string) => `<li>${frequency}</li>`).join("")}
              </ul>
            </div>`
                : ""
            }
            
            ${
              formData.referralSource && formData.referralSource.length > 0
                ? `<div class="section">
              <div class="section-title">Referral Sources</div>
              <ul>
                ${formData.referralSource.map((source: string) => `<li>${source}</li>`).join("")}
              </ul>
            </div>`
                : ""
            }
            
            ${
              formData.specialInstructions
                ? `<div class="section">
              <div class="section-title">Special Instructions</div>
              <div class="value">${formData.specialInstructions}</div>
            </div>`
                : ""
            }
            
            <div class="section">
              <div class="section-title">Terms and Signature</div>
              <div class="field">
                <div class="label">Terms Accepted:</div>
                <div class="value">Yes</div>
              </div>
              ${
                formData.minorTermsAccepted
                  ? `<div class="field">
                <div class="label">Minor Terms Accepted:</div>
                <div class="value">Yes</div>
              </div>`
                  : ""
              }
              ${
                formData.signature
                  ? `<div class="field">
                <div class="label">Signature:</div>
                <div class="value">${formData.signature}</div>
              </div>`
                  : ""
              }
              ${
                formData.dateSigned
                  ? `<div class="field">
                <div class="label">Date Signed:</div>
                <div class="value">${formData.dateSigned}</div>
              </div>`
                  : ""
              }
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This email was automatically generated from the Hair Graft Calculator website.</p>
              <p>Check email attachments for uploaded images.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setEmailError(null);

    try {
      // Create FormData object to properly handle file uploads
      const formData = new FormData();

      // Set email recipients and subject
      formData.append("to", "jared.babu@artisticclinic.com");
      formData.append("cc", "support@artisticbuz.com");
      formData.append(
        "subject",
        `New Hair Consultation Request - ${values.clientsName.first} ${values.clientsName.last}`
      );

      // Append calculation summary
      formData.append("selectedType", selectedType);
      formData.append("estimatedGrafts", estimatedGrafts);
      if (estimatedPrice) {
        formData.append("estimatedPrice", estimatedPrice);
      }

      // Generate HTML content
      const htmlContent = generateEmailHTML({
        ...values,
        selectedType,
        estimatedGrafts,
        estimatedPrice,
      });

      // Append HTML content
      formData.append("html", htmlContent);

      // Append the complete form data as JSON for the database
      const completeFormData = {
        ...values,
        selectedType,
        estimatedGrafts,
        estimatedPrice,
      };
      formData.append("formData", JSON.stringify(completeFormData));

      // Append image files if they exist
      if (values.hairStyleImage && values.hairStyleImage instanceof File) {
        formData.append("hairStyleImage", values.hairStyleImage);
      }

      if (values.currentHairImage && values.currentHairImage instanceof File) {
        formData.append("currentHairImage", values.currentHairImage);
      }

      // Send email with attachments
      await sendEmail(formData);

      // Optional: Save to database
      try {
        await fetch("/api/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeFormData),
        });
      } catch (dbError) {
        console.log(
          "Database save failed (optional), but email was sent:",
          dbError
        );
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        form.reset();
        setHairStyleImagePreview(null);
        setCurrentHairImagePreview(null);
        setCurrentProducts([]);
        setMedications([]);
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setEmailError(
        error.message ||
          "Failed to send consultation request. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Consultation Request Sent!
            </h3>
            <p className="text-gray-600 mb-4">
              Your consultation request has been submitted successfully. Our
              team will contact you soon at the email you provided.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              <Mail className="w-4 h-4" />
              <span>
                A confirmation with attachments has been sent to our support
                team.
              </span>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Hair Consultation Request
              </DialogTitle>
              <DialogDescription>
                Fill out this comprehensive form to help us understand your hair
                needs and provide the best service.
              </DialogDescription>
            </DialogHeader>

            {emailError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">{emailError}</p>
              </div>
            )}

            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Selected Hair Loss Pattern:
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {selectedType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Grafts Required:
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {estimatedGrafts}
                  </span>
                </div>
                {estimatedPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Estimated Cost:
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {estimatedPrice}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  This information will be included in the email to our support
                  team.
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Hair Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">1.</span>
                    Select a hair service
                  </h3>
                  <FormField
                    control={form.control}
                    name="hairServices"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {hairServices.map((service) => (
                            <FormField
                              key={service}
                              control={form.control}
                              name="hairServices"
                              render={({ field }) => (
                                <FormItem
                                  key={service}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(service)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              service,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== service
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {service}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Client Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">2.</span>
                    Client Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientsName.first"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientsName.last"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientsEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientsPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 555-5555" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Your occupation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Hair Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">3.</span>
                    Hair Preferences
                  </h3>
                  <FormField
                    control={form.control}
                    name="preferredHairStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What hair style do you like?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe your preferred hair style"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hairStyleImage"
                    render={() => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload an image of hair you prefer
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              ref={hairStyleImageRef}
                              onChange={handleHairStyleImageChange}
                            />
                            {hairStyleImagePreview && (
                              <div className="relative mt-2">
                                <div className="flex items-center gap-2 p-2 border rounded-lg">
                                  <img
                                    src={hairStyleImagePreview}
                                    alt="Hair style preview"
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <span className="text-sm text-gray-600">
                                    Image preview
                                  </span>
                                  <button
                                    type="button"
                                    onClick={removeHairStyleImage}
                                    className="ml-auto text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hair Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">4.</span>
                    Hair Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hairLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How long is your hair?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select hair length" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hairLengthOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scalpCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scalp Condition</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select scalp condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scalpConditionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shampooFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          How often do you apply shampoo and conditioner?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shampooFrequencyOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentHairImage"
                    render={() => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload an image of your current hair
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              ref={currentHairImageRef}
                              onChange={handleCurrentHairImageChange}
                            />
                            {currentHairImagePreview && (
                              <div className="relative mt-2">
                                <div className="flex items-center gap-2 p-2 border rounded-lg">
                                  <img
                                    src={currentHairImagePreview}
                                    alt="Current hair preview"
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <span className="text-sm text-gray-600">
                                    Image preview
                                  </span>
                                  <button
                                    type="button"
                                    onClick={removeCurrentHairImage}
                                    className="ml-auto text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hairDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us something about your hair</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your hair texture, concerns, and goals..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Current Hair Condition */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">5.</span>
                    Current Hair Condition
                  </h3>
                  <FormField
                    control={form.control}
                    name="currentHairCondition"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {hairConditionOptions.map((condition) => (
                            <FormField
                              key={condition}
                              control={form.control}
                              name="currentHairCondition"
                              render={({ field }) => (
                                <FormItem
                                  key={condition}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(condition)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              condition,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== condition
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {condition}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Past Treatments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">6.</span>
                    Past Hair Treatments
                  </h3>
                  <FormField
                    control={form.control}
                    name="pastTreatments"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {pastTreatmentOptions.map((treatment) => (
                            <FormField
                              key={treatment}
                              control={form.control}
                              name="pastTreatments"
                              render={({ field }) => (
                                <FormItem
                                  key={treatment}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(treatment)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              treatment,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== treatment
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {treatment}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Current Hair Products */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">7.</span>
                    Current Hair Products
                  </h3>
                  <div className="space-y-3">
                    {currentProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start p-3 border rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Product Name"
                            value={product.productName}
                            onChange={(e) =>
                              updateCurrentProduct(
                                index,
                                "productName",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Purpose of using this product"
                            value={product.purpose}
                            onChange={(e) =>
                              updateCurrentProduct(
                                index,
                                "purpose",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCurrentProduct(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCurrentProduct}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>

                {/* Current Medications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">8.</span>
                    Current Medications
                  </h3>
                  <div className="space-y-3">
                    {medications.map((medication, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start p-3 border rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Medication Name"
                            value={medication.medicationName}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "medicationName",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Purpose of taking this medication"
                            value={medication.purpose}
                            onChange={(e) =>
                              updateMedication(index, "purpose", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMedication}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </div>

                {/* Hair History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">9.</span>
                    Hair History
                  </h3>

                  <FormField
                    control={form.control}
                    name="lastSalonVisit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          When did you last visit a hair salon?
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastColorApplication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          When did you last apply professional or unprofessional
                          color in your hair?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe when and what type of color was applied..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hairLossHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Do you have any hair loss problems in the past?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe any hair loss issues..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Salon Frequency */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">10.</span>
                    Salon Visit Frequency
                  </h3>
                  <FormField
                    control={form.control}
                    name="salonFrequency"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {salonFrequencyOptions.map((frequency) => (
                            <FormField
                              key={frequency}
                              control={form.control}
                              name="salonFrequency"
                              render={({ field }) => (
                                <FormItem
                                  key={frequency}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(frequency)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              frequency,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== frequency
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {frequency}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Referral Source */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">11.</span>
                    How did you hear about us?
                  </h3>
                  <FormField
                    control={form.control}
                    name="referralSource"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {referralSourceOptions.map((source) => (
                            <FormField
                              key={source}
                              control={form.control}
                              name="referralSource"
                              render={({ field }) => (
                                <FormItem
                                  key={source}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(source)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value ?? []),
                                              source,
                                            ])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== source
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {source}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">12.</span>
                    Additional Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Any special instructions, comments, or suggestions?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please share any additional information..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-emerald-600">13.</span>
                    Terms and Conditions
                  </h3>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            I confirmed that all information indicated in this
                            form is true and accurate. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minorTermsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer text-sm">
                            If you're a minor (18 years below), please check
                            this box instead of signing.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Signature (Full Name)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Type your full name as signature"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateSigned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Signed</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending to Support...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send to Support Team
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center pt-2">
                  <p>
                    This form will be sent directly to our support team at{" "}
                    <strong>jared.babu@artisticclinic.com</strong>
                  </p>
                  <p className="mt-1">
                    <strong>Note:</strong> Uploaded images will be sent as email
                    attachments.
                  </p>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}