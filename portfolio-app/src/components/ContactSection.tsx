"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Get In <span className="text-primary">Touch</span>
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Contact Information</h3>

            <ContactRow
              icon={<Mail className="h-8 w-8" />}
              title="Email"
              value="mail@gmail.com"
              href="mailto:mail@gmail.com"
            />

            <ContactRow
              icon={<Phone className="h-8 w-8" />}
              title="Phone"
              value="+49 12345678"
              href="tel:+4912345678"
            />

            <ContactRow
              icon={<MapPin className="h-8 w-8" />}
              title="Location"
              value="Dummy. Du, mmy"
            />
          </div>

          <div className="rounded-lg bg-card p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-semibold">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField id="name" label="Your Name" placeholder="Enter your Name" required />
              <InputField
                id="email"
                type="email"
                label="Your Email"
                placeholder="Enter your Email"
                required
              />
              <TextareaField
                id="message"
                label="Your Message"
                placeholder="Hello, I'd like to talk about ..."
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="cosmic-button flex w-full items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Sending ..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

type ContactRowProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
};

function ContactRow({ icon, title, value, href }: ContactRowProps) {
  const Wrapper = href ? "a" : "p";

  return (
    <div className="flex items-start gap-4">
      <div className="rounded-full bg-primary/20 p-3">{icon}</div>
      <div className="flex flex-col items-start">
        <h4 className="font-medium">{title}</h4>
        <Wrapper
          {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined } : {})}
          className="transition-colors duration-300 hover:text-primary"
        >
          {value}
        </Wrapper>
      </div>
    </div>
  );
}

type InputFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
};

function InputField({ id, label, placeholder, required, type = "text" }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
};

function TextareaField({ id, label, placeholder, required }: TextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        className="h-32 w-full rounded-md border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
