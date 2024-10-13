'use client';

import Link from 'next/link';

export default function Datenschutz() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
        <Link href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
        >
          Zurück zur Startseite
        </Link>
      </div>
      
      <p className="text-lg mb-6">
        Letzte Aktualisierung: 1. März 2024
      </p>
      <p className="text-base mb-6">
        Willkommen bei Pokebuy, Ihrem vertrauenswürdigen Pokémon-Karten-Shop in Belp, Bern. Der Schutz Ihrer persönlichen Daten hat für uns höchste Priorität. In dieser Datenschutzerklärung möchten wir Sie darüber informieren, wie wir mit Ihren Daten umgehen und welche Rechte Sie haben.
      </p>
      <p className="text-base mb-6">
        <strong>1. Verantwortliche Stelle:</strong> Pokebuy, Bahnhofstrasse 10, 3123 Belp, Schweiz
      </p>
      <p className="text-base mb-6">
        <strong>2. Datenerhebung und -verwendung:</strong> Wir erheben nur die Daten, die für die Abwicklung Ihrer Bestellungen und die Verbesserung unseres Services notwendig sind. Dazu gehören Name, Adresse, E-Mail und Zahlungsinformationen. Diese Daten werden ausschließlich zur Bestellabwicklung und Kundenbetreuung verwendet.
      </p>
      <p className="text-base mb-6">
        <strong>3. Datenspeicherung:</strong> Ihre Daten werden auf sicheren Servern in der Schweiz gespeichert und nicht an Dritte weitergegeben, es sei denn, dies ist für die Bestellabwicklung erforderlich (z.B. an Versanddienstleister).
      </p>
      <p className="text-base mb-6">
        <strong>4. Ihre Rechte:</strong> Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Kontaktieren Sie uns bei Fragen oder Anliegen.
      </p>
      <p className="text-base mb-6">
        <strong>5. Datensicherheit:</strong> Wir setzen modernste Sicherheitsmaßnahmen ein, um Ihre Daten vor unbefugtem Zugriff zu schützen. Trotzdem möchten wir Sie darauf hinweisen, dass die Datenübertragung im Internet nie 100% sicher sein kann.
      </p>
      <p className="text-base mb-6">
        <strong>6. Cookies:</strong> Unsere Website verwendet Cookies, um Ihnen ein optimales Einkaufserlebnis zu bieten. Sie können Ihren Browser so einstellen, dass er Sie über das Setzen von Cookies informiert.
      </p>
      <p className="text-base mb-6">
        <strong>7. Änderungen:</strong> Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Bitte überprüfen Sie diese Seite regelmäßig auf Änderungen.
      </p>
      <p className="text-base mb-6">
        <strong>Kontakt:</strong> Bei Fragen zur Verarbeitung Ihrer persönlichen Daten kontaktieren Sie uns bitte unter pokebuy@gmail.com oder schriftlich an unsere Geschäftsadresse.
      </p>
    </div>
  );
}
