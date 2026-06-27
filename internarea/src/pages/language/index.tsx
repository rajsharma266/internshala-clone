import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/userSession";

const translations: Record<string, Record<string, string>> = {
  en: {
    title: "Language Settings",
    subtitle: "Select your preferred website language",
    welcome: "Welcome to InternArea",
  },
  hi: {
    title: "Bhasha Settings",
    subtitle: "Apni pasandida website bhasha chuniye",
    welcome: "InternArea mein aapka swagat hai",
  },
  es: {
    title: "Configuracion de idioma",
    subtitle: "Seleccione su idioma preferido del sitio web",
    welcome: "Bienvenido a InternArea",
  },
  pt: {
    title: "Configuracoes de idioma",
    subtitle: "Selecione seu idioma preferido",
    welcome: "Bem-vindo ao InternArea",
  },
  zh: {
    title: "Chinese Language Settings",
    subtitle: "Select your preferred language",
    welcome: "Welcome to InternArea",
  },
  fr: {
    title: "Parametres de langue",
    subtitle: "Selectionnez la langue de votre site web",
    welcome: "Bienvenue sur InternArea",
  },
};

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "hi", label: "Hindi" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
  { code: "fr", label: "French" },
];

export default function LanguagePage() {
  const [language, setLanguage] = useState("en");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    const savedLanguage = window.localStorage.getItem("language") || "en";

    setLanguage(savedLanguage);
    setUserEmail(storedUser?.email || "");
  }, []);

  const handleLanguageChange = async (lang: string) => {
    if (lang === "fr") {
      const res = await fetch("/api/language/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const data = await res.json();
      setMessage(data.message);
      setShowOtp(true);
      return;
    }

    setLanguage(lang);
    window.localStorage.setItem("language", lang);
    setMessage("Language changed successfully");
  };

  const verifyFrenchOtp = async () => {
    const res = await fetch("/api/language/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, otp }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setLanguage("fr");
      window.localStorage.setItem("language", "fr");
      setShowOtp(false);
    }
  };

  const t = translations[language];

  return (
    <div className="page-shell">
      <div className="page-container max-w-3xl">
        <div className="section-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => handleLanguageChange(item.code)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                  language === item.code
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {item.label}
                {item.code === "fr" && (
                  <span className="ml-2 text-xs text-slate-500">OTP</span>
                )}
              </button>
            ))}
          </div>

          {showOtp && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="mb-3 text-sm font-medium text-slate-800">
                Enter the OTP sent to your registered email to enable French.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
              />
              <button
                onClick={verifyFrenchOtp}
                className="primary-button mt-4 w-full"
              >
                Verify French OTP
              </button>
            </div>
          )}

          {message && (
            <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          <div className="mt-10 rounded-2xl bg-slate-50 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t.welcome}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
