import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def create_project_pdf():
    pdf_path = os.path.join(os.getcwd(), "HomelyHub_Project_Report.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#f43f5e'),
        alignment=TA_CENTER,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#f43f5e'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f1f5f9'),
        borderPadding=6,
        spaceAfter=6
    )

    qa_q_style = ParagraphStyle(
        'QA_Q',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=6,
        spaceAfter=2
    )

    qa_a_style = ParagraphStyle(
        'QA_A',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("🏡 HomelyHub — Project Submission Report", title_style))
    story.append(Paragraph("<b>Full-Stack MERN Vacation Rental & Property Booking Platform</b><br/>4-Week Internship Comprehensive Documentation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#f43f5e'), spaceAfter=15))

    # Meta Info Table
    meta_data = [
        [Paragraph("<b>Project:</b> HomelyHub", body_style), Paragraph("<b>Architecture:</b> MERN Stack (MongoDB, Express, React, Node)", body_style)],
        [Paragraph("<b>Frontend:</b> React 18 + Vite (Vercel)", body_style), Paragraph("<b>Backend:</b> Express.js REST API (Render)", body_style)],
        [Paragraph("<b>Database:</b> MongoDB Atlas Cloud", body_style), Paragraph("<b>Live URL:</b> https://homely-hub-omega.vercel.app", body_style)],
        [Paragraph("<b>GitHub:</b> github.com/Shivam95800/HomelyHub", body_style), Paragraph("<b>Author / Developer:</b> Shivam", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[265, 265])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "<b>HomelyHub</b> is an end-to-end full-stack property booking platform modeled as a streamlined, modern alternative to platforms like Airbnb. "
        "The system allows travelers (guests) to search verified vacation homes, apply multi-criteria filters (by location, keyword, and budget), "
        "view real-time property galleries, dynamically calculate total costs based on stay duration, and instantly reserve dates with rigorous "
        "double-booking collision protection. Property owners (hosts) can create and manage listings.",
        body_style
    ))

    # 2. Technology Stack
    story.append(Paragraph("2. Technology Stack Specifications", h1_style))
    tech_data = [
        [Paragraph("<b>Domain</b>", body_style), Paragraph("<b>Technologies Used</b>", body_style), Paragraph("<b>Purpose</b>", body_style)],
        [Paragraph("Frontend UI", body_style), Paragraph("React.js 18, Vite 5, React Router DOM", body_style), Paragraph("Single Page Application (SPA) with fast client routing", body_style)],
        [Paragraph("Design & Styling", body_style), Paragraph("Custom Dark & Obsidian CSS, Plus Jakarta Sans", body_style), Paragraph("Modern Bento-Grid layout, frosted glass, responsive design", body_style)],
        [Paragraph("Backend API", body_style), Paragraph("Node.js (ES Modules), Express.js 4", body_style), Paragraph("RESTful API architecture with CORS & JSON body parsing", body_style)],
        [Paragraph("Database / ODM", body_style), Paragraph("MongoDB Atlas Cloud, Mongoose 8", body_style), Paragraph("Schema validation, indexing, and multi-collection references", body_style)],
        [Paragraph("Security & Auth", body_style), Paragraph("JSON Web Tokens (JWT), Bcrypt.js", body_style), Paragraph("Stateless Bearer token auth and 10-round salted password hashing", body_style)],
        [Paragraph("HTTP Client", body_style), Paragraph("Axios (with Request Interceptors)", body_style), Paragraph("Automatic JWT header attachment for protected endpoints", body_style)],
        [Paragraph("Cloud Hosting", body_style), Paragraph("Vercel (Frontend), Render (Backend)", body_style), Paragraph("High availability production deployment with CI/CD", body_style)]
    ]
    tech_table = Table(tech_data, colWidths=[110, 200, 220])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f43f5e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 12))

    # 3. System Architecture & Database Schema
    story.append(Paragraph("3. Database Schema Design (Mongoose)", h1_style))
    story.append(Paragraph(
        "The application maintains three core models in MongoDB with strict validation and relational references:",
        body_style
    ))
    story.append(Paragraph("<b>• User Model (models/User.js):</b> <code>name</code>, <code>email</code> (unique, lowercase), <code>password</code> (hashed with bcrypt), <code>role</code> (enum: 'guest' | 'owner'), <code>timestamps</code>.", body_style))
    story.append(Paragraph("<b>• Property Model (models/Property.js):</b> <code>title</code>, <code>description</code>, <code>price</code> (per night), <code>location</code> (indexed for search), <code>images</code> (array of URLs), <code>amenities</code> (array of strings), <code>ownerId</code> (ref to User), <code>timestamps</code>.", body_style))
    story.append(Paragraph("<b>• Booking Model (models/Booking.js):</b> <code>propertyId</code> (ref to Property), <code>userId</code> (ref to User), <code>checkInDate</code>, <code>checkOutDate</code>, <code>totalPrice</code>, <code>status</code> (enum: 'confirmed' | 'cancelled' | 'pending'), <code>timestamps</code>.", body_style))

    story.append(Spacer(1, 10))

    # 4. Core Algorithms & Logic
    story.append(Paragraph("4. Key Algorithms & Business Logic", h1_style))
    story.append(Paragraph("<b>A. Mathematical Date-Overlap Collision Detection Algorithm:</b>", h2_style))
    story.append(Paragraph(
        "To guarantee that two users can never reserve the same property for overlapping dates, the backend booking controller executes an interval query in MongoDB prior to confirming any reservation. Two date ranges [CheckIn, CheckOut] overlap if and only if:",
        body_style
    ))
    story.append(Paragraph(
        "<code>existingCheckIn &lt; newCheckOut  AND  existingCheckOut &gt; newCheckIn  (WHERE status != 'cancelled')</code>",
        code_style
    ))
    story.append(Paragraph(
        "If any existing booking satisfies this condition for the target property, the server rejects the request with HTTP 400 ('Property already booked for selected dates').",
        body_style
    ))

    story.append(Paragraph("<b>B. Dynamic Night and Total Cost Calculation:</b>", h2_style))
    story.append(Paragraph(
        "<code>Total Nights = Math.ceil( |checkOutDate - checkInDate| / (1000 * 60 * 60 * 24) )</code><br/>"
        "<code>Total Price = Total Nights * Property.PricePerNight</code>",
        code_style
    ))

    story.append(Spacer(1, 10))

    # 5. REST API Endpoints Specification
    story.append(Paragraph("5. REST API Endpoints Specification", h1_style))
    api_data = [
        [Paragraph("<b>Method</b>", body_style), Paragraph("<b>Endpoint</b>", body_style), Paragraph("<b>Access</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/auth/register", body_style), Paragraph("Public", body_style), Paragraph("Register new guest or owner account with bcrypt hashing", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/auth/login", body_style), Paragraph("Public", body_style), Paragraph("Authenticate credentials and return JWT bearer token", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/auth/me", body_style), Paragraph("Private", body_style), Paragraph("Get current authenticated user profile details", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/properties", body_style), Paragraph("Public", body_style), Paragraph("List all properties with filters (location, search, min/max price)", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/properties/:id", body_style), Paragraph("Public", body_style), Paragraph("Get single property details with populated owner info", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/properties", body_style), Paragraph("Owner", body_style), Paragraph("Create a new property listing (protected, owner only)", body_style)],
        [Paragraph("PUT", body_style), Paragraph("/api/properties/:id", body_style), Paragraph("Owner", body_style), Paragraph("Update an existing owned property listing", body_style)],
        [Paragraph("DELETE", body_style), Paragraph("/api/properties/:id", body_style), Paragraph("Owner", body_style), Paragraph("Delete an owned property listing from database", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/bookings", body_style), Paragraph("Private", body_style), Paragraph("Create reservation with collision overlap prevention", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/bookings/my", body_style), Paragraph("Private", body_style), Paragraph("Fetch all bookings of logged-in user with populated stay data", body_style)],
        [Paragraph("PATCH", body_style), Paragraph("/api/bookings/:id/cancel", body_style), Paragraph("Private", body_style), Paragraph("Cancel an active booking reservation", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/health", body_style), Paragraph("Public", body_style), Paragraph("Health check & uptime monitor endpoint", body_style)]
    ]
    api_table = Table(api_data, colWidths=[65, 140, 65, 260])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 12))

    # 6. Frontend Architecture & User Flows
    story.append(Paragraph("6. Frontend Architecture & State Management", h1_style))
    story.append(Paragraph(
        "<b>• AuthContext (Global Session Provider):</b> Manages user state, token in localStorage, login, register, and logout. Prevents state loss on browser refresh.<br/>"
        "<b>• ProtectedRoute Component:</b> Wraps private pages (/my-bookings), redirecting unauthorized guests to /login with automatic return redirect.<br/>"
        "<b>• Axios Interceptors:</b> Automatically attaches Bearer tokens to request headers and manages global 401 unauthorized errors.<br/>"
        "<b>• Modern Dark Obsidian UI:</b> Crafted using responsive CSS variables, glassmorphism frosted headers, and Plus Jakarta Sans typography.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # 7. Viva & Interview Questions
    story.append(Paragraph("7. Comprehensive Viva & Interview Q&A", h1_style))
    
    qa_list = [
        ("Q1: What are the main benefits of using the MERN stack for this project?",
         "MERN enables end-to-end JavaScript/ES Module development across client and server. It allows seamless JSON object interchange between MongoDB, Express, and React without complex serialization, offering high performance, rapid development, and rich single-page application (SPA) capabilities."),
        ("Q2: How does the platform handle password security and authentication?",
         "Passwords are encrypted using Bcrypt.js with 10 salt rounds before persisting in MongoDB. Upon valid authentication, the server issues a signed JSON Web Token (JWT) with a 30-day expiry. The client persists this token and presents it in the 'Authorization: Bearer <token>' header on all secured routes."),
        ("Q3: Explain how the date-overlap booking verification works.",
         "In bookingController.js, we query MongoDB using the interval collision condition: (existingCheckIn < newCheckOut && existingCheckOut > newCheckIn) for active (non-cancelled) bookings on that propertyId. If any matching record exists, the reservation is rejected with an explanatory message."),
        ("Q4: How are environment variables handled across development and cloud deployment?",
         "Locally, variables are stored in .env (ignored by .gitignore). In production, variables (PORT, MONGO_URI, JWT_SECRET, CLIENT_URL, VITE_API_BASE_URL) are securely injected via Render and Vercel environment dashboards.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(q, qa_q_style))
        story.append(Paragraph(a, qa_a_style))

    # Footer note
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0'), spaceAfter=10))
    story.append(Paragraph("<font color='#64748b'>HomelyHub — Developed by Shivam | Published under MIT License</font>", ParagraphStyle('foot', parent=styles['Normal'], alignment=TA_CENTER, fontSize=8)))

    # Build Document
    doc.build(story)
    print(f"PDF Generated Successfully at: {pdf_path}")

if __name__ == "__main__":
    create_project_pdf()
