const emailMessage = (userName, email, OTP) => {
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
    invoiceId,
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
    paymentId,
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

  // Format traveler list
  const travelerList = travelers.map((t, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${t.fullName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${t.gender}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${t.email}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${t.phone}</td>
    </tr>
  `).join("");

  // Format flights
  const flightList = flights.map((f, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${f.flightFrom} → ${f.flightTo}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${f.departureTime} - ${f.arrivalTime}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">€${f.price}</td>
    </tr>
  `).join("");

  // Format insurance
  const insuranceList = insurance.map((ins, i) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${i + 1}.</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">${ins.insuranceName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${lightText};">${ins.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${textColor};">€${ins.price}</td>
    </tr>
  `).join("");

  // Format included items
  const includedItems = packageDetails.includeItems?.map(item => `
    <li style="margin-bottom: 10px; position: relative; padding-left: 25px; color: ${textColor};">
      <span style="position: absolute; left: 0; color: ${successColor};">✓</span> 
      <strong style="color: ${primaryDark};">${item.name}:</strong> ${item.text}
    </li>
  `).join("") || `<li style="color: ${lightText};">No included items specified</li>`;

  // Format excluded items
  const excludedItems = packageDetails.notIncludeItems?.map(item => `
    <li style="margin-bottom: 10px; position: relative; padding-left: 25px; color: ${textColor};">
      <span style="position: absolute; left: 0; color: ${secondaryColor};">✗</span> 
      <strong style="color: ${primaryDark};">${item.name}:</strong> ${item.text}
    </li>
  `).join("") || `<li style="color: ${lightText};">No excluded items specified</li>`;

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: auto; background: white; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #eee;">
      <!-- Header -->
      <div style="background: ${primaryColor}; padding: 30px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">BOOKING CONFIRMATION</h1>
        <p style="margin: 8px 0 0; font-size: 16px; font-weight: 300; opacity: 0.9;">Your travel plans are secured</p>
      </div>

      <!-- Confirmation badge -->
      <div style="background: white; text-align: center; margin-top: -15px; margin-bottom: 20px;">
        <div style="display: inline-block; background: ${successColor}; color: white; padding: 8px 25px; border-radius: 20px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ✓ Payment Successful
        </div>
      </div>

      <!-- Main content -->
      <div style="padding: 0 25px 25px;">
        <!-- Invoice summary -->
        <div style="background: ${primaryLight}; border-left: 4px solid ${primaryColor}; border-radius: 0 4px 4px 0; padding: 20px; margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div>
              <h2 style="margin: 0 0 5px 0; color: ${primaryDark}; font-size: 18px;">INVOICE #${invoiceId}</h2>
              <p style="margin: 0; color: ${lightText}; font-size: 14px;">Thank you for your booking</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0 0 5px 0; color: ${lightText}; font-size: 13px;">Booking Date</p>
              <p style="margin: 0; font-weight: 500; color: ${textColor};">${orderDate}</p>
            </div>
          </div>
          <div style="display: flex; gap: 20px; margin-top: 15px;">
            <div style="flex: 1;">
              <p style="margin: 0 0 5px 0; color: ${lightText}; font-size: 13px;">Departure Date</p>
              <p style="margin: 0; font-weight: 500; color: ${textColor};">${tourDate}</p>
            </div>
            <div style="flex: 1;">
              <p style="margin: 0 0 5px 0; color: ${lightText}; font-size: 13px;">Total Amount</p>
              <p style="margin: 0; font-weight: 500; color: ${textColor};">€${totalAmount}</p>
            </div>
          </div>
        </div>

        <!-- Two column layout -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
          <!-- Customer details -->
          <div style="flex: 1;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">Your Information</h3>
            <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 15px;">
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Name:</strong> ${customerName}</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Email:</strong> ${email}</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Phone:</strong> ${customerPhone || 'Not provided'}</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Address:</strong> ${customerAddress.address || 'Not provided'}, ${customerAddress.city || ''}, ${customerAddress.country || ''}</p>
            </div>
          </div>

          <!-- Package details -->
          <div style="flex: 1;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">Tour Details</h3>
            <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 15px;">
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Tour:</strong> ${packageDetails.name}</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Destination:</strong> ${packageDetails.destination}, ${packageDetails.country}</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Duration:</strong> ${packageDetails.duration?.days} days / ${packageDetails.duration?.nights} nights</p>
              <p style="margin: 10px 0; color: ${textColor};"><strong style="color: ${secondaryColor}; display: inline-block; width: 80px;">Hotel:</strong> ${packageDetails.hotelName || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <!-- Travelers section -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">Travelers (${numberOfPersons})</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
              <thead>
                <tr style="background: ${primaryLight};">
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">#</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Full Name</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Gender</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Email</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Phone</th>
                </tr>
              </thead>
              <tbody>
                ${travelerList}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Flights section -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">Flight Details</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
              <thead>
                <tr style="background: ${primaryLight};">
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">#</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Route</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Time</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Price</th>
                </tr>
              </thead>
              <tbody>
                ${flightList}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Insurance section -->
        ${insurance.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">Insurance</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px; background: white; border: 1px solid #eee; border-radius: 4px;">
              <thead>
                <tr style="background: ${primaryLight};">
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">#</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Name</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Description</th>
                  <th style="padding: 12px; text-align: left; color: ${primaryDark}; font-weight: 600; border-bottom: 2px solid ${primaryColor};">Price</th>
                </tr>
              </thead>
              <tbody>
                ${insuranceList}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        <!-- Included/Excluded section -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">What's Included</h3>
            <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 15px;">
              <ul style="margin: 0; padding-left: 0; list-style: none;">
                ${includedItems}
              </ul>
            </div>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: ${primaryDark}; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">What's Not Included</h3>
            <div style="background: white; border: 1px solid #eee; border-radius: 4px; padding: 15px;">
              <ul style="margin: 0; padding-left: 0; list-style: none;">
                ${excludedItems}
              </ul>
            </div>
          </div>
        </div>

        <!-- Payment summary -->
        <div style="background: ${primaryColor}; border-radius: 4px; padding: 20px; color: white;">
          <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px;">Payment Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="opacity: 0.9;">Package Price:</span>
            <span style="font-weight: 500;">€${packageAmount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="opacity: 0.9;">Flight Price:</span>
            <span style="font-weight: 500;">€${flightPrice}</span>
          </div>
          ${insurance.length > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="opacity: 0.9;">Insurance:</span>
            <span style="font-weight: 500;">€${insurance.reduce((sum, ins) => sum + parseFloat(ins.price), 0)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 18px; font-weight: 600; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">
            <span>Total Paid:</span>
            <span>€${totalAmount}</span>
          </div>
          <p style="margin-bottom: 0; margin-top: 20px; font-size: 13px; opacity: 0.8;"><strong>Payment Reference:</strong> ${paymentId}</p>
        </div>

        <!-- Next steps -->
        <div style="background: ${primaryLight}; border-left: 4px solid ${primaryColor}; border-radius: 0 4px 4px 0; padding: 20px; margin-top: 25px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; color: ${primaryDark}; font-size: 16px; font-weight: 600;">Next Steps</h3>
          <ol style="margin: 0; padding-left: 20px; color: ${textColor};">
            <li style="margin-bottom: 8px;">You'll receive a detailed itinerary 7 days before departure</li>
            <li style="margin-bottom: 8px;">Check your email for important updates about your trip</li>
            <li>Contact our support team if you have any questions</li>
          </ol>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: ${lightText}; font-size: 13px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="margin: 0 0 10px 0;">Thank you for choosing us for your travel plans.</p>
          <p style="margin: 0;">
            <a href="#" style="color: ${primaryColor}; text-decoration: none; margin: 0 10px;">Contact Support</a> | 
            <a href="#" style="color: ${primaryColor}; text-decoration: none; margin: 0 10px;">Manage Booking</a> | 
            <a href="#" style="color: ${primaryColor}; text-decoration: none; margin: 0 10px;">Terms & Conditions</a>
          </p>
          <p style="margin: 15px 0 0; font-size: 12px;">
            This email was sent to ${email}. If you didn't make this booking, please contact us immediately.
          </p>
        </div>
      </div>
    </div>
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
