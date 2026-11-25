#!/usr/bin/env python3
"""Builds the résumé PDF. Usage: python3 tools/build_resume.py [output.pdf]
All content below is taken from the existing résumé and the owner's profile notes.
Edit the CONTENT section and re-run to update the PDF."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether

OUT = sys.argv[1] if len(sys.argv) > 1 else "Brijesha_Vora_Resume.pdf"
INK, MUT, ACC, LINE = HexColor("#0f172a"), HexColor("#475569"), HexColor("#3730a3"), HexColor("#cbd5e1")
F, FB, FI = "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"

def S(name, **k):
    base = dict(fontName=F, fontSize=8.6, leading=11.4, textColor=INK)
    base.update(k); return ParagraphStyle(name, **base)
name_s = S("n", fontName=FB, fontSize=23, leading=26)
role_s = S("r", fontSize=10.5, leading=14, textColor=ACC, fontName=FB)
con_s = S("c", fontSize=8.8, leading=12, textColor=MUT)
h_s = S("h", fontName=FB, fontSize=9.4, leading=12, textColor=ACC, spaceBefore=6, spaceAfter=1.5)
body = S("b")
job_s = S("j", fontName=FB, fontSize=10, leading=13)
sub_s = S("s", fontName=FI, fontSize=8.8, leading=12, textColor=MUT)
bul = S("bl", leftIndent=10, bulletIndent=0, spaceAfter=0.8)
sk_s = S("sk", spaceAfter=1.5, leading=11.4)

def H(t):
    return [Paragraph(t.upper(), h_s), HRFlowable(width="100%", thickness=.6, color=LINE, spaceAfter=3)]
def bullets(items): return [Paragraph(i, bul, bulletText="•") for i in items]
def job(title, co, dates, sub, items):
    t = Table([[Paragraph(f"{title} <font color='#475569'>| {co}</font>", job_s), Paragraph(dates, S("d", alignment=2, textColor=MUT, fontSize=8.8))]], colWidths=[None, 38*mm])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    out = [t]
    if sub: out.append(Paragraph(sub, sub_s))
    out.append(Spacer(1, 2)); out += bullets(items)
    return [KeepTogether(out), Spacer(1, 2)]

# ---------------- CONTENT ----------------
story = []
story += [Paragraph("BRIJESHA VORA", name_s),
          Paragraph("Software Developer   |   Flutter  ·  Java  ·  Spring Boot  ·  MySQL", role_s), Spacer(1, 3),
          Paragraph("Mumbai, India  |  +91 9892270192  |  <a href='mailto:brijesha1305@gmail.com' color='#475569'>brijesha1305@gmail.com</a>", con_s),
          Paragraph("<a href='https://www.linkedin.com/in/brijeshavora' color='#475569'>linkedin.com/in/brijeshavora</a>  |  <a href='https://github.com/brijesha135' color='#475569'>github.com/brijesha135</a>  |  <a href='https://brijesha135.github.io' color='#475569'>brijesha135.github.io</a>", con_s)]

story += [Spacer(1,5), HRFlowable(width="100%", thickness=2.2, color=ACC, spaceAfter=1)]
story += H("Summary")
story.append(Paragraph(
 "Software Developer with approximately 2.9 years of experience building production business applications with Flutter, Dart, Java, Spring Boot and MySQL. "
 "Currently at Incenter Solutions, independently develops Flutter applications and integrates backend APIs provided by the backend team, covering UI, application functionality, "
 "offline/online data handling, testing, debugging and Google Play Store deployment. Previously at DGPOS Software, worked on Flutter applications and Java/Spring Boot backend development "
 "for a restaurant POS covering billing, inventory, reporting, order synchronisation and integrations.", body))

story += H("Technical Skills")
for k, v in [
 ("Mobile", "Flutter, Dart, Android release builds, Google Play Store deployment, offline/online data handling"),
 ("Backend", "Java, Spring Boot, Spring MVC, Hibernate, REST APIs, Flask, multi-tenant architecture"),
 ("Databases", "MySQL, SQLite, Firebase, database design"),
 ("Languages", "Java, Dart, Kotlin, Python, JavaScript, SQL, C, HTML, CSS"),
 ("Tools", "Git, GitHub, Postman, AWS (basics)"),
 ("Engineering", "REST API integration, system integration, OOP, SDLC, debugging, production support")]:
    story.append(Paragraph(f"<b>{k}:</b> {v}", sk_s))

story += H("Professional Experience")
story += job("Flutter Developer", "Incenter Solutions, Mumbai", "Mar 2026 – Present",
  "ERP software for AMC service providers, distribution networks and supply chain operations",
  ["Independently develop Flutter applications, including UI, application functionality and business workflows, with Android release builds and Google Play Store deployment.",
   "Integrate REST APIs provided by the backend team, with data handling across offline and online states.",
   "Test and debug applications; resolve production issues and provide live support.",
   "Work with cross-functional teams to translate business requirements into mobile features."])
story += job("Software Developer", "DGPOS Software Pvt. Ltd., Mumbai", "Jun 2024 – Mar 2026",
  "Restaurant POS software built with Flutter, Spring Boot and MySQL",
  ["Worked on Flutter applications and Java/Spring Boot backend development for a restaurant POS, covering billing, inventory, tax and customer management.",
   "Developed Spring Boot backend logic and REST APIs for POS workflows, including order and settlement synchronisation between POS terminals and the backend.",
   "Worked within a multi-tenant architecture serving multiple outlets on a shared backend.",
   "Delivered reporting and settlement modules and thermal-printer and online-ordering integrations, including database design, deployment and production support."])
story += job("Software Engineer Intern", "Option's Near Me", "May 2023 – Jul 2023", None,
  ["Built and enhanced features for a multi-user web application, working on both the Flask backend APIs and the JavaScript, HTML and CSS frontend."])

story += H("Published Applications  (Google Play)")
story.append(Paragraph("Flutter-side development for all five apps: UI, application functionality, backend API integration (APIs provided by the backend team), offline functionality, testing and Play Store deployment.", body))
story.append(Spacer(1, 2))
for n, u in [("Paliwal Field Engineer","com.paliwalcomputer.field_engineer"),("Paliwal Computer Self Care","com.paliwalcomputer.selfcare"),
             ("Wellness Rituals Sales Team","in.wellnessrituals.sales"),("Revolv ERP Store Ordering","com.revolv.storeorder"),("Revolv ERP Logistics","com.revolv.logistics")]:
    story.append(Paragraph(f"<b>{n}</b>  <font color='#475569'>·</font>  <a href='https://play.google.com/store/apps/details?id={u}' color='#3730a3'>View on Google Play</a>", S("a", fontSize=8.8, leading=12, leftIndent=10, bulletIndent=0), bulletText="•"))

story += H("Projects")
story.append(Paragraph("<b>Restaurant Reporting System</b> | Flutter, Spring Boot, MySQL | <a href='https://lnkd.in/dKUgr9km' color='#3730a3'>Project link</a>", body))
story += bullets(["Built real-time reporting dashboards in Flutter for revenue tracking and multi-outlet performance analytics, with advanced filters and Excel export, backed by Spring Boot APIs and a MySQL database."])
story.append(Spacer(1, 2))
story.append(Paragraph("<b>Pomodoro Timer Application</b> | HTML, CSS, JavaScript, Python | <a href='https://github.com/brijesha135/pomodoro-timer' color='#3730a3'>GitHub</a>", body))
story += bullets(["Built a productivity app with session tracking, usage stats and configurable timer settings."])

story += H("Education & Certifications")
story.append(Paragraph("<b>B.Sc. Information Technology</b> | KES Shroff College, Mumbai | 2024 | CGPA 9.5/10", body))
story.append(Spacer(1,2))
story.append(Paragraph("Basics of Python Programming  ·  Power BI – Data Warehousing &amp; Business Intelligence  ·  Programming with C#  ·  Robotic Process Automation", body))

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=9*mm, bottomMargin=8*mm,
    title="Brijesha Vora — Software Developer Resume", author="Brijesha Vora",
    subject="Software Developer: Flutter, Java, Spring Boot, MySQL",
    keywords="Software Developer, Flutter, Dart, Java, Spring Boot, MySQL, REST APIs, Hibernate, SQLite, Play Store")
doc.build(story)
print("wrote", OUT)
