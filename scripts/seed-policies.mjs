/**
 * Creates the four policy pages as UNPUBLISHED DRAFTS in Sanity for Torexia to
 * review. Nothing is visible on the website (and no footer link appears) until
 * each page is published in Studio → Policy Pages. Safe to re-run: it never
 * overwrites a page that already exists.
 *
 * Run:  npm run seed:policies
 */
import {createClient} from '@sanity/client'
import crypto from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'raw',
})

const key = () => crypto.randomBytes(6).toString('hex')
// Text with **bold** pieces → spans
const spans = (text) =>
  text.split('**').map((t, i) => ({_type: 'span', _key: key(), text: t, marks: i % 2 ? ['strong'] : []})).filter((s) => s.text)
const block = (style, text, extra = {}) => ({_type: 'block', _key: key(), style, markDefs: [], children: spans(text), ...extra})
const h2 = (t) => block('h2', t)
const p = (t) => block('normal', t)
const li = (t) => block('normal', t, {listItem: 'bullet', level: 1})

const BUSINESS =
  'TOREX VENTURES (SSM 202603081374 (AS0512454-V)), PT 57249B, Level 1, Limau Manis Village, Off Putrajaya, Sg. Merab, 43000 Kajang, Selangor, Malaysia'
const contact = () => [
  h2('Contact us'),
  p('WhatsApp: +60 13-220 9408'),
  p('Email: hello@torexiacom.biz'),
  p(`${BUSINESS}.`),
]
const draftNote = (confirm) =>
  block(
    'normal',
    `**DRAFT FOR APPROVAL — Torexia, please read every line.** ${confirm} When you are happy, delete this paragraph and press Publish. The page and its footer link only appear on the website after you publish.`,
  )

