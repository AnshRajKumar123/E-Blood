import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./pages/Hero";
import LoginPage from "./pages/LoginPage";
import RegisterDonorPage from "./pages/RegisterDonorPage";
import ProfilePage from "./pages/ProfilePage";
import SearchDonorsPage from "./pages/SearchDonorsPage";
import BloodBankDirectory from "./pages/BloodBankDirectory";
import OrganisationLoginPage from "./pages/OrganisationLoginPage";
import OrganisationDashboard from "./pages/OrganisationDashboard";
import RegisterBloodBank from "./pages/RegisterBloodBank";
import AddBloodCamp from "./pages/AddBloodCamp";

// Dedicated Information & Utility Pages
import FindCampPage from "./pages/FindCampPage";
import NotificationsPage from "./pages/NotificationsPage";
import AboutUsPage from "./pages/AboutUsPage";
import FaqPage from "./pages/FaqPage";
import PrivacyTermsPage from "./pages/PrivacyTermsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Splash Screen Component
import SplashScreen from "./components/SplashScreen";

import { useLanguage } from "./context/LanguageContext";
import { 
    apiRegisterDonor, 
    apiDeleteUserAccount 
} from "./services/api";

const PATH_MAP = {
    "/": "home",
    "/home": "home",
    "/search": "search",
    "/find-blood": "search",
    "/directory": "directory",
    "/blood-banks": "directory",
    "/camps": "camps",
    "/upcoming-camps": "camps",
    "/find-camp": "camps",
    "/notifications": "notifications",
    "/login": "login",
    "/register": "register",
    "/register-donor": "register",
    "/profile": "profile",
    "/org-login": "org-login",
    "/org-dashboard": "org-dashboard",
    "/org-register-bank": "org-register-bank",
    "/register-bank": "org-register-bank",
    "/org-add-camp": "org-add-camp",
    "/register-camp": "org-add-camp",
    "/about": "about",
    "/about-us": "about",
    "/faqs": "faqs",
    "/terms": "terms",
    "/terms-and-conditions": "terms",
    "/privacy-policy": "terms",
    "/accessibility-statement": "terms",
    "/contact-us": "terms",
    "/404": "404"
};

const getPageFromPath = (pathname) => {
    const cleanPath = pathname.replace(/\/+$/, "") || "/";
    return PATH_MAP[cleanPath] || "404";
};

const getInitialSubTab = (pathname) => {
    const cleanPath = pathname.replace(/\/+$/, "") || "/";
    if (cleanPath === "/privacy-policy") return "privacy";
    if (cleanPath === "/accessibility-statement") return "accessibility";
    if (cleanPath === "/contact-us") return "contact";
    return "terms";
};

