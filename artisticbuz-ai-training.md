# ArtisticBuz Website AI Training Document

## Overview

**Website:** ArtisticBuz
**Domain:** https://artisticbuz.com
**Company:** Buzlin Holdings Inc.
**Operating as:** ArtisticBuz
**Location:** Edmonton, Alberta, Canada
**Support Email:** info@artisticbuz.com

**Brand positioning:**
- Professional hair graft calculator
- Hair restoration insights
- Clinically guided estimates
- Local currency cost estimates
- Specialist consultation routing

**Primary product offering:**
- A hair graft estimation tool based on hair loss patterns, gender preference, hair texture, and desired density.
- A one-time 14-day subscription for full access.
- Blog articles and educational resources.
- Partner hair transplant clinic directory.
- Consultation form submission.

## Main Landing Page Content

### Hero Section
- *Clinically Guided Hair Restoration Tool*
- *Know Exactly How Many Hair Grafts You Need & the Cost*
- Description: "Use our professional hair graft calculator to estimate the number of grafts & the cost required for a natural-looking transplant - tailored to your hair loss pattern, density, and goals."
- Benefit highlights:
  - 15,000+ Patients Assisted
  - 20+ Years Clinical Insight
  - Instant Graft Estimation
- CTAs:
  - Start Your Assessment
  - Speak to a Specialist
- Note: "Full graft breakdown & pricing available with a one-time subscription."

### Services Section
- *Comprehensive Hair Restoration Solutions*
- Description: "ArtisticBuz offers a full range of medically guided hair restoration services – combining surgical precision, regenerative treatments, and aesthetic refinement to achieve natural, long-lasting results."

Services offered:
- FUE Hair Transplant: "Follicular Unit Extraction (FUE) is a minimally invasive technique where individual hair follicles are harvested and implanted for natural density with minimal scarring and faster recovery."
- FUT Hair Transplant: "Follicular Unit Transplantation (FUT) is ideal for advanced hair loss cases, allowing a higher graft yield through strip harvesting while maintaining excellent cosmetic outcomes."
- Beard Transplant: "Designed for men with patchy or thin facial hair, beard transplants restore fullness and symmetry using precise angle-controlled implantation."
- Eyebrow Transplant: "A highly artistic procedure that restores eyebrow shape and density, customized to facial structure, gender, and natural growth direction."
- PRP Treatment: "Platelet-Rich Plasma (PRP) therapy stimulates dormant follicles, improves graft survival, and strengthens existing hair using your body’s natural growth factors."
- Scalp Micropigmentation (SMP): "A non-surgical cosmetic solution that creates the appearance of fuller hair or a clean shaved look by depositing medical-grade pigment into the scalp."

CTA: "Calculate Your Graft Requirement"

### Step 1: Area-Based Estimation
- Title: *Visualize Affected Areas for Greater Accuracy*
- Description: "Interact with the 3D scalp model to select specific areas of hair loss. Your selections instantly refine the graft estimation for precision planning."
- Feature: 3D scalp visualization with clickable hair loss areas.

### Step 2: Hair Loss Assessment
- Title: *Calculate Your Hair Restoration Needs*
- Description: "Select affected areas to receive a clinically guided estimate of the number of grafts & the cost required for natural, balanced results."

Access states:
- Users must sign in to begin assessment.
- Users need an active subscription to unlock full calculator access.
- Subscription offer: one-time payment for 14 days of full platform access.

User input options:
- Gender preference: Neutral, Male, Female.
- Hair texture: Straight, Wavy, Curly, Afro.
- Desired density: Sparse, Natural, Dense.
- Select hair loss pattern areas using a grid of baldness types.

Calculator output includes:
- Total graft range.
- Average graft count.
- Cost range in local currency.
- Adjustment notes for female pattern, curly texture, Afro texture, sparse density, dense density.

### Recent Estimates & History
- The site saves recent estimates in browser localStorage.
- Users can restore recent calculations or clear history.

### Clinical Excellence Section
- Title: *Why Patients Trust Our Hair Restoration Expertise*
- Description: "Our approach combines medical precision, advanced technology, and personalized planning to deliver natural, long-lasting hair restoration outcomes."

Core pillars:
- Expert-Led Procedures: guided by board-certified specialists with decades of combined experience.
- Safe, Proven Techniques: globally recognized, FDA-approved methods.
- Personalized Treatment Planning: customized to hair type, density, and long-term goals.
- Flexible Payment Options: some partner clinics offer financing.

