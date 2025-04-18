import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
          <p>
            We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
          <p>We may collect the following information:</p>
          <ul className="list-disc pl-6">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Demographic information such as preferences and interests</li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
          <p>We use this information to:</p>
          <ul className="list-disc pl-6">
            <li>Improve our website and services</li>
            <li>Customize the website according to your interests</li>
            <li>Send you promotional emails about new products, special offers, or other information which we think you may find interesting</li>
            <li>Contact you for market research purposes</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Security</h2>
          <p>
            We are committed to ensuring that your information is secure. We have implemented suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online to prevent unauthorized access or disclosure.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Cookies</h2>
          <p>
            A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
          </p>
          <p>
            We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page traffic and improve our website in order to tailor it to customer needs.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Links to Other Websites</h2>
          <p>
            Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Controlling Your Personal Information</h2>
          <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
          <ul className="list-disc pl-6">
            <li>Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
            <li>If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-none pl-6">
            <li>Email: privacy@example.com</li>
            <li>Phone: +1 (234) 567-890</li>
            <li>Address: 123 Privacy Street, Security City, 12345</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 