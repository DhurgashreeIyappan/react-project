export const getAbout = async (req, res) => {
  res.json({
    title: 'About RentNest',
    body: 'We connect renters with quality, verified properties and make renting simple, transparent, and stress-free.'
  });
};

export const getContactInfo = async (req, res) => {
  res.json({
    email: 'info@rentnest.com',
    phone: '+1 (555) 123-4567',
    address: '123 Rental Street, City, State 12345'
  });
};