Differentiators:
- Clinically guided graft estimation — not guesswork
- Area-by-area precision using 3D scalp visualization
- Designed to support both straight hair and Afro-textured
- Transparent methodology backed by clinical experience

### Partner Clinics
- Title: *Partner Hair Transplant Clinics*
- Description: "ArtisticBuz collaborates with carefully selected, clinically vetted hair transplant clinics around the world to ensure safe, ethical, and high-quality patient outcomes."
- The site displays active partner clinics with city, country, logo, and link.

### Blog / Latest Insights
- Title: *Latest Insights*
- Description: "Expert insights, guides, and updates to help you make informed decisions."
- CTA: *View all articles*

### Final CTA
- Title: *Take the Next Step Toward Confident, Natural Hair Restoration*
- Description: "Your graft estimate is the foundation. A specialist consultation transforms it into a safe, personalized treatment plan designed for long-term results."
- CTA: *Book a Specialist Consultation*
- Note: "No obligation. Your consultation focuses on assessment, safety, and realistic expectations, not pressure."

## Blog Page Content

### Title
- *Blogs & Insights*

### Description
- "Expert insights, educational guides, and research-backed articles curated by our team."

### Article presentation
- Each blog shows topic, title, excerpt, published date, and link.
- CTA: "Read article →"
- Footer CTA: "Put the Knowledge Into Action"
- Blog CTA text: "Our hair graft calculator gives you a clinically guided estimate in minutes. Understand your options before you book anything."
- Buttons: *Try the Calculator →* and *← Back to Home*

## User Account and Subscription Flow

### Authentication
- Users can register or sign in to access the calculator and consultation features.
- The site uses Supabase for authentication.

### Subscription
- The platform offers a one-time payment for 14 days of full access.
- Pricing is displayed in local currency using detected country and exchange rates.
- Payment processing is handled by Stripe.
- The subscription is not recurring.
- Access expires 14 days from purchase.

### Payment Behavior
- The success page verifies payment via `/api/verify-payment`.
- The site tracks purchases with Meta Pixel if available.
- On successful payment, subscription activation is verified by checking the user’s subscription status.
- If verification fails, the site retries up to three times.

### Success Page Messaging
- Success: "You're all set! Your 14-day full access is now active."
- Access expires: displays the expiry date.
- Unlocked features:
  - Full graft estimates based on the Norwood scale
  - Female pattern & hair texture adjustments
  - Cost range in local currency
  - 3D scalp area visualization
  - Specialist consultation form
  - Hair loss FAQ library
- Next steps:
  1. Use the 3D model to select affected scalp areas.
  2. Pick your Norwood pattern from the grid.
  3. Submit a specialist consultation form.
- CTA: *Go to Calculator →*

### Error state
- If payment verification fails, message: "Unable to verify payment." and offers *Try Again*.

## Legal and Policy Pages

### Cookie Policy
- Title: *Cookie Policy*
- Subtitle: "This policy explains how ArtisticBuz uses cookies and similar technologies, what data they collect, and how you can manage your preferences."
- Last updated: April 21, 2026
- Effective date: April 21, 2026

#### Key sections
1. What Are Cookies?
   - Cookies are text files placed on your device.
   - Session cookies are deleted when you close the browser.
   - Persistent cookies remain until deleted.
   - First-party cookies come from ArtisticBuz.
   - Third-party cookies come from integrated services.

2. Types of Cookies We Use
   - Strictly Necessary: always active, essential for the platform.
     - `sb-*` from Supabase: authentication session token, duration session / 1 week.
     - `cookie-consent`: stores consent choice, duration 1 year.
   - Analytics & Performance: requires consent.
     - `_fbp` from Meta: conversion tracking via Meta Pixel, duration 90 days.
     - `_fbc` from Meta: click ID for ad attribution, duration 90 days.
   - The site does not use cookies for targeted advertising or share cookie data for profiling.

3. Local Storage & Browser Data
   - Uses `localStorage` for non-personal data stored locally.
   - Data is never transmitted to servers.
   - Keys include `ab_calc_history` and `ab_currency_*`.
   - Users can clear localStorage in browser settings.

