'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  // Client Information
  clientsName: z.object({
    first: z.string().min(1, 'First name is required'),
    last: z.string().min(1, 'Last name is required'),
  }),
  clientsEmail: z.string().email('Invalid email address'),
  clientsPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  occupation: z.string().optional(),
  dateOfBirth: z.string().optional(),
  
  // Hair Service Selection
  hairServices: z.array(z.string()).min(1, 'Please select at least one service'),
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
  currentProducts: z.array(z.object({
    productName: z.string(),
    purpose: z.string(),
  })).optional(),
  medications: z.array(z.object({
    medicationName: z.string(),
    purpose: z.string(),
  })).optional(),
  
  // Salon Visit Frequency
  salonFrequency: z.array(z.string()).optional(),
  
  // How did you hear about us
  referralSource: z.array(z.string()).optional(),
  
  // Additional Information
  specialInstructions: z.string().optional(),
  
  // Terms and Signature
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientsName: {
        first: '',
        last: '',
      },
      clientsEmail: '',
      clientsPhone: '',
      occupation: '',
      dateOfBirth: '',
      hairServices: [],
      preferredHairStyle: '',
      hairLength: '',
      scalpCondition: '',
      shampooFrequency: '',
      currentHairCondition: [],
      pastTreatments: [],
      lastSalonVisit: '',
      lastColorApplication: '',
      hairLossHistory: '',
      hairDescription: '',
      currentProducts: [],
      medications: [],
      salonFrequency: [],
      referralSource: [],
      specialInstructions: '',
      termsAccepted: false,
      minorTermsAccepted: false,
      signature: '',
      dateSigned: '',
    },
  });

  const hairServices = [
    'Adult Hair Cut',
    'Kid Hair Cut',
    'Cut & Shampoo',
    'Hair color (Permanent)',
    'Hair color (Semi)',
    'Hair Color Blending',
    'Hair Conditioning',
    'Hair styling (Formal)',
    'Hair styling (Special Occasion)',
    'Perms',
    'Relaxers',
    'Retexturizing',
    'Highlights',
  ];

  const hairLengthOptions = [
    { value: 'Short', label: 'Short' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Long', label: 'Long' },
  ];

  const scalpConditionOptions = [
    { value: 'Dry', label: 'Dry' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Oily', label: 'Oily' },
  ];

  const shampooFrequencyOptions = [
    'Every day',
    'Every other day',
    'Twice a week',
    'Once a week',
  ];

  const hairConditionOptions = [
    'Hair loss',
    'Damage due to heat',
    'Split ends',
    'Breakage',
    'Itchy scalp',
    'Hair is dry',
    'Dandruff',
  ];

  const pastTreatmentOptions = [
    'Permanent hair color',
    'Keratin Treatment',
    'Razor cut/Thinning',
    'Relaxer',
    'Henna',
  ];

  const salonFrequencyOptions = [
    'Every week',
    'Every 2 weeks',
    'Every 3-4 weeks',
    'Every 2 months',
    'Every 2-6 months',
    'Twice a year',
    'Once a year',
  ];

  const referralSourceOptions = [
    'Facebook',
    'Twitter',
    'Instagram',
    'YouTube',
    'Online Advertisement',
    'Google Search',
    'Referred by a friend',
    'Newspaper/Magazine',
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          selectedBaldnessType: selectedType,
          estimatedGrafts: estimatedGrafts,
          estimatedPrice: estimatedPrice,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          form.reset();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
              Thank You!
            </h3>
            <p className="text-gray-600">
              Your consultation request has been submitted successfully.
              Our team will contact you soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Hair Consultation Form</DialogTitle>
              <DialogDescription>
                Please fill out this comprehensive form to help us understand your hair needs and provide the best service.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700">
                Selected: <span className="text-emerald-600">{selectedType}</span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Estimated: <span className="text-emerald-600">{estimatedGrafts}</span>
              </p>
              {estimatedPrice && (
                <p className="text-sm font-medium text-gray-700">
                  Price: <span className="text-emerald-600">{estimatedPrice}</span>
                </p>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hair Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select a hair service</h3>
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
                                          ? field.onChange([...(field.value ?? []), service])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== service
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
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
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientsName.first"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
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
                          <FormLabel>Last Name</FormLabel>
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
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
                  <h3 className="text-lg font-semibold">Hair Preferences</h3>
                  <FormField
                    control={form.control}
                    name="preferredHairStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What hair style do you like?</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe your preferred hair style" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hairStyleImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload an image of hair you prefer</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hair Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hair Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hairLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How long is your hair?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select hair length" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hairLengthOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select scalp condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scalpConditionOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
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
                        <FormLabel>How often do you apply shampoo and conditioner?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shampooFrequencyOptions.map(option => (
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload an image of your current hair</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
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
                  <h3 className="text-lg font-semibold">Current Hair Condition</h3>
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
                                          ? field.onChange([...(field.value ?? []), condition])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== condition
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
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
                  <h3 className="text-lg font-semibold">Past Hair Treatments</h3>
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
                                          ? field.onChange([...(field.value ?? []), treatment])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== treatment
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
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

                {/* Hair History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hair History</h3>
                  
                  <FormField
                    control={form.control}
                    name="lastSalonVisit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>When did you last visit a hair salon?</FormLabel>
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
                        <FormLabel>When did you last apply professional or unprofessional color in your hair?</FormLabel>
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
                        <FormLabel>Do you have any hair loss problems in the past?</FormLabel>
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
                  <h3 className="text-lg font-semibold">Salon Visit Frequency</h3>
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
                                          ? field.onChange([...(field.value ?? []), frequency])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== frequency
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
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
                  <h3 className="text-lg font-semibold">How did you hear about us?</h3>
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
                                          ? field.onChange([...(field.value ?? []), source])
                                          : field.onChange(
                                              (field.value ?? []).filter(
                                                (value) => value !== source
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
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
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any special instructions, comments, or suggestions?</FormLabel>
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

                {/* Terms and Conditions */}
                <div className="space-y-4 border-t pt-4">
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
                          <FormLabel>
                            I confirmed that all information indicated in this form is true and accurate.
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
                          <FormLabel className="text-sm">
                            If you're a minor (18 years below), please check this box instead of signing.
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
                          <FormLabel>Client Signature</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your full name as signature" {...field} />
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
                        Submitting...
                      </>
                    ) : (
                      'Submit Consultation Form'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}