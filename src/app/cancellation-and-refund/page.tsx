import React from 'react';

const CancellationAndRefund = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-orange-500">Cancellation and Refund Policy</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">1. Cancellation Policy</h2>
        <p className="mb-4">
          We understand that circumstances may arise that require you to cancel your order or service. Our cancellation policy is designed to be fair to both our customers and our business.
        </p>
        
        <h3 className="mt-4 text-lg font-medium text-white">1.1 Service Cancellation</h3>
        <p className="mb-4">
          For services that have not yet commenced:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Cancellations made 48 hours or more before the scheduled start time will receive a full refund.</li>
          <li>Cancellations made less than 48 hours before the scheduled start time will be charged 50% of the service fee.</li>
          <li>No refunds will be issued for cancellations made after the service has commenced.</li>
        </ul>
        
        <h3 className="mt-4 text-lg font-medium text-white">1.2 Product Cancellation</h3>
        <p className="mb-4">
          For product orders:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You may cancel your order at any time before it has been shipped.</li>
          <li>Once an order has been shipped, our return policy applies.</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">2. Refund Policy</h2>
        <p className="mb-4">
          We strive to ensure complete satisfaction with our products and services. Our refund policy is as follows:
        </p>
        
        <h3 className="mt-4 text-lg font-medium text-white">2.1 Service Refunds</h3>
        <p className="mb-4">
          Refunds for services will be processed according to our cancellation policy. Refunds will be issued to the original payment method used for the purchase.
        </p>
        
        <h3 className="mt-4 text-lg font-medium text-white">2.2 Product Refunds</h3>
        <p className="mb-4">
          For physical products:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Products may be returned within 30 days of delivery for a full refund.</li>
          <li>Products must be returned in their original condition, with all packaging and accessories.</li>
          <li>Shipping costs for returns are the responsibility of the customer unless the product was received damaged or incorrect.</li>
          <li>Refunds will be processed within 5-10 business days after receiving the returned item.</li>
        </ul>
        
        <h3 className="mt-4 text-lg font-medium text-white">2.3 Digital Products</h3>
        <p className="mb-4">
          For digital products:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Digital products are non-refundable once downloaded or accessed.</li>
          <li>If you experience technical issues with a digital product, please contact our support team for assistance.</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">3. How to Request a Cancellation or Refund</h2>
        <p className="mb-4">
          To request a cancellation or refund, please contact us using one of the following methods:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email: support@example.com</li>
          <li>Phone: +1 (234) 567-890</li>
          <li>Contact form on our website</li>
        </ul>
        <p className="mb-4">
          Please include your order number, the reason for cancellation/refund, and any relevant details to help us process your request quickly.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">4. Exceptions</h2>
        <p className="mb-4">
          We reserve the right to refuse cancellations or refunds in cases of fraud, abuse, or violation of our terms of service. Each case will be evaluated individually.
        </p>
      </div>
    </div>
  );
};

export default CancellationAndRefund; 