4. Third-Party Cookies
   - Supabase: session cookies for authentication.
   - Meta Pixel: conversion tracking and anonymized event signals.
   - Stripe: fraud-detection cookies during checkout.
   - The site advises users to review third-party privacy policies.

5. Your Consent
   - Cookie consent banner appears on first visit.
   - Clicking "Accept" consents to analytics cookies.
   - Strictly necessary cookies do not require consent.
   - Users can withdraw consent by clearing cookies.

6. Managing & Disabling Cookies
   - Manage cookies via browser settings.
   - Meta tracking opt-out via Facebook Ad Preferences or DAA.
   - Disabling necessary cookies prevents login and core functionality.

7. Policy Updates
   - Policy updates are reflected by updating the Last Updated date.
   - Significant changes may be shown via notification or consent banner.

8. Contact Us
   - Company: Buzlin Holdings Inc. (operating as ArtisticBuz)
   - Location: Edmonton, Alberta, Canada
   - Email: info@artisticbuz.com
   - Website: buzlinholdingsinc.com

### Privacy Policy
- Title: *Privacy Policy*
- Subtitle: "We are committed to protecting your personal information and being transparent about what we collect and why. This policy applies to all users of the ArtisticBuz platform."
- Last updated: April 21, 2026
- Effective date: April 21, 2026

#### Key sections
1. Introduction
   - ArtisticBuz operates the hair graft calculator and related services.
   - By using ArtisticBuz, users consent to the practices described.

2. Who We Are
   - Buzlin Holdings Inc., Alberta, Canada.
   - Email: info@artisticbuz.com.

3. Information We Collect
   - Directly provided information: account registration, consultation form, communications.
   - Payment information: processed by Stripe, no card details stored.
   - Calculator usage data: hair loss pattern selections, hair type, density, gender preference.
   - Automatically collected data: IP address, browser data, referring URL, pages visited, cookies.

4. How We Use Your Information
   - Service delivery: accounts, payments, access management.
   - Consultation routing: submission to specialist team.
   - Currency localization: display pricing in local currency.
   - Communications: transactional emails.
   - Security and fraud prevention.
   - Analytics.
   - Legal compliance.
   - Medical disclaimer: estimates are informational only; not medical advice.

5. Data Sharing & Third Parties
   - We do not sell personal information.
   - Providers: Supabase, Stripe, Sanity, Meta, ipapi.co, ExchangeRate-API.
   - Data sharing may occur for legal compliance or safety.

6. Data Retention
   - Account data retained while active and up to 2 years after deletion.
   - Subscription records retained 7 years.
   - Consultation submissions retained 3 years.
   - Calculation history stored only in localStorage.
   - Data deletion requests handled via info@artisticbuz.com.

7. Data Security
   - TLS/SSL for data in transit.
   - Supabase Row-Level Security policies.
   - Stripe PCI-DSS compliant payment processing.
   - Server-side email recipient validation.
   - No credentials stored in source code.

8. Your Rights
   - Access, rectification, erasure, restriction, portability, objection, withdraw consent.
   - Requests handled via info@artisticbuz.com.

9. International Transfers
   - Service providers may process data outside Canada.
   - Safeguards include contractual clauses and provider agreements.

10. Children’s Privacy
   - Not directed to individuals under 18.
   - Do not knowingly collect from minors.

11. Policy Updates
   - Updates reflected by the Last Updated date.
   - Continued use signifies acceptance.

12. Contact Us
   - Company: Buzlin Holdings Inc. (operating as ArtisticBuz)
   - Location: Edmonton, Alberta, Canada
   - Email: info@artisticbuz.com
   - Website: buzlinholdingsinc.com

### Terms of Service
- Title: *Terms of Service*
- Subtitle: "Please read these terms carefully before using ArtisticBuz. By accessing our platform, you agree to be bound by the terms described below."
- Last updated: April 21, 2026
- Effective date: April 21, 2026

#### Key sections
1. Acceptance of Terms
   - These Terms are a binding agreement between you and Buzlin Holdings Inc.
   - Use of ArtisticBuz indicates acceptance of these Terms and the Privacy Policy.

2. About ArtisticBuz
   - Platform features: graft estimation calculator, local pricing estimates, 3D scalp visualization, consultation submission, educational content, partner clinic directory.

3. Eligibility
   - Must be at least 18 years old.
   - Available globally but some features may be regionally restricted by Stripe.

