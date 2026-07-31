"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-gold-300/30 p-8">
        <p className="font-display text-3xl text-gold-300">Your note has been received.</p>
        <p className="mt-3 text-sm text-mist/60">Our client team will respond within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field id="contact-name" label="Name" />
      <Field id="contact-email" label="Email" type="email" />
      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-[0.52rem] uppercase tracking-luxury text-mist/50">Subject</label>
        <select id="contact-subject" className="h-14 w-full border border-white/10 bg-obsidian px-4 text-sm outline-none focus:border-gold-300/60">
          <option>Product consultation</option>
          <option>Order assistance</option>
          <option>Private appointment</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-[0.52rem] uppercase tracking-luxury text-mist/50">Message</label>
        <textarea id="contact-message" required rows={5} className="w-full resize-none border border-white/10 bg-white/[0.025] p-4 text-sm outline-none focus:border-gold-300/60" />
      </div>
      <Button type="submit">Send enquiry</Button>
    </form>
  );
}

function Field({ id, label, type = "text" }: { id: string; label: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.52rem] uppercase tracking-luxury text-mist/50">{label}</label>
      <input id={id} type={type} required className="h-14 w-full border border-white/10 bg-white/[0.025] px-4 text-sm outline-none focus:border-gold-300/60" />
    </div>
  );
}
