'use client';

import Link from 'next/link';

export default function AGB() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <Link href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
        >
          Zurück zur Startseite
        </Link>
      </div>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Geltungsbereich</h2>
        <p>Diese AGB gelten für alle Bestellungen und Käufe, die über den Online-Shop von Pokebuy, 3123 Belp, Schweiz, getätigt werden.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Vertragsschluss</h2>
        <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des Buttons "Kaufen" geben Sie eine verbindliche Bestellung ab. Der Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar nach dem Erhalt Ihrer Bestellung annehmen.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Preise und Zahlung</h2>
        <p>Alle Preise sind in Schweizer Franken (CHF) angegeben und verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt per Kreditkarte oder andere angebotene Zahlungsmethoden.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Lieferung</h2>
        <p>Die Lieferung erfolgt innerhalb der Schweiz. Die Lieferzeit beträgt in der Regel 3-5 Werktage. Bei Verzögerungen werden wir Sie umgehend informieren.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Gewährleistung</h2>
        <p>Es gelten die gesetzlichen Gewährleistungsrechte.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Datenschutz</h2>
        <p>Wir verarbeiten Ihre personenbezogenen Daten gemäß unserer Datenschutzerklärung.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Anwendbares Recht und Gerichtsstand</h2>
        <p>Es gilt schweizerisches Recht unter Ausschluss des UN-Kaufrechts.</p>
      </section>

      <p className="mt-8 text-sm text-gray-600">
        Stand: 1. März 2024
      </p>
    </div>
  );
}