4. Accounts & Registration
   - Must provide accurate information.
   - Maintain password security.
   - Notify info@artisticbuz.com of unauthorized access.
   - Accounts may be suspended or terminated for abuse.

5. Subscriptions & Payments
   - 14-day access plan via one-time payment.
   - Payments processed by Stripe.
   - Prices displayed in local currency and may change.
   - Refund policy: all sales final and non-refundable except as required by law.

6. Permitted Use
   - Personal, non-commercial use only.
   - Prohibited actions include resale, scraping, unauthorised access, malicious content, impersonation, and legal violations.

7. Medical Disclaimer
   - Information is for educational purposes only.
   - Not medical advice, diagnosis, or treatment.
   - Estimates are based on general frameworks and averages.
   - Consult a qualified medical professional before making decisions.

8. Intellectual Property
   - Content is owned by Buzlin Holdings Inc. or licensors.
   - Protected by intellectual property laws.
   - Users are granted a limited, non-exclusive license for personal use only.

9. User-Submitted Content
   - Users must own rights to content they submit.
   - The company may use submissions solely to provide requested services.
   - Content is not published publicly without consent.

10. Third-Party Services
   - Integrates Supabase, Stripe, Sanity, Meta, etc.
   - Subject to third-party terms.
   - External links are not endorsed.

11. Disclaimer of Warranties
   - Provided "as is" without warranties.
   - No guarantee of uninterrupted or error-free service.

12. Limitation of Liability
   - No liability for indirect, incidental, special, consequential or punitive damages.
   - Liability capped at the greater of the amount paid in the prior 12 months or CAD $50.

13. Indemnification
   - Users indemnify Buzlin Holdings Inc. for claims arising from use or violation of Terms.

14. Termination
   - Accounts may be suspended or terminated for violations or fraud.
   - Users may delete accounts via info@artisticbuz.com.
   - Termination does not guarantee refunds.

15. Governing Law
   - Governed by the laws of Alberta, Canada.
   - Disputes subject to Alberta courts.

16. Changes to Terms
   - Terms may be updated at any time.
   - Continued use indicates acceptance.

17. Contact
   - Company: Buzlin Holdings Inc. (operating as ArtisticBuz)
   - Location: Edmonton, Alberta, Canada
   - Email: info@artisticbuz.com
   - Website: buzlinholdingsinc.com

## Navigation & Layout

### Header
- Logo text: Hair Graft Calculator
- Navigation links: Home, Blogs
- User account dropdown with email and sign out action.
- Mobile menu includes the same links.

### Footer
- Brand description: "ArtisticBuz provides medically guided hair restoration solutions, combining advanced technology with aesthetic precision to help you restore hair, confidence, and self-image."
- Contact:
  - Edmonton, Alberta, Canada
  - info@artisticbuz.com
- Social: LinkedIn, Instagram, Facebook.
- Footer links: Privacy Policy, Terms of Service, Cookie Policy.
- Copyright: © 2025 ArtisticBuz. All rights reserved.
- Note: ArtisticBuz is a product of Buzlin Holdings Inc.

## Chatbot / Voice Agent Training

### What the AI should know
- ArtisticBuz helps users estimate hair graft requirements and transplant costs.
- It is not a medical service or doctor.
- The calculator provides guidance based on hair loss pattern, gender preference, hair texture, and density.
- A paid 14-day full access plan is required to use the full calculator and consultation features.
- Payments are processed by Stripe; card details are not stored by ArtisticBuz.
- The site offers specialist consultations through a form.
- Supabase powers authentication and user sessions.
- Meta Pixel is used for conversion tracking when cookies are accepted.
- Local currency pricing is shown based on detected location.
- The site includes blogs, partner clinic listings, and FAQ resources.
- The service is provided on an "as is" basis and does not replace professional medical advice.

### Recommended training topics for the AI
- Hair graft calculator workflow
- Subscription and access details
- Payment and refund policy
- Privacy, cookies, and data handling
- Contact details and support process
- Medical disclaimer and limitations
- Partner clinic information
- Blog content and insights scope
- Navigation points and page titles

### Example customer questions and ideal responses

#### About the service
- Q: "What is ArtisticBuz?"
  A: "ArtisticBuz is a professional hair restoration platform that offers a hair graft calculator, local cost estimates, blog insights, and specialist consultation support. It helps you estimate graft needs and expected costs based on your hair loss pattern, hair type, and desired density."

