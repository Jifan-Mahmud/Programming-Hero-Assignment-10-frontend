import { jsPDF } from "jspdf";

/**
 * Generates and downloads a branded PDF invoice / payment receipt for a booked class.
 */
export function generateInvoicePDF({
  bookingId = "PF-BOOK-" + Math.floor(100000 + Math.random() * 900000),
  transactionId = "tx_stripe_" + Math.random().toString(36).substring(2, 10),
  userName = "Valued Athlete",
  userEmail = "athlete@pulseforge.com",
  className = "Elite Conditioning Session",
  category = "Strength & Conditioning",
  trainerName = "Certified Coach",
  schedule = "Mon, Wed, Fri • 07:00 AM",
  price = 49.99,
  date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent Line
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(0, 42, pageWidth, 2.5, "F");

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PULSEFORGE", 18, 20);

  // Brand Tagline
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("ELITE ATHLETIC CONDITIONING & GYM PLATFORM", 18, 27);
  doc.text("Official Tax Invoice & Payment Receipt", 18, 33);

  // Status Badge (Top Right)
  doc.setFillColor(34, 197, 94); // green-500
  doc.roundedRect(pageWidth - 52, 14, 34, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("VERIFIED PAID", pageWidth - 49, 20.5);

  // 2. Invoice Meta Details
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("INVOICE DETAILS", 18, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice No: INV-${bookingId.slice(-8).toUpperCase()}`, 18, 63);
  doc.text(`Issue Date: ${date}`, 18, 69);
  doc.text(`Payment Gateway: Stripe Card Checkout`, 18, 75);
  doc.text(`Transaction Ref: ${transactionId}`, 18, 81);

  // Customer Details (Right Aligned)
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILLED TO", pageWidth - 80, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Athlete: ${userName}`, pageWidth - 80, 63);
  doc.text(`Email: ${userEmail}`, pageWidth - 80, 69);
  doc.text(`Membership Status: Active Member`, pageWidth - 80, 75);

  // Separator Line
  doc.setDrawColor(226, 232, 240);
  doc.line(18, 89, pageWidth - 18, 89);

  // 3. Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(18, 95, pageWidth - 36, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("DESCRIPTION / TRAINING PROGRAM", 22, 101.5);
  doc.text("TRAINER", 108, 101.5);
  doc.text("SCHEDULE", 140, 101.5);
  doc.text("AMOUNT (USD)", pageWidth - 45, 101.5);

  // Table Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(className.length > 38 ? className.substring(0, 35) + "..." : className, 22, 114);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Program Category: ${category}`, 22, 120);
  doc.text(`Access: Unlimited scheduled sessions & live workouts`, 22, 125);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(trainerName, 108, 114);
  doc.text(schedule.length > 20 ? schedule.substring(0, 18) + "..." : schedule, 140, 114);
  doc.text(`$${Number(price).toFixed(2)}`, pageWidth - 40, 114);

  // Table Bottom Line
  doc.setDrawColor(226, 232, 240);
  doc.line(18, 133, pageWidth - 18, 133);

  // 4. Totals Breakdown
  const totalsY = 142;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", pageWidth - 70, totalsY);
  doc.text(`$${Number(price).toFixed(2)}`, pageWidth - 25, totalsY, { align: "right" });

  doc.text("Platform Processing Fee:", pageWidth - 70, totalsY + 6);
  doc.text("$0.00", pageWidth - 25, totalsY + 6, { align: "right" });

  doc.text("Sales Tax (VAT 0%):", pageWidth - 70, totalsY + 12);
  doc.text("$0.00", pageWidth - 25, totalsY + 12, { align: "right" });

  // Grand Total Box
  doc.setFillColor(249, 115, 22); // orange-500
  doc.roundedRect(pageWidth - 75, totalsY + 18, 57, 12, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("TOTAL PAID:", pageWidth - 70, totalsY + 25.5);
  doc.text(`$${Number(price).toFixed(2)}`, pageWidth - 22, totalsY + 25.5, { align: "right" });

  // 5. Verification Seal & Notes
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(18, 142, 90, 42, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(18, 142, 90, 42, 3, 3, "D");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("AUTHORIZED DIGITAL RECEIPT", 24, 150);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("This receipt serves as official proof of payment", 24, 156);
  doc.text("and admission voucher to the assigned class.", 24, 161);
  doc.text("Present this document at the gym reception or", 24, 166);
  doc.text("log in to your portal to join live video streams.", 24, 171);
  doc.text("Electronic Signature: Verified via Stripe Gateway", 24, 177);

  // 6. Footer
  const footerY = 275;
  doc.setDrawColor(226, 232, 240);
  doc.line(18, footerY - 5, pageWidth - 18, footerY - 5);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PulseForge Fitness & Gym Management Platform • Support: support@pulseforge.com", pageWidth / 2, footerY, { align: "center" });
  doc.text("Thank you for choosing PulseForge. Forge your peak form every day!", pageWidth / 2, footerY + 5, { align: "center" });

  // Save the PDF
  const cleanFileName = `PulseForge_Invoice_${className.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 15)}_${Date.now()}.pdf`;
  doc.save(cleanFileName);
}
