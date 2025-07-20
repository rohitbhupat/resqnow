// your imports
import React from "react";
import usePageTitle from "../pages/usePageTitle";
import {
    Siren,
    Compass,
    Handshake,
    BarChart2,
    ShieldCheck,
    Smartphone,
    User,
    Users,
    Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const navigate = useNavigate();
    usePageTitle("Home | ResQNow");

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-red-100 text-gray-800">
                {/* Hero Section */}
                <div className="text-center py-12 px-6 sm:px-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-red-700 mb-4 font-sans">
                        ResQNow
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
                        A disaster alert and emergency response platform connecting citizens,
                        volunteers, and NGOs in real-time.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate("/sos")}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                        >
                            Send SOS
                        </button>

                        {!localStorage.getItem("resq_user") && (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Login / Signup
                            </button>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white py-10 px-6 sm:px-10">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-red-600 mb-6">
                        Key Features of ResQNow
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            [
                                {
                                    title: "Real-time SOS Alerts",
                                    desc: "Instantly send alerts during disasters with live location, urgency level, and contact info.",
                                    Icon: Siren,
                                },
                                {
                                    title: "Volunteer Dashboard",
                                    desc: "Volunteers get real-time alert feeds, can respond to SOS, and track status updates.",
                                    Icon: Compass,
                                },
                                {
                                    title: "NGO Dashboard",
                                    desc: "NGOs can manage SOS alerts, assign volunteers, and coordinate relief resources.",
                                    Icon: Handshake,
                                },
                                {
                                    title: "Analytics",
                                    desc: "View data on alerts by location, urgency, and volunteer response to improve decision-making.",
                                    Icon: BarChart2,
                                },
                                {
                                    title: "Secure & Scalable",
                                    desc: "Built on AWS using Cognito, Lambda, S3, DynamoDB, API Gateway, and more.",
                                    Icon: ShieldCheck,
                                },
                                {
                                    title: "Mobile Friendly",
                                    desc: "Fully responsive design for quick access on any device, especially during emergencies.",
                                    Icon: Smartphone,
                                },
                            ].map(({ title, desc, Icon }, idx) => (
                                <div key={idx} className="bg-yellow-100 p-5 rounded-lg shadow-sm text-center">
                                    <Icon className="w-12 h-12 mx-auto text-red-600 mb-3" />
                                    <h3 className="text-xl font-bold text-yellow-700 mb-2">{title}</h3>
                                    <p>{desc}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Post-login Suggestion Section */}
                <div className="bg-yellow-50 py-10 px-6 sm:px-10">
                    <h2 className="text-2xl font-semibold text-center text-red-700 mb-6">
                        What Happens After You Log In?
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {
                            [
                                {
                                    title: "Users",
                                    desc: "Access quick SOS, view your past alerts, and check help availability around you.",
                                    Icon: User,
                                },
                                {
                                    title: "Volunteers",
                                    desc: "Get live alerts, locations of people needing help, and mark yourself as available.",
                                    Icon: Users,
                                },
                                {
                                    title: "NGOs",
                                    desc: "Track all alerts, manage volunteers, assign resources, and review analytics.",
                                    Icon: Landmark,
                                },
                            ].map(({ title, desc, Icon }, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-lg shadow text-center">
                                    <Icon className="w-10 h-10 mx-auto text-yellow-600 mb-3" />
                                    <h4 className="text-lg font-bold text-yellow-600 mb-2">{title}</h4>
                                    <p>{desc}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Home;