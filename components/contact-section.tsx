"use client"

import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NetworkIcon, MailIcon, LandmarkIcon } from "raster-react"
import { Panel } from "./ui/panel"

type Status = "idle" | "sending" | "success" | "error"

const STATUS_TEXT: Record<Status, string> = {
  idle: "Anfrage senden",
  sending: "Wird gesendet...",
  success: "Erfolgreich gesendet!",
  error: "Fehler beim Senden",
}

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const reset = (delay: number) => {
    setTimeout(() => {
      setStatus("idle")
      setError("")
    }, delay)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (res.ok) {
        setStatus("success")
        form.reset()
        reset(3000)
      } else {
        setStatus("error")
        setError(json.error || 'Unbekannter Fehler')
        reset(5000)
      }
    } catch {
      setStatus("error")
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.')
      reset(5000)
    }
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
              Wir &ldquo;GAME:changer&rdquo; stehen für eine inklusive und diverse eSports-Community.
              Unsere kollektiven Ziele sind Soziale Integration, Talente fördern und soziale Gemeinschaften stärken.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Panel className="p-6 relative z-[10001]" borderColor="red">
                <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="KONTAKTIERE UNS">
                  KONTAKTIERE UNS
                </h3>
              <form onSubmit={onSubmit} className="space-y-6 relative z-[10003]">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm">Nachricht</label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="bg-black/30 border-[#ff0057] focus:border-[#ff0057] relative z-[10002]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className={`w-full crt-button button-hover-effect relative z-[10002] ${
                    status === "success" ? "bg-[#2196f3]" : status === "error" ? "bg-red-600" : ""
                  }`}
                >
                  <span className={status === "sending" ? "crt-flicker" : ""}>
                    {STATUS_TEXT[status]}
                  </span>
                </Button>

                {status === "error" && error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {status === "success" && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded">
                    <p className="text-green-400 text-sm">Nachricht gesendet! Wir melden uns bald.</p>
                  </div>
                )}
              </form>
              </Panel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Panel className="p-6">
                <h3 className="text-2xl font-bold mb-6 glitch-text" data-text="KONTAKTINFORMATIONEN">
                  KONTAKTINFORMATIONEN
                </h3>
                <ul className="space-y-4">
                  <ContactItem icon={<MailIcon size={20} strokeWidth={1} radius={1} style={{ color: "#ff0057" }} />}>
                    verein.gamechanger@gmail.com
                  </ContactItem>
                  <ContactItem icon={<LandmarkIcon size={20} strokeWidth={1} radius={1} style={{ color: "#2196f3" }} />}>
                    Pleissing, Niederösterreich, Austria
                  </ContactItem>
                  <ContactItem icon={<NetworkIcon size={20} strokeWidth={1} radius={1} style={{ color: "#ff0057" }} />}>
                    <a
                      href="https://www.facebook.com/profile.php?id=61565503147498"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#2196f3] transition-colors"
                    >
                      GAME:changer auf Facebook
                    </a>
                  </ContactItem>
                </ul>
              </Panel>

              <Panel className="p-6">
                <h3 className="text-xl font-bold mb-4 glitch-text" data-text="ÜBER DEN VEREIN">
                  ÜBER DEN VEREIN
                </h3>
                <p className="crt-text">
                  Unser gemeinnütziger Verein bezweckt gesellige Zusammenkünfte um mit und/oder gegeneinander
                  auf Spielekonsolen und Gaming PCs zu spielen. Auch klassische Videospiele auf Retro-Konsolen.
                </p>
              </Panel>
            </motion.div>
          </div>
        </div>

        <style jsx>{`
          form input, form textarea, form button {
            pointer-events: auto !important;
          }
        `}</style>
      </section>

      <section className="py-12 border-t border-[#ff0057]/30" id="impressum">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 glitch-text" data-text="IMPRESSUM">IMPRESSUM</h2>
          <div className="space-y-4 crt-text text-sm">
            <p>GAME:changer · Gemeinnütziger Verein · ZVR: 1759611362</p>
            <p>Verantwortlich: David Brandhuber, Michael Wojnar</p>
            <p>Design: Iris Brandhuber, David Brandhuber · Web: Ronald Bauer</p>
            <p>Kontakt: verein.gamechanger@gmail.com</p>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm">{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        required
        className="bg-black/30 border-[#ff0057] focus:border-[#ff0057] relative z-[10002]"
      />
    </div>
  )
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <span className="mr-3 flex-shrink-0 mt-0.5">{icon}</span>
      <span className="crt-text">{children}</span>
    </li>
  )
}
