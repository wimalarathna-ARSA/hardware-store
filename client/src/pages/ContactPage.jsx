function ContactPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Contact</h1>
      </div>

      <div className="contact-grid">
        <div>
          <h2>Contact details</h2>
          <p>Phone: +91-98765-43210</p>
          <p>
            WhatsApp:{' '}
            <a href="https://wa.me/919876543210" target="_blank">
              Chat on WhatsApp
            </a>
          </p>
          <p>Email: store@example.com</p>
          <p>Store hours: Mon–Sat, 9:00 AM to 9:00 PM</p>
        </div>
        <div>
          <h2>Location</h2>
          <p>Colombo, Sri Lanka</p>
          <iframe
            title="Store location"
            src="https://maps.google.com/maps?q=Colombo,Sri%20Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="250"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

