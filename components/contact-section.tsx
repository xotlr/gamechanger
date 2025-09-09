"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Mail, MapPin } from "lucide-react"

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")

      // Reset form after success
      const form = e.target as HTMLFormElement
      form.reset()

      // Reset status after a delay
      setTimeout(() => {
        setFormStatus("idle")
      }, 3000)
    }, 1500)
  }

  // Function to get button text with CRT flicker effect
  const getButtonText = () => {
    if (formStatus === "idle") return "Anfrage senden"
    if (formStatus === "submitting") return "Wird gesendet..."
    if (formStatus === "success") return "Erfolgreich gesendet!"
    if (formStatus === "error") return "Fehler beim Senden"
    return "Anfrage senden"
  }

  return (
    <>
      <section className="py-20 relative" id="member">
        
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 glitch-text" data-text="Mitglied werden">
              Mitglied werden
            </h2>
            <p className="text-lg max-w-3xl mx-auto crt-text">
              Wir "GAME:changer" stehen für eine inklusive und diverse eSports-Community. Unsere kollektiven Ziele sind
              Soziale Integration, Talente fördern und soziale Gemeinschaften stärken. Mit unserem Konzept zur Förderung
              von eSports entgegnen wir soziale, wirtschaftliche und technologische Herausforderungen, woraus wir
              gleichzeitig Chancen schaffen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="balatro-card p-6"
            >
              <h3 className="text-2xl font-bold mb-6 crt-text-red">Kontaktiere uns</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm">
                    Nachricht
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057]"
                  />
                </div>

                <Button
                  type="submit"
                  className={`w-full crt-button button-hover-effect ${formStatus === "success" ? "bg-[#2196f3]" : ""}`}
                  disabled={formStatus === "submitting"}
                >
                  <span className={formStatus === "submitting" ? "crt-flicker" : ""}>
                    {getButtonText()}
                  </span>
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="balatro-card p-6">
                <h3 className="text-2xl font-bold mb-6 crt-text-blue">Kontaktinformationen</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Mail className="h-6 w-6 mr-3 text-[#ff0057] flex-shrink-0 mt-0.5" />
                    <span className="crt-text">verein.gamechanger@gmail.com</span>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-[#2196f3] flex-shrink-0 mt-0.5" />
                    <span className="crt-text">Pleissing, Niederösterreich, Austria</span>
                  </li>
                  <li className="flex items-start">
                    <Facebook className="h-6 w-6 mr-3 text-[#ff0057] flex-shrink-0 mt-0.5" />
                    <a
                      href="https://www.facebook.com/profile.php?id=61565503147498"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#2196f3] transition-colors crt-text"
                    >
                      GAME:changer auf Facebook
                    </a>
                  </li>
                </ul>
              </div>

              <div className="balatro-card p-6">
                <h3 className="text-xl font-bold mb-4 crt-text-red">Über den Verein</h3>
                <p className="crt-text">
                  Unser gemeinnütziger Verein, dessen Tätigkeit nicht auf Gewinn gerichtet ist, bezweckt gesellige
                  Zusammenkünfte um (vorwiegend Online via Multiplayer-Modus) mit und/oder gegeneinander, auf
                  Spielekonsolen und/oder geeigneten Gaming PCs/Laptops zu spielen, aber auch klassische Videospiele
                  sollen auf Retro- Spielekonsolen gespielt werden.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-[#ff0057]/30" id="impressum">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 crt-text-blue">Impressum</h2>
          <div className="space-y-4 crt-text">
            <p>
              GAME:changer
              <br />
              Gemeinnütziger Verein
              <br />
              (ZVR-Zahl: 1759611362)
            </p>

            <p>
              Für den Inhalt verantwortlich: David Brandhuber, Michael Wojnar
              <br />
              lllustration: Iris Brandhuber
            </p>

            <p>
              Graphikdesign: David Brandhuber
              <br />
              Webdesign: Ronald Bauer
              <br />
              Social Media: David Brandhuber, Katrin Brandhuber, Iris Brandhuber
            </p>

            <p>Kontakt unter: verein.gamechanger@gmail.com</p>
          </div>
        </div>
      </section>
    </>
  )
}