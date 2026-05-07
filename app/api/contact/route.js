import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { recordLead } from "../../../lib/visitorStore";

const RECEIVER_EMAIL = "wrapifysolutions@gmail.com";

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const rawServices = body?.services;
    const services = Array.isArray(rawServices)
      ? rawServices.map((s) => String(s || "").trim()).filter(Boolean)
      : [];
    const serviceOther = String(body?.serviceOther || "").trim().slice(0, 200);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await recordLead({
      name,
      email,
      source: "contact-form",
      services,
      serviceOther
    });

    const transporter = createTransport();
    if (!transporter) {
      return NextResponse.json(
        { error: "Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS." },
        { status: 500 }
      );
    }

    const servicesLine = services.length ? services.join(", ") : "(none selected)";
    const otherLine = serviceOther || "(none)";

    try {
      await transporter.sendMail({
        from: `"Wrapify Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: RECEIVER_EMAIL,
        replyTo: email,
        subject: `New Website Contact: ${name}`,
        text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nServices: ${servicesLine}\nOther detail: ${otherLine}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escHtml(name)}</p>
          <p><strong>Email:</strong> ${escHtml(email)}</p>
          <p><strong>Services:</strong> ${escHtml(servicesLine)}</p>
          <p><strong>Other detail:</strong> ${escHtml(otherLine)}</p>
          <p><strong>Message:</strong></p>
          <p>${escHtml(message).replace(/\n/g, "<br/>")}</p>
        `
      });

      return NextResponse.json({ success: true, emailSent: true });
    } catch (mailError) {
      console.error("Contact API sendMail error:", mailError);
      return NextResponse.json({
        success: true,
        emailSent: false,
        warning: "Your request was saved. Email notification is temporarily unavailable."
      });
    }
  } catch (error) {
    console.error("Contact API sendMail error:", error);

    const code = String(error?.code || "");
    let message = "Failed to send message. Please try again.";

    if (code === "EAUTH") {
      message = "Email authentication failed. Recheck SMTP_USER and SMTP_PASS on the server.";
    } else if (code === "ECONNECTION" || code === "ETIMEDOUT") {
      message = "Email server connection failed. Recheck SMTP_HOST, SMTP_PORT, and server network access.";
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
