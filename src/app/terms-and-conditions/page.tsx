import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-orange-500">Terms and Conditions</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">2. Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials (information or software) on Kamran's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
          <li>Attempt to decompile or reverse engineer any software contained on Kamran's website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold text-white">3. Disclaimer</h2>
        <p className="mb-4">
          The materials on Kamran's website are provided on an 'as is' basis. Kamran makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">4. Limitations</h2>
        <p className="mb-4">
          In no event shall Kamran or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kamran's website, even if Kamran or a Kamran authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">5. Accuracy of Materials</h2>
        <p className="mb-4">
          The materials appearing on Kamran's website could include technical, typographical, or photographic errors. Kamran does not warrant that any of the materials on its website are accurate, complete, or current. Kamran may make changes to the materials contained on its website at any time without notice.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">6. Links</h2>
        <p className="mb-4">
          Kamran has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kamran of the site. Use of any such linked website is at the user's own risk.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">7. Modifications</h2>
        <p className="mb-4">
          Kamran may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
        
        <h2 className="mt-6 text-xl font-semibold text-white">8. Governing Law</h2>
        <p className="mb-4">
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions; 