import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to our website. These terms and conditions outline the rules and regulations for the use of our website.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use our website if you do not accept all of the terms and conditions stated on this page.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Intellectual Property Rights</h2>
          <p>
            Other than the content you own, under these terms, we and/or our licensors own all the intellectual property rights and materials contained in this website.
          </p>
          <p>
            You are granted a limited license only for purposes of viewing the material contained on this website.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul className="list-disc pl-6">
            <li>Publishing any website material in any other media</li>
            <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
            <li>Publicly performing and/or showing any website material</li>
            <li>Using this website in any way that is, or may be, damaging to this website</li>
            <li>Using this website in any way that impacts user access to this website</li>
            <li>Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Your Content</h2>
          <p>
            In these terms and conditions, "Your Content" shall mean any audio, video, text, images or other material you choose to display on this website. By displaying Your Content, you grant us a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </p>
          <p>
            Your Content must be your own and must not be infringing on any third party's rights. We reserve the right to remove any of Your Content from this website at any time without notice.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. No Warranties</h2>
          <p>
            This website is provided "as is," with all faults, and we make no express or implied representations or warranties, of any kind related to this website or the materials contained on this website.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Limitation of Liability</h2>
          <p>
            In no event shall we, nor any of our officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort or otherwise.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Indemnification</h2>
          <p>
            You hereby indemnify to the fullest extent from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Severability</h2>
          <p>
            If any provision of these terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">9. Variation of Terms</h2>
          <p>
            We are permitted to revise these terms at any time as we see fit, and by using this website you are expected to review such terms on a regular basis to ensure you understand all terms and conditions governing the use of this website.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">10. Assignment</h2>
          <p>
            We shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these terms without any notification or consent required. However, you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">11. Entire Agreement</h2>
          <p>
            These terms, including any legal notices and disclaimers contained on this website, constitute the entire agreement between us and you in relation to your use of this website, and supersede all prior agreements and understandings with respect to the same.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">12. Governing Law & Jurisdiction</h2>
          <p>
            These terms will be governed by and interpreted in accordance with the laws of the State of [Your State], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State] for the resolution of any disputes.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <ul className="list-none pl-6">
            <li>Email: legal@example.com</li>
            <li>Phone: +1 (234) 567-890</li>
            <li>Address: 123 Legal Street, Terms City, 12345</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions; 