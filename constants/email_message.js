const emailMessage = (userName, email, OTP) => {
  const persons = Math.max(Number(numberOfPersons) || 1, 1);
  const insuranceTotal = safeInsurance.reduce((sum, ins) => {
    const price = parseFloat(ins.price) || 0;
    return sum + price * persons;
  }, 0);

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://via.placeholder.com/150x50?text=TravelAgency" alt="TravelAgency Logo" style="max-width: 100%; height: auto;">
    </div>
    <h2 style="color: #007bff;">Welcome to TravelAgency!</h2>
    <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
    <p style="color: #333; font-size: 16px;">Thank you for signing up with TravelAgency. To complete your registration, please use the OTP code below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
    </div>
    <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
    <p style="color: #333; font-size: 16px;">Cheers,</p>
    <p style="color: #333; font-size: 16px;">The TravelAgency Team</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not sign up for TravelAgency, please disregard this email.</p>
  </div>
`;
};

const emailUpdateOTP = (userName, email, newOTP) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://via.placeholder.com/150x50?text=SocialApp" alt="SocialApp Logo" style="max-width: 100%; height: auto;">
      </div>
      <h2 style="color: #007bff;">Update OTP for SocialApp</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">We have received a request to update the OTP for your account on SocialApp. Please use the new OTP code below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${newOTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this update, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The SocialApp Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you are not expecting this OTP update, please disregard this email.</p>
    </div>
  `;
};

const emailForgotPasswordOTP = (userName, email, OTP) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://via.placeholder.com/150x50?text=SocialApp" alt="SocialApp Logo" style="max-width: 100%; height: auto;">
      </div>
      <h2 style="color: #007bff;">Forgot Password Request</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">You have requested to reset your password on SocialApp. Please use the OTP code below to proceed:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this password reset, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The SocialApp Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not initiate this password reset, please disregard this email.</p>
    </div>
  `;
};

const resendRegistrationOTPEmail = (userName, email, OTP) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://via.placeholder.com/150x50?text=SocialApp" alt="SocialApp Logo" style="max-width: 100%; height: auto;">
      </div>
      <h2 style="color: #007bff;">Resend Registration OTP</h2>
      <p style="color: #333; font-size: 18px;">Hi ${userName},</p>
      <p style="color: #333; font-size: 16px;">We noticed you requested a new OTP code for completing your registration on SocialApp. Please use the OTP code below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; font-size: 24px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${OTP}</div>
      </div>
      <p style="color: #333; font-size: 16px;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The SocialApp Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not sign up for SocialApp, please disregard this email.</p>
    </div>
  `;
};

