import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faCircleExclamation, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DELIVERY_ZONES, STORE_CONFIG } from '../config/store'
import { useStore } from '../context/StoreContext'
import { buildWhatsAppUrl, createOrderMessage } from '../utils/whatsapp'

const initial = { fullName: '', phone: '', province: '', customProvince: '', city: '', district: '', address: '', instructions: '' }

export function CheckoutDialog({ open, onOpenChange }) {
  const { cartDetails, subtotal, deliverySummary, orderTotal } = useStore()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [configNotice, setConfigNotice] = useState(false)
  const selectedZone = DELIVERY_ZONES.find(zone => zone.value === form.province)
  const update = e => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }
  const updateProvince = e => {
    const province = e.target.value
    const zone = DELIVERY_ZONES.find(item => item.value === province)
    setForm(current => ({ ...current, province, customProvince: '', city: zone?.cities.length === 1 ? zone.cities[0] : '' }))
    setErrors(current => ({ ...current, province: '', customProvince: '', city: '' }))
  }
  const submit = e => {
    e.preventDefault()
    const next = {}
    if (form.fullName.trim().length < 3) next.fullName = 'Indiquez votre nom complet.'
    if (!/^\+?[0-9\s()-]{8,}$/.test(form.phone)) next.phone = 'Indiquez un numéro de téléphone valide.'
    if (!form.province) next.province = 'Sélectionnez votre province.'
    if (form.province === 'autre' && !form.customProvince.trim()) next.customProvince = 'Indiquez le nom de votre province.'
    if (!form.city.trim()) next.city = 'Indiquez votre ville.'
    if (!form.district.trim()) next.district = 'Indiquez votre commune ou quartier.'
    if (form.address.trim().length < 8) next.address = 'Donnez davantage de précisions sur votre adresse.'
    setErrors(next)
    if (Object.keys(next).length) return
    const province = form.province === 'autre' ? form.customProvince.trim() : selectedZone?.label || form.province
    const url = buildWhatsAppUrl(createOrderMessage({ ...form, province }, cartDetails, subtotal, deliverySummary, orderTotal))
    if (!url) { setConfigNotice(true); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl">
    <span className="eyebrow">Livraison</span><DialogTitle className="mt-2">Où souhaitez-vous être livré ?</DialogTitle><DialogDescription>Renseignez vos coordonnées. WhatsApp s’ouvrira ensuite avec votre demande complète. Le paiement s’effectue à la livraison.</DialogDescription>
    {configNotice && <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4 text-sm text-gold-900"><FontAwesomeIcon icon={faCircleExclamation} className="mt-1" /><p>Le numéro WhatsApp de VitalNova n’est pas encore configuré. Ajoutez-le dans <code>src/config/store.js</code> avant la mise en ligne.</p></div>}
    <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
      <Field label="Nom complet *" error={errors.fullName}><Input name="fullName" value={form.fullName} onChange={update} autoComplete="name" required aria-invalid={Boolean(errors.fullName)} /></Field>
      <Field label="Téléphone / WhatsApp *" error={errors.phone}><Input name="phone" value={form.phone} onChange={update} inputMode="tel" autoComplete="tel" placeholder="Ex. +243…" required aria-invalid={Boolean(errors.phone)} /></Field>
      <Field label="Province *" error={errors.province}><select name="province" value={form.province} onChange={updateProvince} className="input-base" required aria-invalid={Boolean(errors.province)}><option value="">Sélectionner une province</option>{DELIVERY_ZONES.map(zone => <option key={zone.value} value={zone.value}>{zone.label}</option>)}</select></Field>
      {form.province === 'autre' && <Field label="Nom de la province *" error={errors.customProvince}><Input name="customProvince" value={form.customProvince} onChange={update} autoComplete="address-level1" placeholder="Votre province" required aria-invalid={Boolean(errors.customProvince)} /></Field>}
      <Field label="Ville *" error={errors.city}>{form.province === 'autre' ? <Input name="city" value={form.city} onChange={update} autoComplete="address-level2" placeholder="Votre ville" required aria-invalid={Boolean(errors.city)} /> : <select name="city" value={form.city} onChange={update} className="input-base" disabled={!selectedZone} required aria-invalid={Boolean(errors.city)}><option value="">{selectedZone ? 'Sélectionner une ville' : 'Choisissez d’abord une province'}</option>{(selectedZone?.cities || []).map(city => <option key={city} value={city}>{city}</option>)}</select>}</Field>
      <Field label="Commune ou quartier *" error={errors.district}><Input name="district" value={form.district} onChange={update} autoComplete="address-level3" placeholder="Votre commune ou quartier" required aria-invalid={Boolean(errors.district)} /></Field>
      <Field label="Précisions sur l’adresse *" error={errors.address} className="sm:col-span-2"><textarea name="address" value={form.address} onChange={update} rows="4" className="input-base h-auto py-3" autoComplete="street-address" placeholder="Avenue, numéro, bâtiment et point de repère…" required aria-invalid={Boolean(errors.address)} /></Field>
      <Field label="Instructions supplémentaires (facultatif)" className="sm:col-span-2"><textarea name="instructions" value={form.instructions} onChange={update} rows="3" className="input-base h-auto py-3" placeholder="Préférence de contact, indication utile pour la livraison…" /></Field>
      <div className="sm:col-span-2 flex gap-3 rounded-xl bg-green-50 p-4 text-xs leading-5 text-green-900"><FontAwesomeIcon icon={faShieldHalved} className="mt-1" /><p>Votre demande devra encore être vérifiée et confirmée par le commerçant. Aucun paiement n’est collecté en ligne : vous payez à la livraison.</p></div>
      <Button type="submit" size="lg" className="sm:col-span-2 bg-[#128C4A] hover:bg-[#0d753d]"><FontAwesomeIcon icon={faWhatsapp} className="text-xl" />Confirmer sur WhatsApp</Button>
    </form>
    {!STORE_CONFIG.whatsappNumber && <p className="mt-3 text-center text-xs text-stone-400">Mode présentation : numéro WhatsApp à configurer.</p>}
  </DialogContent></Dialog>
}

function Field({ label, error, className = '', children }) {
  return <label className={`grid gap-1.5 text-sm font-bold text-stone-700 ${className}`}><span>{label}</span>{children}{error && <span className="text-xs font-medium text-red-600">{error}</span>}</label>
}
