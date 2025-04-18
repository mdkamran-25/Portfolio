import React from 'react';

const ShippingAndDelivery = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-orange-500">Shipping and Delivery Policy</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">1. Shipping Information</h2>
        <p className="mb-4">
          We strive to deliver your orders as quickly and efficiently as possible. This policy outlines our shipping and delivery practices to help you understand when and how you will receive your order.
        </p>
        
        <h3 className="mt-4 text-lg font-medium text-white">1.1 Processing Time</h3>
        <p className="mb-4">
          All orders are processed within 1-3 business days (excluding weekends and holidays) after receiving your order confirmation email. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
        </p>
        
        <h3 className="mt-4 text-lg font-medium text-white">1.2 Shipping Rates & Delivery Estimates</h3>
        <p className="mb-4">
          Shipping charges for your order will be calculated and displayed at checkout. Delivery estimates are as follows:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Standard Shipping: 5-10 business days</li>
          <li>Express Shipping: 2-5 business days</li>
          <li>International Shipping: 10-20 business days (varies by country)</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">2. Shipping Carriers</h2>
        <p className="mb-4">
          We use the following carriers to deliver our orders:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>USPS (United States Postal Service)</li>
          <li>FedEx</li>
          <li>UPS</li>
          <li>DHL (for international shipments)</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">3. Order Tracking</h2>
        <p className="mb-4">
          A tracking number will be sent to your email address once your order has shipped. You can use this tracking number to track your order on the carrier's website.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">4. Shipping Restrictions</h2>
        <p className="mb-4">
          We currently ship to most countries worldwide. However, there are some restrictions:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>We do not ship to P.O. boxes</li>
          <li>Some products may not be available for international shipping</li>
          <li>Additional customs fees may apply for international shipments</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">5. Delivery Issues</h2>
        <p className="mb-4">
          If you experience any issues with the delivery of your order, please contact our customer service team. Common issues include:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Delayed delivery</li>
          <li>Damaged package</li>
          <li>Missing items</li>
          <li>Wrong address</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">6. Digital Products</h2>
        <p className="mb-4">
          For digital products, you will receive an email with download instructions or access credentials immediately after your payment is processed. No physical shipping is required for digital products.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our shipping and delivery policy, please contact us:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email: shipping@example.com</li>
          <li>Phone: +1 (234) 567-890</li>
          <li>Contact form on our website</li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingAndDelivery; 