export default function App() {
    const { language } = useLanguage();
    const isHindi = language === "hi";

    // 1. Splash Screen States (3 Seconds Display)
    const [showSplash, setShowSplash] = useState(true);
    const [splashFading, setSplashFading] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setSplashFading(true);
        }, 2600);

        const removeTimer = setTimeout(() => {
            setShowSplash(false);
        }, 3100);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    // 2. User & Organisation Sessions
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("eblood_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [currentOrg, setCurrentOrg] = useState(() => {
        try {
            const savedOrg = localStorage.getItem("eblood_org");
            return savedOrg ? JSON.parse(savedOrg) : null;
        } catch {
            return null;
        }
    });

    const [activePage, setActivePage] = useState(() => getPageFromPath(window.location.pathname));
    const [termsSubTab, setTermsSubTab] = useState(() => getInitialSubTab(window.location.pathname));
    const [editingBankData, setEditingBankData] = useState(null);
    const [editingCampData, setEditingCampData] = useState(null);

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            setActivePage(getPageFromPath(path));
            setTermsSubTab(getInitialSubTab(path));
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigateTo = (page, subtab = null) => {
        if (page === "terms") {
            setTermsSubTab(subtab || "terms");
        }
        setActivePage(page);
        let targetPath = "/" + (page === "home" ? "" : page);
        if (page === "terms" && subtab) {
            if (subtab === "privacy") targetPath = "/privacy-policy";
            else if (subtab === "accessibility") targetPath = "/accessibility-statement";
            else if (subtab === "contact") targetPath = "/contact-us";
            else targetPath = "/terms-and-conditions";
        }

        if (window.location.pathname !== targetPath) {
            window.history.pushState({}, "", targetPath);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Role Verification for Blood Camp Creation
    const handleScheduleCampIntent = () => {
        if (currentOrg) {
            setEditingCampData(null);
            navigateTo("org-add-camp");
        } else if (currentUser) {
            alert(
                isHindi 
                    ? "व्यक्तिगत रक्तदाता खाते रक्तदान शिविर आयोजित नहीं कर सकते। शिविर शेड्यूल करने के लिए कृपया एक अधिकृत संस्था या अस्पताल खाते से साइन इन करें।"
                    : "Individual donor accounts cannot organize blood camps. Please sign in with an authorized Organisation or Hospital account to schedule a camp."
            );
            navigateTo("org-login");
        } else {
            navigateTo("org-login");
        }
    };

    // Role Verification for Blood Bank Registration
    const handleRegisterBankIntent = () => {
        if (currentOrg) {
            setEditingBankData(null);
            navigateTo("org-register-bank");
        } else if (currentUser) {
            alert(
                isHindi 
                    ? "व्यक्तिगत रक्तदाता ब्लड बैंक पंजीकृत नहीं कर सकते। कृपया संस्था खाते से साइन इन करें।"
                    : "Individual donor accounts cannot register a blood bank. Please sign in with an Organisation account."
            );
            navigateTo("org-login");
        } else {
            navigateTo("org-login");
        }
    };

    const handleEditBank = (bank) => {
        setEditingBankData(bank);
        navigateTo("org-register-bank");
    };

    const handleEditCamp = (camp) => {
        setEditingCampData(camp);
        navigateTo("org-add-camp");
    };

    const [searchParams, setSearchParams] = useState({
        bloodGroup: "",
        state: "",
        city: "",
        pincode: "",
        landmark: ""
    });

    const [activeDemoOtp, setActiveDemoOtp] = useState(null);
    const triggerOtpToast = (code) => {
        setActiveDemoOtp(code);
        setTimeout(() => setActiveDemoOtp(null), 15000);
    };

    const handleLoginSuccess = (userPayload) => {
        setCurrentUser(userPayload);
        localStorage.setItem("eblood_user", JSON.stringify(userPayload));
        navigateTo("profile");
    };

    const handleRegisterComplete = async (donorPayload) => {
        try {
            const res = await apiRegisterDonor({
                ...donorPayload,
                userId: currentUser?._id || currentUser?.id,
                email: currentUser?.email || donorPayload.email,
                phone: donorPayload.phone || currentUser?.phone
            });

            const savedUser = res && res.success && res.user 
                ? res.user 
                : { ...(currentUser || {}), ...donorPayload, isDonor: true };
            
            setCurrentUser(savedUser);
            localStorage.setItem("eblood_user", JSON.stringify(savedUser));
        } catch (err) {
            const fallback = { ...(currentUser || {}), ...donorPayload, isDonor: true };
            setCurrentUser(fallback);
            localStorage.setItem("eblood_user", JSON.stringify(fallback));
        }
        navigateTo("profile");
    };

    const handleUpdateUser = async (updated) => {
        setCurrentUser(updated);
        localStorage.setItem("eblood_user", JSON.stringify(updated));
    };

    const handleSignOut = () => {
        setCurrentUser(null);
        localStorage.removeItem("eblood_user");
        navigateTo("login");
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account?")) return;
        const identifier = currentUser?.email || currentUser?.phone;
        if (identifier) {
            try { await apiDeleteUserAccount(identifier); } catch (err) {}
        }
        localStorage.removeItem("eblood_user");
        setCurrentUser(null);
        navigateTo("login");
    };

    const handleOrgLoginSuccess = (orgPayload) => {
        setCurrentOrg(orgPayload);
        localStorage.setItem("eblood_org", JSON.stringify(orgPayload));
        navigateTo("org-dashboard");
    };

    const handleOrgSignOut = () => {
        setCurrentOrg(null);
        localStorage.removeItem("eblood_org");
        navigateTo("org-login");
    };

    const handleInitiateSearch = (bloodGroup = "", city = "") => {
        setSearchParams((prev) => ({ ...prev, bloodGroup, city }));
        navigateTo("search");
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%" }}>
            {/* Opening Splash Screen */}
            {showSplash && <SplashScreen fadingOut={splashFading} />}

            {/* Active Demo OTP Toast Notification */}
            {activeDemoOtp && (
                <div className="demo-otp-toast">
                    <div>
                        <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8", display: "block" }}>
                            DEMO 4-DIGIT OTP CODE
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                            <span className="demo-otp-badge">{activeDemoOtp}</span>
                            <small style={{ fontSize: "11px", color: "#cbd5e1" }}>Use this code to sign in</small>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setActiveDemoOtp(null)} 
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}
                    >
                        &times;
                    </button>
                </div>
            )}

            <Navbar
                activePage={activePage}
                setActivePage={navigateTo}
                user={currentUser}
                organisation={currentOrg}
            />

            <main style={{ flex: "1 0 auto", width: "100%", position: "relative" }}>
                {activePage === "home" && (
                    <Hero
                        onFindBlood={handleInitiateSearch}
                        onRegisterDonor={() => navigateTo(currentUser ? "register" : "login")}
                        onGoToOrgLogin={() => navigateTo("org-login")}
                        onGoToRegisterBank={handleRegisterBankIntent}
                        onGoToAddCamp={handleScheduleCampIntent}
                        onGoToCamps={() => navigateTo("camps")}
                        organisation={currentOrg}
                        user={currentUser}
                    />
                )}

                {activePage === "search" && (
                    <SearchDonorsPage
                        initialQuery={searchParams}
                        onGoToHome={() => navigateTo("home")}
                        onRegisterDonor={() => navigateTo(currentUser ? "register" : "login")}
                    />
                )}

                {activePage === "directory" && (
                    <BloodBankDirectory
                        onGoToHome={() => navigateTo("home")}
                        onGoToSearch={() => navigateTo("search")}
                    />
                )}

                {activePage === "camps" && (
                    <FindCampPage 
                        onGoToHome={() => navigateTo("home")}
                        onGoToAddCamp={handleScheduleCampIntent}
                        onRegisterDonor={() => navigateTo(currentUser ? "register" : "login")}
                    />
                )}

                {activePage === "notifications" && (
                    <NotificationsPage 
                        onGoToHome={() => navigateTo("home")}
                        onNavigate={navigateTo}
                    />
                )}

                {activePage === "login" && (
                    <LoginPage
                        onLoginSuccess={handleLoginSuccess}
                        onGoToRegister={() => navigateTo("register")}
                        onGoToHome={() => navigateTo("home")}
                        triggerOtpToast={triggerOtpToast}
                    />
                )}

                {activePage === "register" && (
                    <RegisterDonorPage
                        user={currentUser}
                        onRegisterComplete={handleRegisterComplete}
                        onGoToLogin={() => navigateTo("login")}
                        onGoToHome={() => navigateTo("home")}
                    />
                )}

                {activePage === "profile" && (
                    currentUser ? (
                        <ProfilePage
                            user={currentUser}
                            onGoToRegister={() => navigateTo("register")}
                            onGoToHome={() => navigateTo("home")}
                            onSignOut={handleSignOut}
                            onDeleteAccount={handleDeleteAccount}
                            onUpdateUser={handleUpdateUser}
                        />
                    ) : (
                        <LoginPage
                            onLoginSuccess={handleLoginSuccess}
                            onGoToRegister={() => navigateTo("register")}
                            onGoToHome={() => navigateTo("home")}
                            triggerOtpToast={triggerOtpToast}
                        />
                    )
                )}

                {activePage === "org-login" && (
                    <OrganisationLoginPage
                        onLoginSuccess={handleOrgLoginSuccess}
                        onGoToHome={() => navigateTo("home")}
                        onGoToDonorLogin={() => navigateTo("login")}
                        triggerOtpToast={triggerOtpToast}
                    />
                )}

                {activePage === "org-dashboard" && (
                    <OrganisationDashboard
                        organisation={currentOrg}
                        onGoToRegisterBank={() => { setEditingBankData(null); navigateTo("org-register-bank"); }}
                        onGoToAddCamp={() => { setEditingCampData(null); navigateTo("org-add-camp"); }}
                        onEditBank={handleEditBank}
                        onEditCamp={handleEditCamp}
                        onSignOut={handleOrgSignOut}
                        onGoToHome={() => navigateTo("home")}
                    />
                )}

                {/* Edit & Create Routes for Blood Bank */}
                {activePage === "org-register-bank" && (
                    <RegisterBloodBank
                        organisation={currentOrg}
                        initialData={editingBankData}
                        onRegisterComplete={() => { setEditingBankData(null); navigateTo("org-dashboard"); }}
                        onCancel={() => { setEditingBankData(null); navigateTo("org-dashboard"); }}
                        onGoToHome={() => navigateTo("home")}
                    />
                )}

                {/* Edit & Create Routes for Blood Camp */}
                {activePage === "org-add-camp" && (
                    <AddBloodCamp
                        organisation={currentOrg}
                        initialData={editingCampData}
                        onCampCreated={() => { setEditingCampData(null); navigateTo("org-dashboard"); }}
                        onCancel={() => { setEditingCampData(null); navigateTo("org-dashboard"); }}
                        onGoToHome={() => navigateTo("home")}
                    />
                )}

                {activePage === "about" && (
                    <AboutUsPage 
                        onGoToHome={() => navigateTo("home")}
                        onGoToSearch={() => navigateTo("search")}
                        onGoToRegister={() => navigateTo(currentUser ? "profile" : "register")}
                        onGoToLogin={() => navigateTo("login")}
                        user={currentUser}
                        organisation={currentOrg}
                    />
                )}

                {activePage === "faqs" && (
                    <FaqPage 
                        onGoToHome={() => navigateTo("home")}
                        onGoToSearch={() => navigateTo("search")}
                    />
                )}

                {activePage === "terms" && (
                    <PrivacyTermsPage 
                        onGoToHome={() => navigateTo("home")} 
                        initialTab={termsSubTab}
                        onNavigate={navigateTo}
                    />
                )}

                {activePage === "404" && (
                    <NotFoundPage 
                        onGoToHome={() => navigateTo("home")}
                        onGoToSearch={() => navigateTo("search")}
                        onGoToDirectory={() => navigateTo("directory")}
                        onGoToRegister={() => navigateTo(currentUser ? "profile" : "register")}
                    />
                )}
            </main>

            <Footer 
                onGoToAbout={() => navigateTo("about")}
                onGoToFaqs={() => navigateTo("faqs")}
                onGoToTerms={(subtab) => navigateTo("terms", subtab)}
                onGoToSearch={() => navigateTo("search")}
                onGoToDirectory={() => navigateTo("directory")}
                onGoToRegister={() => navigateTo(currentUser ? "register" : "login")}
                onGoToOrgLogin={() => navigateTo(currentOrg ? "org-dashboard" : "org-login")}
                onGoToRegisterBank={handleRegisterBankIntent}
                onGoToAddCamp={handleScheduleCampIntent}
                onGoToCamps={() => navigateTo("camps")}
                onGoToNotifications={() => navigateTo("notifications")}
            />
        </div>
    );
}