- Q: "Can I get a real transplant through the website?"
  A: "No. ArtisticBuz provides information, estimates, and consultation submissions. It does not perform surgeries directly. The platform helps you understand your options and connect with partner clinics."

#### Calculator use
- Q: "How does the calculator work?"
  A: "The calculator combines your selected hair loss areas, gender preference, hair texture, and desired density to estimate graft counts and a cost range in your local currency. It's a clinically guided estimate, not a medical diagnosis."

- Q: "Do I need to sign in?"
  A: "Yes. You need an account to use the full calculator and to save your estimates."

- Q: "What information do I need to enter?"
  A: "You select the affected scalp areas, choose your hair texture, desired density, and reference pattern (neutral/male/female). Then the system generates an estimate."

#### Subscription and payments
- Q: "How much does it cost?"
  A: "Pricing is shown in your local currency based on your detected country. The platform offers a one-time payment for 14 days of full access."

- Q: "Is the subscription recurring?"
  A: "No. The 14-day access is a one-time payment and does not renew automatically."

- Q: "What if payment verification fails?"
  A: "The site retries verification up to three times. If it still fails, it shows an error and suggests trying again or contacting support at info@artisticbuz.com."

- Q: "Can I get a refund?"
  A: "All sales are final and non-refundable, except where required by applicable law. If you believe you are entitled to a refund, contact support within 14 days of purchase."

#### Privacy and security
- Q: "What data do you collect?"
  A: "We collect account info, consultation form details, calculator inputs, and automatically collected data like IP address, browser details, and cookies. Payment details are handled by Stripe and card data is not stored by ArtisticBuz."

- Q: "What are cookies used for?"
  A: "Cookies are used for authentication, storing consent choices, and analytics if you accept them. Strictly necessary cookies are always active to allow login and site functionality."

- Q: "How do I contact support?"
  A: "Email info@artisticbuz.com for questions about accounts, privacy, payments, or consultations."

#### Consultation and partners
- Q: "How do I request a consultation?"
  A: "Sign in, purchase access, and open the specialist consultation form from the calculator page. Fill in your details and the selected graft estimate will be included."

- Q: "Do you work with clinics?"
  A: "Yes. ArtisticBuz works with vetted partner clinics around the world. Clinic listings show name, location, logo, and website."

#### Medical disclaimer
- Q: "Are the graft counts exact?"
  A: "No. The graft counts are estimates based on general clinical frameworks. Actual graft requirements depend on a full medical assessment by a qualified professional."

- Q: "Is this medical advice?"
  A: "No. ArtisticBuz provides informational estimates only and is not a substitute for professional medical advice. Always consult a licensed medical professional before making treatment decisions."

## AI Chatbot Behavior Guidance

### Tone and style
- Professional, helpful, and empathetic.
- Clear that ArtisticBuz is informational and not a medical provider.
- Encourage consultation with medical professionals.
- Be transparent about subscription requirements and payment handling.

### When responding
- Reference the site’s features and policies.
- Offer the support email for complex or account-related issues.
- Use exact phrasing from the website when possible for consistency.
- Avoid promising clinical outcomes or treatment results.

### Fallback guidance
- If the user asks about booking surgery, clarify that ArtisticBuz is a guidance platform and referrals are to partner clinics.
- If asked about refund or cancellations, explain the one-time 14-day access policy and legal exceptions.
- If asked about data privacy or cookies, summarize the relevant policy sections and point them to the Privacy Policy or Cookie Policy pages.

## Internal content notes

### Technical details
- The widget script is loaded globally in the layout.
- Meta Pixel is loaded after page interaction for conversion tracking.
- The site detects country via ipapi.co and exchange rates via ExchangeRate-API.
- Content management and blogs are provided by Sanity.
- Authentication uses Supabase.
- Payment verification occurs in the `/api/verify-payment` endpoint.

### Important disclaimers
- The site content is not medical advice.
- Estimates are based on generalised clinical frameworks.
- Real results vary by individual and clinical assessment.
- Users should consult qualified medical professionals.

## Contact and support links
- info@artisticbuz.com
- buzlinholdingsinc.com
- Privacy Policy: /privacy-policy
- Terms of Service: /terms-of-service
- Cookie Policy: /cookie-policy

---
