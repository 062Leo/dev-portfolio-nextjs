"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { ThemeColorSet, useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const colors = useThemeColors(isDarkMode);

  const isFormEnabled = false;

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
        <h2
          className="mb-13 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.contactSectionTitleColor }}
        >
          {language === "de" ? (
            <>
              Kontakt <span style={{ color: colors.contactSectionAccentColor }}>aufnehmen</span>
            </>
          ) : (
            <>
              Get In <span style={{ color: colors.contactSectionAccentColor }}>Touch</span>
            </>
          )}
        </h2>

        <div className="flex justify-center">
         
          <div
            className="relative w-full max-w-xl rounded-lg p-8 shadow-sm md:w-3/4 lg:w-2/3"
            style={{
              backgroundColor: colors.contactSectionCardBackground,
              borderColor: colors.contactSectionCardBorder,
              boxShadow: colors.contactSectionCardShadow,
            }}
          >
            <div className="pointer-events-none opacity-60">
            </div>

            {!isFormEnabled && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-wide">
                  {language === "de" ? "Bald verfügbar" : "Coming Soon"}
                </div>
              </div>
            )}
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
  colors: ThemeColorSet;
};

function ContactRow({ icon, title, value, href, colors }: ContactRowProps) {
  const Wrapper = href ? "a" : "p";

  return (
    <div className="flex items-start gap-4">
      <div
        className="rounded-full p-3"
        style={{
          backgroundColor: colors.contactSectionIconBackground,
          color: colors.contactSectionIconColor,
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <h4 className="font-medium">{title}</h4>
        <Wrapper
          {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined } : {})}
          className="transition-colors duration-300"
          style={{ color: colors.contactSectionTitleColor }}
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
  colors: ThemeColorSet;
};

function InputField({ id, label, placeholder, required, type = "text", colors }: InputFieldProps) {
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
        className="w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.textPrimary,
        }}
      />
    </div>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  colors: ThemeColorSet;
};

function TextareaField({ id, label, placeholder, required, colors }: TextareaFieldProps) {
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
        className="h-32 w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.textPrimary,
        }}
      />
    </div>
  );
}
