"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NetworkIcon, MailIcon, LandmarkIcon } from "raster-react"

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("submitting")

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setFormStatus("success")
        form.reset()

        // Reset status after a delay
        setTimeout(() => {
          setFormStatus("idle")
        }, 3000)
      } else {
        console.error('Error:', result.error)
        setFormStatus("error")
        setErrorMessage(result.error || 'Unbekannter Fehler')
        
        // Reset status after a delay
        setTimeout(() => {
          setFormStatus("idle")
          setErrorMessage("")
        }, 5000)
      }
    } catch (error) {
      console.error('Network error:', error)
      setFormStatus("error")
      setErrorMessage('Netzwerkfehler. Bitte versuchen Sie es später erneut.')
      
      // Reset status after a delay
      setTimeout(() => {
        setFormStatus("idle")
        setErrorMessage("")
      }, 5000)
    }
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
      <section className="py-20 relative z-[10000]" id="member">
        
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 glitch-text" data-text="MITGLIED WERDEN">
              MITGLIED WERDEN
            </h2>
            <p className="text-lg max-w-3xl mx-auto crt-text">
              Wir &ldquo;GAME:changer&rdquo; stehen für eine inklusive und diverse eSports-Community. Unsere kollektiven Ziele sind
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
              className="balatro-card p-6 relative z-[10001]"
            >
              <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="KONTAKTIERE UNS">KONTAKTIERE UNS</h3>
              <form onSubmit={handleSubmit} className="space-y-6 relative z-[10003]" style={{ position: 'relative', zIndex: 10003 }}>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057] relative z-[10002]"
                    style={{ position: 'relative', zIndex: 10002 }}
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
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057] relative z-[10002]"
                    style={{ position: 'relative', zIndex: 10002 }}
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
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057] relative z-[10002]"
                    style={{ position: 'relative', zIndex: 10002 }}
                  />
                </div>

                <Button
                  type="submit"
                  className={`w-full crt-button button-hover-effect relative z-[10002] ${formStatus === "success" ? "bg-[#2196f3]" : ""} ${formStatus === "error" ? "bg-red-600" : ""}`}
                  style={{ position: 'relative', zIndex: 10002 }}
                  disabled={formStatus === "submitting"}
                >
                  <span className={formStatus === "submitting" ? "crt-flicker" : ""}>
                    {getButtonText()}
                  </span>
                </Button>
                
                {/* Error Message */}
                {formStatus === "error" && errorMessage && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
                
                {/* Success Message */}
                {formStatus === "success" && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded">
                    <p className="text-green-400 text-sm">Ihre Nachricht wurde erfolgreich gesendet! Wir melden uns bald bei Ihnen.</p>
                  </div>
                )}
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
                <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="KONTAKTINFORMATIONEN">KONTAKTINFORMATIONEN</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MailIcon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      className="mr-3 flex-shrink-0 mt-0.5" 
                      style={{ color: "#ff0057" }}
                    />
                    <span className="crt-text">verein.gamechanger@gmail.com</span>
                  </li>
                  <li className="flex items-start">
                    <LandmarkIcon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      className="mr-3 flex-shrink-0 mt-0.5" 
                      style={{ color: "#2196f3" }}
                    />
                    <span className="crt-text">Pleissing, Niederösterreich, Austria</span>
                  </li>
                  <li className="flex items-start">
                    <NetworkIcon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      className="mr-3 flex-shrink-0 mt-0.5" 
                      style={{ color: "#ff0057" }}
                    />
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
                <h3 className="text-xl font-bold mb-4 glitch-text" data-text="ÜBER DEN VEREIN">ÜBER DEN VEREIN</h3>
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
        
        {/* CSS to ensure form inputs are clickable */}
        <style jsx>{`
          form input,
          form textarea,
          form button {
            pointer-events: auto !important;
            position: relative;
            z-index: 10003;
          }
          
          .balatro-card {
            pointer-events: auto !important;
          }
        `}</style>
      </section>

      <section className="py-12 border-t border-[#ff0057]/30" id="impressum">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 glitch-text" data-text="IMPRESSUM">IMPRESSUM</h2>
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
              Illustration: Iris Brandhuber
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