import React from "react";
import { Mail, Clock, MessageSquare, AlertCircle } from "lucide-react";

export default function QueryManagement() {
    const sampleQueries = [
        {
            id: "Q1",
            name: "Sunita Verma",
            email: "sunita.v@gmail.com",
            category: "Report Fake Donor / Money Demand",
            message: "Someone claiming to be an A+ donor asked for ₹1,500 cab fare before coming. Please inspect their listing.",
            date: "Today, 11:20 AM",
            severity: "high"
        },
        {
            id: "Q2",
            name: "Dr. R. K. Sharma",
            email: "sharmaclinic@rediffmail.com",
            category: "Blood Camp Scheduling Help",
            message: "We want to host a camp at Desh Bhagat campus next month. Please verify our outdoor permissions.",
            date: "Yesterday, 4:15 PM",
            severity: "normal"
        }
    ];

    return (
        <div className="eb-management-pane">
            <div className="eb-query-cards-stack">
                {sampleQueries.map((q) => (
                    <div key={q.id} className={`eb-query-admin-item ${q.severity}`}>
                        <div className="query-meta-row">
                            <span className="query-cat-badge">{q.category}</span>
                            <small className="query-time">
                                <Clock size={12} /> {q.date}
                            </small>
                        </div>

                        <h4>{q.name} <span>({q.email})</span></h4>
                        <p>{q.message}</p>

                        <div className="query-actions-row">
                            <a href={`mailto:${q.email}?subject=RE: [E-Blood Support] ${q.category}`} className="eb-btn-reply">
                                <Mail size={13} /> Reply via Email
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}