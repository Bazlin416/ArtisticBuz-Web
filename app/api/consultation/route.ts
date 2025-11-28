import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Prepare the data for insertion
    const consultationData = {
      // Client Information
      first_name: body.clientsName?.first,
      last_name: body.clientsName?.last,
      email: body.clientsEmail,
      phone: body.clientsPhone,
      occupation: body.occupation || null,
      date_of_birth: body.dateOfBirth || null,
      
      // Hair Service Selection
      hair_services: body.hairServices || [],
      preferred_hair_style: body.preferredHairStyle || null,
      
      // Hair Information
      hair_length: body.hairLength || null,
      scalp_condition: body.scalpCondition || null,
      shampoo_frequency: body.shampooFrequency || null,
      current_hair_condition: body.currentHairCondition || [],
      past_treatments: body.pastTreatments || [],
      
      // Hair History
      last_salon_visit: body.lastSalonVisit || null,
      last_color_application: body.lastColorApplication || null,
      hair_loss_history: body.hairLossHistory || null,
      hair_description: body.hairDescription || null,
      
      // Products and Medications
      current_products: body.currentProducts || [],
      medications: body.medications || [],
      
      // Salon Visit Frequency
      salon_frequency: body.salonFrequency || [],
      
      // Referral Source
      referral_source: body.referralSource || [],
      
      // Additional Information
      special_instructions: body.specialInstructions || null,
      
      // Terms and Signature
      terms_accepted: body.termsAccepted || false,
      minor_terms_accepted: body.minorTermsAccepted || false,
      signature: body.signature || null,
      date_signed: body.dateSigned || null,
      
      // Original fields (for backward compatibility)
      name: `${body.clientsName?.first} ${body.clientsName?.last}`.trim(),
      preferred_contact: 'email', // Default or you can add this field to the form
      selected_baldness_type: body.selectedBaldnessType,
      estimated_grafts: body.estimatedGrafts,
      estimated_price: body.estimatedPrice || null,
      message: body.specialInstructions || null, // Map to special_instructions
    };

    const { data, error } = await supabase
      .from('consultations')
      .insert([consultationData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit consultation request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}