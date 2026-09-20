import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

def generate_invoice(pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm
    )

    # Color Palette matching the luxury invitation
    c_burgundy = colors.HexColor("#230200")
    c_burgundy_mid = colors.HexColor("#36050b")
    c_gold = colors.HexColor("#b08850")
    c_gold_light = colors.HexColor("#f4ece1")
    c_dark = colors.HexColor("#1f2937")
    c_gray = colors.HexColor("#4b5563")
    c_light_bg = colors.HexColor("#faf7f2")
    c_border = colors.HexColor("#e5dfd5")

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_title = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_burgundy,
        alignment=0
    )

    style_inv_num = ParagraphStyle(
        'InvoiceNum',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_gold,
        alignment=2
    )

    style_meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=c_gray,
        alignment=2
    )

    style_meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=c_dark,
        alignment=2
    )

    style_section_h = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_burgundy,
        spaceAfter=4
    )

    style_body = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_dark
    )

    style_body_bold = ParagraphStyle(
        'BodyTextBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=c_dark
    )

    style_body_muted = ParagraphStyle(
        'BodyTextMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_gray
    )

    style_item_title = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_burgundy
    )

    style_item_desc = ParagraphStyle(
        'ItemDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_gray
    )

    style_cell_price = ParagraphStyle(
        'CellPrice',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_dark,
        alignment=2
    )

    story = []

    # 1. HEADER SECTION (Brand & Invoice Info)
    header_data = [
        [
            Paragraph("<b>INVOICE</b>", style_title),
            Paragraph("<b>INVOICE #:</b> INV-2026-FN927<br/><font color='#718096'>Date:</font> 20 September 2026<br/><font color='#718096'>Due:</font> Upon Receipt", style_inv_num)
        ]
    ]
    t_header = Table(header_data, colWidths=[90 * mm, 84 * mm])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_header)

    story.append(Spacer(1, 4 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_gold, spaceAfter=5 * mm))

    # 2. CLIENT & PROJECT DETAILS (2-column layout)
    client_info = [
        Paragraph("<b>BILLED TO:</b>", style_section_h),
        Paragraph("<b>Mohammed Fayyas &amp; Shibla Nargees</b>", style_body_bold),
        Paragraph("Venue: Bride's Home, Perumparambu, Areekode", style_body),
        Paragraph("Malappuram District, Kerala, India", style_body),
        Paragraph("WhatsApp Contact: +91 9633190113", style_body_muted),
    ]

    project_info = [
        Paragraph("<b>PROJECT OVERVIEW:</b>", style_section_h),
        Paragraph("<b>Bespoke Nikkah Digital Invitation Web App</b>", style_body_bold),
        Paragraph("Ceremony Date: <b>Sunday, 27 September 2026</b>", style_body),
        Paragraph("Ceremony Timing: <b>10:15 AM</b>", style_body),
        Paragraph("Deliverable: Responsive Web Application &amp; Source Repository", style_body_muted),
    ]

    t_parties = Table([[client_info, project_info]], colWidths=[87 * mm, 87 * mm])
    t_parties.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (0, 0), c_light_bg),
        ('BACKGROUND', (1, 0), (1, 0), c_light_bg),
        ('BOX', (0, 0), (0, 0), 0.5, c_border),
        ('BOX', (1, 0), (1, 0), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 4 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_parties)
    story.append(Spacer(1, 6 * mm))

    # 3. ITEMIZED SERVICES TABLE
    headers = [
        Paragraph("<b>#</b>", style_body_bold),
        Paragraph("<b>SERVICE &amp; DELIVERABLE DESCRIPTION</b>", style_body_bold),
        Paragraph("<b>QTY</b>", style_body_bold),
        Paragraph("<b>RATE (INR)</b>", style_cell_price),
        Paragraph("<b>AMOUNT (INR)</b>", style_cell_price)
    ]

    items = [
        [
            Paragraph("1", style_body),
            [
                Paragraph("<b>Luxury UI/UX Design &amp; Arch Framework</b>", style_item_title),
                Paragraph("Custom heritage arch framing, Arabic Bismillah calligraphy, dual-family hosting parentage hierarchy, and bespoke color system (Deep Burgundy, Warm Ivory, Champagne Gold).", style_item_desc)
            ],
            Paragraph("1", style_body),
            Paragraph("Rs. 1,400.00", style_cell_price),
            Paragraph("Rs. 1,400.00", style_cell_price)
        ],
        [
            Paragraph("2", style_body),
            [
                Paragraph("<b>Interactive 3D Envelope &amp; Wax Seal Animation</b>", style_item_title),
                Paragraph("Custom touch-activated 3D envelope opening sequence, wax seal breaking effect, animated letter slide-up, and ambient background music engine with floating audio controller.", style_item_desc)
            ],
            Paragraph("1", style_body),
            Paragraph("Rs. 1,200.00", style_cell_price),
            Paragraph("Rs. 1,200.00", style_cell_price)
        ],
        [
            Paragraph("3", style_body),
            [
                Paragraph("<b>Interactive Scratch Card &amp; 'Save The Date' Calendar</b>", style_item_title),
                Paragraph("HTML5 Canvas scratch-to-reveal gold metallic card with realistic foil scratching, auto-reveal threshold, reset control, and custom September 2026 week calendar badge highlighting the 27th.", style_item_desc)
            ],
            Paragraph("1", style_body),
            Paragraph("Rs. 1,100.00", style_cell_price),
            Paragraph("Rs. 1,100.00", style_cell_price)
        ],
        [
            Paragraph("4", style_body),
            [
                Paragraph("<b>Live Nikkah Countdown Timer &amp; Venue Navigation</b>", style_item_title),
                Paragraph("Real-time countdown clock calculating days, hours, mins, and secs to 27-09-2026 10:15 AM. Editorial venue card with direct one-touch Google Maps navigation integration.", style_item_desc)
            ],
            Paragraph("1", style_body),
            Paragraph("Rs. 800.00", style_cell_price),
            Paragraph("Rs. 800.00", style_cell_price)
        ],
        [
            Paragraph("5", style_body),
            [
                Paragraph("<b>Mobile Optimization, WhatsApp RSVP &amp; Cloud Deployment</b>", style_item_title),
                Paragraph("Comprehensive responsive mobile-first optimization (using CSS container queries), custom WhatsApp RSVP message link, Git repository setup, and cloud hosting deployment.", style_item_desc)
            ],
            Paragraph("1", style_body),
            Paragraph("Rs. 500.00", style_cell_price),
            Paragraph("Rs. 500.00", style_cell_price)
        ],
    ]

    table_data = [headers] + items
    col_widths = [8 * mm, 96 * mm, 12 * mm, 28 * mm, 30 * mm]

    t_services = Table(table_data, colWidths=col_widths)
    t_services.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_gold_light),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3 * mm),
        ('TOPPADDING', (0, 0), (-1, 0), 3 * mm),
        ('LINEBELOW', (0, 0), (-1, 0), 1.2, c_gold),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 1), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(t_services)
    story.append(Spacer(1, 4 * mm))

    # 4. TOTALS & SUMMARY SECTION
    totals_data = [
        [Paragraph("Subtotal:", style_body), Paragraph("Rs. 5,000.00", style_cell_price)],
        [Paragraph("Inaugural Courtesy Discount:", style_body), Paragraph("- Rs. 500.00", style_cell_price)],
        [Paragraph("<b>TOTAL DUE:</b>", style_item_title), Paragraph("<b>Rs. 4,500.00</b>", ParagraphStyle('TotalBig', parent=style_cell_price, fontSize=12, leading=15, textColor=c_burgundy))]
    ]
    t_totals = Table(totals_data, colWidths=[40 * mm, 35 * mm])
    t_totals.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5 * mm),
        ('LINEABOVE', (0, 2), (-1, 2), 1, c_gold),
        ('BACKGROUND', (0, 2), (-1, 2), c_gold_light),
    ]))

    # Wrap totals to align right
    totals_wrapper = Table([[ "", t_totals ]], colWidths=[99 * mm, 75 * mm])
    totals_wrapper.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(totals_wrapper)

    story.append(Spacer(1, 6 * mm))

    # 5. PAYMENT & NOTE SECTION
    note_content = [
        Paragraph("<b>PAYMENT INFORMATION &amp; TERMS:</b>", style_section_h),
        Paragraph("• <b>Payment Methods:</b> UPI / Google Pay / PhonePe / Bank Transfer", style_body),
        Paragraph("• <b>UPI ID / Number:</b> 9633190113 (or as agreed with client)", style_body),
        Paragraph("• <b>Status:</b> Payment due upon delivery &amp; final sign-off.", style_body),
        Spacer(1, 2 * mm),
        Paragraph("<i>Thank you for the opportunity to design this special Nikkah invitation. Wishing Mohammed Fayyas &amp; Shibla Nargees a lifetime of happiness, peace, and blessings!</i>", style_body_muted),
    ]

    t_note = Table([[note_content]], colWidths=[174 * mm])
    t_note.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_light_bg),
        ('BOX', (0, 0), (-1, -1), 0.8, c_gold),
        ('TOPPADDING', (0, 0), (-1, -1), 4 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(t_note)

    doc.build(story)
    print(f"Invoice generated successfully: {pdf_path}")

if __name__ == "__main__":
    pdf_out = os.path.abspath("INVOICE_MOHAMMED_FAYYAS_SHIBLA_NARGEES.pdf")
    generate_invoice(pdf_out)
