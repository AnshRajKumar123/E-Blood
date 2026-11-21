import React, { useState } from "react";
import { RotateCcw, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/CheckEligibility.css";

const questionsData = {
    en: [
        {
            id: 1,
            title: "Are you currently taking any medication (e.g., antibiotics, blood thinners)?",
            desc: "Certain medications, such as antibiotics or blood thinners, can affect the quality and safety of donated blood.",
            favorable: "no"
        },
        {
            id: 2,
            title: "Are you between 18 to 65 years of age?",
            desc: "For your safety, the minimum age is 18 and the maximum age is 65 for blood donors.",
            favorable: "yes"
        },
        {
            id: 3,
            title: "Is your body weight at least 45 kg?",
            desc: "A minimum weight of 45 kg ensures that you can donate blood without weakness.",
            favorable: "yes"
        },
        {
            id: 4,
            title: "Have you had any infection, fever, cold, cough, or fatigue today?",
            desc: "If you're feeling unwell, donating blood may worsen your condition.",
            favorable: "no"
        },
        {
            id: 5,
            title: "Have you undergone any surgery or major dental procedure in the last 6–12 months?",
            desc: "Recent surgeries involve healing wounds that make donation temporarily unsafe.",
            favorable: "no"
        },
        {
            id: 6,
            title: "Did you have at least 6 hours of sleep last night?",
            desc: "Adequate rest before donation helps you avoid dizziness or fatigue afterward.",
            favorable: "yes"
        },
        {
            id: 7,
            title: "Have you eaten a light meal in the last few hours?",
            desc: "Donating on an empty stomach raises the risk of dizziness.",
            favorable: "yes"
        },
        {
            id: 8,
            title: "Have you had any tattoos or piercings in the last 6 months?",
            desc: "These procedures may carry a risk of infections like hepatitis if unsterile.",
            favorable: "no"
        },
        {
            id: 9,
            title: "Have you consumed alcohol in the last 24 hours?",
            desc: "Alcohol impairs hydration and blood quality, making donation unsafe.",
            favorable: "no"
        }
    ],
    hi: [
        {
            id: 1,
            title: "क्या आप वर्तमान में कोई दवा ले रहे हैं (जैसे एंटीबायोटिक्स, रक्त पतला करने वाली दवाएं)?",
            desc: "कुछ दवाएं दान किए गए रक्त की गुणवत्ता और सुरक्षा को प्रभावित कर सकती हैं।",
            favorable: "no"
        },
        {
            id: 2,
            title: "क्या आपकी आयु 18 से 65 वर्ष के बीच है?",
            desc: "आपकी सुरक्षा के लिए रक्तदान की न्यूनतम आयु 18 और अधिकतम आयु 65 वर्ष है।",
            favorable: "yes"
        },
        {
            id: 3,
            title: "क्या आपका वजन कम से कम 45 किलोग्राम है?",
            desc: "कम से कम 45 किग्रा वजन यह सुनिश्चित करता है कि रक्तदान के बाद कमजोरी न आए।",
            favorable: "yes"
        },
        {
            id: 4,
            title: "क्या आपको आज कोई संक्रमण, बुखार, सर्दी, खांसी या थकान है?",
            desc: "अस्वस्थ होने पर रक्तदान करने से आपकी स्थिति बिगड़ सकती है।",
            favorable: "no"
        },
        {
            id: 5,
            title: "क्या पिछले 6-12 महीनों में आपकी कोई सर्जरी या दांतों की बड़ी प्रक्रिया हुई है?",
            desc: "हाल ही में हुई सर्जरी के बाद शरीर को ठीक होने के लिए समय चाहिए होता है।",
            favorable: "no"
        },
        {
            id: 6,
            title: "क्या आपने कल रात कम से कम 6 घंटे की नींद ली थी?",
            desc: "पर्याप्त नींद रक्तदान के बाद चक्कर या कमजोरी से बचाती है।",
            favorable: "yes"
        },
        {
            id: 7,
            title: "क्या आपने पिछले कुछ घंटों में हल्का भोजन किया है?",
            desc: "खाली पेट रक्तदान करने से चक्कर आने का खतरा बढ़ जाता है।",
            favorable: "yes"
        },
        {
            id: 8,
            title: "क्या पिछले 6 महीनों में आपने कोई टैटू या पियर्सिंग करवाई है?",
            desc: "असुरक्षित उपकरणों से संक्रमण का जोखिम हो सकता है।",
            favorable: "no"
        },
        {
            id: 9,
            title: "क्या आपने पिछले 24 घंटों में शराब का सेवन किया है?",
            desc: "शराब से शरीर में पानी की कमी होती है, जिससे रक्तदान असुरक्षित हो जाता है।",
            favorable: "no"
        }
    ]
};

export default function CheckEligibility({ onRegisterDonor }) {
    const { language, t } = useLanguage();
    const questions = questionsData[language] || questionsData.en;

    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);

    const handleAnswer = (choice) => {
        const nextAnswers = { ...answers, [currentIndex]: choice };
        setAnswers(nextAnswers);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setFinished(true);
        }
    };

    const handleReset = () => {
        setStarted(false);
        setCurrentIndex(0);
        setAnswers({});
        setFinished(false);
    };

    const totalAnswered = Object.keys(answers).length;
    let favorableCount = 0;
    Object.entries(answers).forEach(([idx, val]) => {
        if (questions[Number(idx)]?.favorable === val) {
            favorableCount++;
        }
    });

    const currentPercentage = totalAnswered === 0
        ? 0
        : Math.round((favorableCount / questions.length) * 100 * 10) / 10;

    const currentQ = questions[currentIndex] || questions[0];

    return (
        <section className="eb-eligibility-section">
            <div className="eb-container">
                <div className="eb-eligibility-card">
                    {/* Left Column */}
                    <div className="eb-eligibility-content">
                        <span className="eb-section-tag">{t("checkEligibility")}</span>

                        {!started ? (
                            <div className="eb-eligibility-intro">
                                <h3 className="eb-eligibility-heading">{t("canYouDonate")}</h3>
                                <p className="eb-eligibility-desc">
                                    {t("eligibilityIntroDesc")}
                                </p>
                                <button
                                    type="button"
                                    className="eb-elig-btn-primary"
                                    onClick={() => setStarted(true)}
                                >
                                    {t("startQuickCheck")}
                                </button>
                            </div>
                        ) : finished ? (
                            <div className="eb-eligibility-result">
                                <h3 className="eb-eligibility-heading">{t("analysisDone")}</h3>
                                <p className="eb-eligibility-desc">
                                    {t("doctorReverify")}
                                </p>
                                <div className="eb-result-actions">
                                    <button
                                        type="button"
                                        className="eb-elig-btn-outline"
                                        onClick={handleReset}
                                    >
                                        <RotateCcw size={15} />
                                        <span>{t("startOver")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="eb-elig-btn-primary"
                                        onClick={onRegisterDonor}
                                    >
                                        <Heart size={15} />
                                        <span>{t("registerAsDonor")}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="eb-eligibility-question">
                                <span className="eb-q-step-counter">
                                    {t("question")} {currentIndex + 1} {t("of")} {questions.length}
                                </span>
                                <h3 className="eb-q-title">{currentQ.title}</h3>
                                <p className="eb-q-desc">{currentQ.desc}</p>

                                <div className="eb-q-choices">
                                    <button
                                        type="button"
                                        className="eb-choice-btn yes"
                                        onClick={() => handleAnswer("yes")}
                                    >
                                        {t("yes")}
                                    </button>
                                    <button
                                        type="button"
                                        className="eb-choice-btn no"
                                        onClick={() => handleAnswer("no")}
                                    >
                                        {t("no")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Silhouette */}
                    <div className="eb-eligibility-visual">
                        <div className="eb-silhouette-wrapper">
                            <svg
                                viewBox="0 0 130 240"
                                className="eb-human-silhouette-svg"
                            >
                                <defs>
                                    <clipPath id="body-fill-clip">
                                        <rect
                                            x="0"
                                            y={240 - (240 * (currentPercentage / 100))}
                                            width="130"
                                            height={240 * (currentPercentage / 100)}
                                            style={{ transition: "y 0.4s ease, height 0.4s ease" }}
                                        />
                                    </clipPath>
                                </defs>

                                <g fill="#e5e7eb">
                                    <circle cx="65" cy="24" r="18" />
                                    <rect x="37" y="48" width="56" height="78" rx="14" />
                                    <rect x="18" y="52" width="15" height="74" rx="7.5" />
                                    <rect x="97" y="52" width="15" height="74" rx="7.5" />
                                    <rect x="40" y="132" width="22" height="96" rx="9" />
                                    <rect x="68" y="132" width="22" height="96" rx="9" />
                                </g>

                                <g fill="#2563eb" clipPath="url(#body-fill-clip)">
                                    <circle cx="65" cy="24" r="18" />
                                    <rect x="37" y="48" width="56" height="78" rx="14" />
                                    <rect x="18" y="52" width="15" height="74" rx="7.5" />
                                    <rect x="97" y="52" width="15" height="74" rx="7.5" />
                                    <rect x="40" y="132" width="22" height="96" rx="9" />
                                    <rect x="68" y="132" width="22" height="96" rx="9" />
                                </g>
                            </svg>
                        </div>

                        <div className="eb-percentage-meta">
                            <span className="eb-percentage-num">{currentPercentage.toFixed(1)}%</span>
                            <span className="eb-percentage-label">{t("healthPercentage")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}