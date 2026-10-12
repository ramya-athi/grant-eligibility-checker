# Intent

## Problem

An eligibility checker for the Green Home Grant, a fictional scheme that funds insulation and heat pumps. Today, citizens phone a call centre and wait around 35 minutes to find out whether they qualify. This service replaces that call.

## Who it is for

Citizens only. There are no staff, call centre or helper users.

## What success looks like

When a citizen completes the service, they should:

- Know whether they are Eligible, Partially Eligible, or Not Eligible for the Green Home Grant.
- Know the maximum grant amount they may be entitled to.
- Know the next steps to apply or seek further support.
- Receive an answer within 2 minutes, without needing to call the contact centre.

We will know the service is working through:

- Reduced call-centre demand.
- Citizens receiving an eligibility decision in under 2 minutes.
- High completion rate of the online checker.
- Fewer citizens abandoning the process.
- Positive user feedback and satisfaction.
- Reduced waiting times for grant enquiries.
- Higher number of successful grant applications from eligible citizens.

Grant amounts and next steps are placeholders for now. The result page gives indicative grant amounts and directs users to a fictional application service. Amounts and the application process will be refined later if detailed policy rules are provided.

### In scope
1. GOV.UK-style service layout (header, phase banner, cookie banner, footer)

2. Start page with service information and Start Now button

3. 5 eligibility questions, each with help text:
   - Housing situation
   - Household income
   - Property type
   - Insulation
   - Main heating source

4. Check Your Answers page, with a Change link on each answer that returns the user to the summary after continuing

5. Eligibility decision (Eligible / Partially Eligible / Not Eligible)

6. Result page showing grant amount and next steps

7. Basic navigation (Continue, Back, Change links), with answers retained throughout the journey

8. Basic required-field validation

9. Accessibility requirements:
   - WCAG 2.2 AA compliant
   - Semantic HTML
   - Associated labels for all form controls
   - Keyboard navigation support
   - Visible focus indicators
   - Sufficient colour contrast
   - Screen-reader friendly content
   - Responsive layout at 320px width

10. GOV.UK Design System patterns:
    - One thing per page
    - GOV.UK Summary List
    - GOV.UK Button component styling
    - GOV.UK Back link pattern
    - GOV.UK content and language guidance
    - Consistent page headings and structure

11. Performance requirements:
    - Fast page load times
    - Responsive on desktop, tablet and mobile
    - State maintained throughout the user journey
    - No unnecessary page reloads
    - Cross-browser support (Chrome, Edge, Firefox, Safari)

12. User outcome:
    - Citizens receive an eligibility decision in under 2 minutes
    - Users understand why they received their result
    - Users can proceed without contacting the call centre

### Eligibility outcomes

**Not Eligible**

- Anyone who rents their home or lives in social housing. Only homeowners (single or joint owners) can qualify.
- Anyone with a household income of £60,000 or more.

**Full Eligible**: all of the following:

- Homeowner (single or joint owner)
- Income below £40,000
- Detached, semi-detached, terraced, mid-terraced or bungalow
- No insulation
- Gas boiler or electric heating

**Partially Eligible**: any homeowner with income below £60,000 who is not fully eligible. This includes:

- Income partial: household income of £40,000 to £59,999, reduced grant amount.
- Heat pump partial: the property already has insulation and the main heating is gas boiler or electric heating. Outcome: Eligible for Heat Pump Support Only.
- Insulation partial: the property has no insulation and the main heating is oil, biofuel, heat pump, solar or other. Outcome: Eligible for Insulation Support Only.
- Flat or studio: flats and studios may have fewer improvement options than houses, so they qualify for reduced support rather than being excluded.

## Out of scope

- Submitting an actual Green Home Grant application
- User accounts and sign in
- Saving progress between visits
- Uploading evidence or documents
- Staff or call-centre tools
- Payment processing
- Real grant approval decisions
- Integration with government systems or databases
- Property verification checks
- Land Registry or council data lookups
- Email or SMS notifications
- Case management functionality
- Grant application tracking
- Appeals or reconsideration process
- Multi-language support
- Live chat support
- Advanced validation and GOV.UK error summaries (Phase 2)