const pages = [
  {
    id: 'policy-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    order: 1,
    body: [
      draftNote(
        'Please confirm: the list of services we share data with is correct, and that you are happy to add a Bahasa Malaysia notice (Malaysian law asks for notices in both English and Bahasa Malaysia). This text is a general draft and is not legal advice — have it checked if you can.',
      ),
      h2('Who we are'),
      p(
        `This website, ladytorexia.my, is run by ${BUSINESS} (“Torexia”, “we”, “us”). We handle your personal data in line with Malaysia’s Personal Data Protection Act 2010 (PDPA).`,
      ),
      h2('What information we collect'),
      li('**Order details:** your name, email address, phone number, delivery address and what you ordered.'),
      li('**Messages** you send us, for example on WhatsApp or by email.'),
      li('**Browsing information:** pages viewed and the type of device and browser, collected through cookies and similar tools (see “Cookies and advertising” below).'),
      p('We do not see or store your card or bank details. Payments are handled by our payment provider.'),
      h2('How we use your information'),
      li('To process, pack and deliver your order, and to contact you about it.'),
      li('To send your order confirmation and shipping emails.'),
      li('To answer your questions and deal with returns and refunds.'),
      li('To keep accounting and legal records.'),
      li('To understand how the website is used and to measure and improve our advertising.'),
      h2('Who we share it with'),
      p('We only share what is needed:'),
      li('**Payment:** HitPay processes your payment (online banking, cards and other methods shown at checkout).'),
      li('**Delivery:** courier companies, arranged through EasyParcel, receive your name, phone number and delivery address.'),
      li('**Services that run the website:** hosting (Vercel), content management (Sanity) and email sending (Resend).'),
      li('**Advertising and measurement:** TikTok, through the TikTok Pixel (see below).'),
      p('We do not sell your personal data. We may also share information if the law requires it.'),
      h2('Cookies and advertising'),
      p(
        'Our website uses the TikTok Pixel. It records actions such as viewing a product, adding to cart, starting checkout and completing a purchase, so that we can measure and improve our TikTok advertising and show our ads to relevant people. TikTok may use cookies and similar technology for this. You can block cookies in your browser settings, or change ad personalisation in your TikTok account settings.',
      ),
      h2('How long we keep it'),
      p('We keep your information for as long as needed to complete your order, deal with returns, and meet accounting and legal requirements. After that we delete or anonymise it.'),
      h2('Your rights'),
      p('Under the PDPA you may ask to see the personal data we hold about you, ask us to correct it, or withdraw your consent for us to use it for marketing. Contact us using the details below. We may need to confirm who you are first.'),
      h2('Keeping it safe'),
      p('We use reputable providers and access controls to protect your information. No website is completely secure, so please also keep your own devices and passwords safe.'),
      h2('Ringkasan dalam Bahasa Malaysia'),
      p(
        'Kami mengumpul nama, e-mel, nombor telefon dan alamat penghantaran anda untuk memproses dan menghantar pesanan. Kami hanya berkongsi maklumat dengan pihak yang perlu: pembayaran melalui HitPay, syarikat kurier, dan perkhidmatan yang menjalankan laman web ini. Kami menggunakan TikTok Pixel untuk mengukur dan memperbaiki iklan kami. Kami tidak menjual data peribadi anda. Di bawah Akta Perlindungan Data Peribadi 2010, anda boleh meminta akses, pembetulan atau menarik balik persetujuan anda dengan menghubungi kami.',
      ),
      h2('Changes to this policy'),
      p('We may update this policy from time to time. The date at the top of the page shows when it was last changed.'),
      ...contact(),
    ],
  },
  {
    id: 'policy-terms',
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    order: 2,
    body: [
      draftNote(
        'Please confirm that you are happy with every section. This text is a general draft and is not legal advice — have it checked if you can.',
      ),
      h2('About these terms'),
      p(`By ordering from ladytorexia.my you agree to these terms. The website is run by ${BUSINESS} (“Torexia”, “we”, “us”).`),
      h2('Products and colours'),
      p('We show our pieces as accurately as we can. Colours can look slightly different on different screens, and fabric may vary a little between batches.'),
      h2('Prices'),
      p('All prices are in Malaysian Ringgit (RM). Sale prices apply while they are shown on the website. We may change prices at any time, but the price you see when you pay is the price you are charged.'),
      h2('Placing an order'),
      p('Your order is confirmed once your payment is successful and you receive our confirmation email. Orders depend on available stock. If an item turns out to be unavailable, we will tell you and refund you in full.'),
      h2('Payment'),
      p('Payments are processed securely by HitPay using the methods shown at checkout, for example online banking (FPX), cards and other options. We do not store your card or bank details.'),
      h2('Delivery, returns and refunds'),
      p('Please read our Shipping Policy and our Returns & Refunds page. They form part of these terms.'),
      h2('Changing or cancelling an order'),
      p('Message us on WhatsApp as soon as possible. We can only change or cancel an order before it has been posted.'),
      h2('Our content'),
      p('All photos, text, logos and designs on this website belong to Torexia. Please do not copy or use them without our written permission.'),
      h2('Our responsibility'),
      p('We do our best to keep the website running and accurate, but we cannot promise it will always be available or free of errors. As far as the law allows, we are not responsible for indirect losses.'),
      h2('Governing law'),
      p('These terms are governed by the laws of Malaysia.'),
      h2('Changes to these terms'),
      p('We may update these terms from time to time. The date at the top of the page shows when they were last changed.'),
      ...contact(),
    ],
  },
  {
    id: 'policy-shipping',
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    order: 3,
    body: [
      draftNote(
        'Please confirm these details match how you really work: packing time of 1–3 working days; delivery estimates of 2–5 working days (West Malaysia) and 5–10 working days (Sabah, Sarawak, Labuan); and the 3-day window for reporting damaged or missing parcels.',
      ),
      h2('Where we deliver'),
      p('We deliver within Malaysia: West Malaysia, and Sabah, Sarawak and Labuan.'),
      h2('Packing time'),
      p('We usually pack and post orders within 1–3 working days after your payment is confirmed. Orders placed on weekends, public holidays or during big sales can take a little longer.'),
      h2('Couriers and tracking'),
      p('We ship with courier partners arranged through EasyParcel. As soon as your order is posted, we email you the courier name and a tracking number or link.'),
      h2('Delivery time'),
      li('**West Malaysia:** about 2–5 working days after posting.'),
      li('**Sabah, Sarawak and Labuan:** about 5–10 working days after posting.'),
      p('These are estimates, not guarantees. Weather, public holidays and courier delays can add time.'),
      h2('Delivery fees'),
      p('Any delivery fee is shown at checkout before you pay. When we run a free-shipping offer, it is shown on the website.'),
      h2('Your address'),
      p('Please check your address and phone number carefully. The courier may call you before delivery. If a parcel comes back because the address was wrong or nobody collected it, sending it again is at your cost.'),
      h2('Damaged or missing parcels'),
      p('If your parcel arrives damaged, or does not arrive, message us within 3 days of the delivery date (or the date it was expected) with your order number and photos, and we will help.'),
      ...contact(),
    ],
  },
  {
    id: 'policy-returns',
    title: 'Returns & Refunds',
    slug: 'returns-and-refunds',
    order: 4,
    body: [
      draftNote(
        'These are SUGGESTED rules — they are your business decisions, so please change anything that is not how you want to work. In particular confirm: 3 days to report a problem; no returns for change of mind; who pays return delivery; and 7–14 working days for refunds.',
      ),
      h2('Wrong, damaged or faulty items'),
      p('If your item arrives wrong, damaged or faulty, message us within 3 days of delivery with your order number, clear photos and, if you can, a short unboxing video. We will arrange an exchange or a refund.'),
      h2('Change of mind and size'),
      p('Our pieces are made in limited quantities, so we cannot accept returns for change of mind. Please check the Size Guide on each product page before you order. A size exchange may be possible, depending on stock — message us first.'),
      h2('Condition of returned items'),
      p('Items must be unworn, unwashed, and have their tags and packaging.'),
      h2('How to return something'),
      li('Message us on WhatsApp first. Please do not post anything back before we confirm.'),
      li('If the item was wrong or faulty, we cover the return delivery. For other approved exchanges, you pay for return delivery.'),
      h2('Refunds'),
      p('Approved refunds go back to your original payment method through HitPay, usually within 7–14 working days. Delivery fees are refunded only when we sent the wrong or faulty item, or when we cancel your order.'),
      h2('Cancelled or out-of-stock orders'),
      p('If we cancel your order, or an item is out of stock, you receive a full refund.'),
      ...contact(),
    ],
  },
]

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  for (const pg of pages) {
    const draftId = `drafts.${pg.id}`
    const exists = (await client.fetch(`count(*[_id in [$d, $p]])`, {d: draftId, p: pg.id})) > 0
    if (exists) {
      console.log(`- ${pg.title}: already exists, left untouched`)
      continue
    }
    await client.create({
      _id: draftId,
      _type: 'policyPage',
      title: pg.title,
      slug: {_type: 'slug', current: pg.slug},
      order: pg.order,
      updated: today,
      body: pg.body,
    })
    console.log(`- ${pg.title}: draft created`)
  }
}

// Never print the raw error — a network failure dumps the request, including the token.
main().catch((e) => {
  console.error('Failed:', e?.cause?.code || e?.statusCode || e?.message?.slice(0, 120))
  process.exit(1)
})