// newsletter email
const emailNewsletter = (email) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://via.placeholder.com/150x50?text=TravelAgency" alt="TravelAgency Logo" style="max-width: 100%; height: auto;">
      </div>
      <h2 style="color: #007bff;">Welcome to TravelAgency!</h2>
      <p style="color: #333; font-size: 18px;">Hi there,</p>
      <p style="color: #333; font-size: 16px;">Thank you for subscribing to our newsletter. You will now receive the latest updates and offers from TravelAgency.</p>
      <p style="color: #333; font-size: 16px;">Cheers,</p>
      <p style="color: #333; font-size: 16px;">The TravelAgency Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">This email was sent to ${email}. If you did not subscribe to TravelAgency, please disregard this email.</p>
    </div>
  `;
};

// const paymentSuccessEmail = async (email, invoiceData) => {
//   console.log("Sending payment success email to:", email, invoiceData);
//   await sendEmail(
//     email, 
//     `Booking Confirmation - ${invoiceData.packageDetails.name}`, // More descriptive subject
//     paymentSuccessEmailNotification(email, invoiceData)
//   );
// };

const paymentSuccessEmailNotification = (email, invoiceData) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    orderDate,
    tourDate,
    packageDetails,
    packageAmount,
    flightPrice,
    totalAmount,
    travelers,
    flights,
    insurance,
    numberOfPersons,
  } = invoiceData;

  // Professional orange-based color scheme
  const primaryColor = '#E67C30';  // Warm, confident orange
  const primaryDark = '#D45B13';   // Darker orange for accents
  const primaryLight = '#FDF2E9';  // Very light orange for backgrounds
  const secondaryColor = '#5F6C7B'; // Cool gray for balance
  const accentColor = '#2C3E50';   // Dark blue-gray for contrast
  const successColor = '#27AE60';  // Green for positive confirmation
  const textColor = '#2D3436';     // Dark gray for readability
  const lightText = '#7F8C8D';     // Lighter gray for secondary text

  // Normalize optional lists
  const safeTravelers = Array.isArray(travelers) ? travelers : [];
  const safeFlights = Array.isArray(flights) ? flights : [];
  const safeInsurance = Array.isArray(insurance) ? insurance : [];

  // Format traveler list
  const travelerList = safeTravelers.map((t, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${t.fullName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${t.gender}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${t.email}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${t.phone}</td>
    </tr>
  `).join("");

  // Format flights
  const flightList = safeFlights.map((f, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${f.flightFrom} → ${f.flightTo}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${f.departureTime} - ${f.arrivalTime}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">€${f.price}</td>
    </tr>
  `).join("");

  // Only show insurances that contribute cost (>0)
  const displayedInsurance = safeInsurance.filter((ins) => (parseFloat(ins.price) || 0) > 0);

  // Format insurance
  const insuranceList = displayedInsurance.map((ins, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">${ins.insuranceName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${lightText}; font-family: 'Poppins', sans-serif;">${ins.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor}; font-family: 'Poppins', sans-serif;">€${ins.price}</td>
    </tr>
  `).join("");

  // Calculate insurance total: prefer actual charged amount derived from totals; fallback to selection sum
  const persons = Math.max(Number(numberOfPersons) || 1, 1);
  const selectionBasedInsurance = displayedInsurance.reduce((sum, ins) => {
    const price = parseFloat(ins.price) || 0;
    return sum + price * persons;
  }, 0);
  const derivedFromTotals = Math.max((Number(totalAmount) || 0) - (Number(packageAmount) || 0) - (Number(flightPrice) || 0), 0);
  const insuranceTotal = derivedFromTotals || selectionBasedInsurance;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 700px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #eee;">
        <!-- Header -->
        <div style="background: ${primaryColor}; padding: 35px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; font-family: 'Poppins', sans-serif;">BOOKING CONFIRMATION</h1>
          <p style="margin: 8px 0 0; font-size: 16px; font-weight: 300; opacity: 0.9; font-family: 'Poppins', sans-serif;">Your travel plans are secured</p>
        </div>

        <!-- Confirmation badge -->
        <div style="background: white; text-align: center; margin-top: -30px; margin-bottom: 25px; padding-top: 20px;">
          <div style="display: inline-block; background: ${successColor}; color: white; padding: 10px 30px; border-radius: 20px; font-size: 15px; font-weight: 600; box-shadow: 0 3px 8px rgba(0,0,0,0.1); font-family: 'Poppins', sans-serif;">
            ✓ Payment Successful
          </div>
        </div>

        <!-- Main content -->
        <div style="padding: 0 32px 32px;">
          <!-- Booking summary section -->
          <div style="margin-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; color: #2C3E50; font-size: 18px; font-weight: 600; letter-spacing: 0.3px; position: relative; padding-left: 12px;">
              <span style="position: absolute; left: 0; top: 5px; height: 16px; width: 4px; background: #E67C30; border-radius: 2px;"></span>
              BOOKING SUMMARY
            </h2>
            
            <div style="background: #F9F9F9; border-radius: 6px; padding: 20px;">
              <div style="display: flex; margin-bottom: 12px;">
                <div style="flex: 1; min-width: 120px;">
                  <p style="margin: 0; color: #7F8C8D; font-size: 13px; font-weight: 500;">Booking Date</p>
                  <p style="margin: 4px 0 0; color: #2D3436; font-weight: 500;">${orderDate}</p>
                </div>
                <div style="flex: 1;">
                  <p style="margin: 0; color: #7F8C8D; font-size: 13px; font-weight: 500;">Departure Date</p>
                  <p style="margin: 4px 0 0; color: #2D3436; font-weight: 500;">${tourDate}</p>
                </div>
              </div>
              
              <div style="border-top: 1px solid #EEEEEE; margin: 16px 0; padding-top: 16px;">
                <p style="margin: 0; color: #D45B13; font-size: 13px; font-weight: 600;">Total Amount</p>
                <p style="margin: 4px 0 0; color: #D45B13; font-size: 20px; font-weight: 700;">€${totalAmount}</p>
              </div>
            </div>
          </div>

          <!-- Two column layout -->
          <div style="display: flex; gap: 25px; margin-bottom: 30px; flex-wrap: wrap;">
            <!-- Customer details -->
            <div style="flex: 1; min-width: 250px;">
              <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Your Information</h3>
              <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 20px;">
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Name:</strong> ${customerName}</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Email:</strong> ${email}</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Phone:</strong> ${customerPhone || 'Not provided'}</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Address:</strong> ${customerAddress.address || 'Not provided'}, ${customerAddress.city || ''}, ${customerAddress.country || ''}</p>
              </div>
            </div>

            <!-- Package details -->
            <div style="flex: 1; min-width: 250px;">
              <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Tour Details</h3>
              <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 20px;">
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Tour:</strong> ${packageDetails.name}</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Destination:</strong> ${packageDetails.destination}, ${packageDetails.country}</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Duration:</strong> ${packageDetails.duration?.days} days / ${packageDetails.duration?.nights} nights</p>
                <p style="margin: 12px 0; color: ${textColor}; font-family: 'Poppins', sans-serif;"><strong style="color: ${secondaryColor}; display: inline-block; width: 90px; font-weight: 500;">Hotel:</strong> ${packageDetails.hotelName || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <!-- Travelers section -->
          ${safeTravelers.length > 0 ? `<div style="margin-bottom: 30px;">` : ''}
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Travelers (${numberOfPersons})</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
                <thead>
                  <tr style="background: ${primaryLight};">
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">#</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Full Name</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Gender</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Email</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  ${travelerList}
                </tbody>
              </table>
            </div>
          ${safeTravelers.length > 0 ? `</div>` : ''}

          <!-- Flights section -->
          <div style="margin-bottom: 30px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Flight Details</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
                <thead>
                  <tr style="background: ${primaryLight};">
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">#</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Route</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Time</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${flightList}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Insurance section -->
          ${displayedInsurance.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; font-family: 'Poppins', sans-serif;">Insurance</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
                <thead>
                  <tr style="background: ${primaryLight};">
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">#</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Name</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Description</th>
                    <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor}; font-family: 'Poppins', sans-serif;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${insuranceList}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          <!-- Payment summary -->
          <div style="background: ${primaryColor}; border-radius: 4px; padding: 25px; color: white;">
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px; font-family: 'Poppins', sans-serif;">Payment Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">
              <span style="opacity: 0.9;">Package Price:</span>
              <span style="font-weight: 500;">€${packageAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">
              <span style="opacity: 0.9;">Flight Price:</span>
              <span style="font-weight: 500;">€${flightPrice}</span>
            </div>
          ${displayedInsurance.length > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">
              <span style="opacity: 0.9;">Insurance:</span>
              <span style="font-weight: 500;">€${insuranceTotal}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 18px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; font-family: 'Poppins', sans-serif;">
              <span>Total Paid:</span>
              <span>€${totalAmount}</span>
            </div>
          </div>

          ${invoiceData?.admin ? '' : ''}

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; color: ${lightText}; font-size: 14px; font-family: 'Poppins', sans-serif;">
            <p style="margin: 5px 0;">Thank you for choosing La Tua Fuga LowCost</p>
            <p style="margin: 5px 0;">For any questions, contact us at <a href="mailto:info@latuafugalowcost.it" style="color: ${primaryColor}; text-decoration: none;">info@latuafugalowcost.it</a></p>
            <p style="margin: 5px 0;"><a href="https://latuafugalowcost.it" style="color: ${primaryColor}; text-decoration: none;">www.latuafugalowcost.it</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  emailMessage,
  emailUpdateOTP,
  emailForgotPasswordOTP,
  resendRegistrationOTPEmail,
  emailNewsletter,
  paymentSuccessEmailNotification
};
