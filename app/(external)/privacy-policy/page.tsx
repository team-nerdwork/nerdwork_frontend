import React from "react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

const PrivacyPolicy = () => {
  return (
    <main className="bg-[#1d1d1d] text-white font-inter">
      <>
        <Navbar />
        <div className="max-w-[1000px] py-24 prose prose-lg mx-auto px-6">
          <h1 className="max-md:text-2xl text-4xl py-5 font-obostar text-center">
            Privacy Policy
          </h1>
          <p className="mb-3">
            <em>Last updated: 30th September, 2025</em>
          </p>
          <p>
            We value your privacy and are committed to protecting your personal
            data. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our comic viewing platform
            (“Nerdwork-Plus” henceforth implied as the “Platform”).
          </p>
          <hr className="my-5 h-0 border-t border-nerd-muted" />
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            1. Who We Are
          </h2>
          <p>
            This Platform allows users to be either <strong>creators</strong> or{" "}
            <strong>readers</strong> of comics. To use the Platform, you must
            create an account via Google Authentication.
          </p>
          <p>
            For privacy-related questions, please contact us at: <br />
            <strong>Email:</strong> nerdworkng@gmail.com
          </p>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            2. Data We Collect
          </h2>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, and
              profile picture (collected through Google Authentication).
            </li>
            <li>
              <strong>Payment Information:</strong> Wallet addresses for
              processing Web3 payments.
            </li>
            <li>
              <strong>Technical Data:</strong> Cookies or similar technologies
              may be used to improve functionality and security.
            </li>
          </ul>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            3. How We Use Your Data
          </h2>
          <p>We process your personal data only for the following purposes:</p>
          <ul>
            <li>To create and manage your user account.</li>
            <li>To enable creators and readers to use the Platform.</li>
            <li>To process payments using connected wallets.</li>
            <li>
              To ensure the security and proper functioning of the Platform.
            </li>
          </ul>
          <p>
            We do not use your data for marketing unless you give explicit
            consent.
          </p>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            4. Legal Basis for Processing
          </h2>
          <ul>
            <li>
              <strong>Consent:</strong> When you authorize Google to share your
              data with us.
            </li>
            <li>
              <strong>Contractual necessity:</strong> To provide you with the
              services you request (e.g., account management, payments).
            </li>
            <li>
              <strong>Legitimate interest:</strong> To maintain and improve the
              security and performance of the Platform.
            </li>
          </ul>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            5. Data Sharing and Third Parties
          </h2>
          <ul>
            <li>
              We do <strong>not sell or share</strong> your personal data with
              third parties for marketing.
            </li>
            <li>
              Payment processing is facilitated through Web3 wallets. Wallet
              addresses are collected but not linked to payment processors in a
              way that exposes personal information beyond the blockchain
              itself.
            </li>
            <li>
              Authentication is handled by Google. Data may be transferred
              internationally, but Google uses{" "}
              <strong>Standard Contractual Clauses (SCCs)</strong> and other
              safeguards to ensure GDPR compliance.
            </li>
          </ul>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            6. Data Retention
          </h2>
          <p>
            We retain your personal data only as long as your account is active.
            If you delete your account, we will remove or anonymize your
            personal data unless retention is required by law.
          </p>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            7. Data Security
          </h2>
          <p>
            We take appropriate technical and organizational measures to protect
            your data, including:
          </p>
          <ul>
            <li>Encrypted connections (SSL/TLS).</li>
            <li>Restricted access to personal data.</li>
            <li>Regular monitoring for security vulnerabilities.</li>
          </ul>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            8. Your Rights Under GDPR
          </h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li>
              <strong>Access</strong> - Request a copy of your data.
            </li>
            <li>
              <strong>Correction</strong> - Request corrections to inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Deletion</strong> - Request deletion of your data (“right
              to be forgotten”).
            </li>
            <li>
              <strong>Restriction</strong> - Limit how we process your data.
            </li>
            <li>
              <strong>Portability</strong> - Receive your data in a portable
              format.
            </li>
            <li>
              <strong>Objection</strong> - Object to processing based on
              legitimate interests.
            </li>
            <li>
              <strong>Withdraw Consent</strong> - Withdraw your consent at any
              time.
            </li>
          </ul>
          <p>
            To exercise your rights, please contact us at{" "}
            <strong>[Insert Support Email]</strong>.
          </p>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            9. International Data Transfers
          </h2>
          <p>
            Since we use Google Authentication, your data may be transferred
            outside the European Economic Area (EEA). Google ensures protection
            through <strong>Standard Contractual Clauses (SCCs)</strong> and
            other GDPR-compliant safeguards.
          </p>
          <h2 className="max-md:text-lg text-2xl my-5 font-obostar">
            10. Updates to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            significant changes, we will notify you by email. Please check this
            page regularly for updates.
          </p>
        </div>
        <Footer />
      </>
    </main>
  );
};

export default PrivacyPolicy;
