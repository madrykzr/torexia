import {defineType, defineField, defineArrayMember} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export const ORDER_STATUS_OPTIONS = [
  {title: 'Pending', value: 'pending'},
  {title: 'Paid — to ship', value: 'paid'},
  {title: 'Shipped', value: 'shipped'},
  {title: 'Failed', value: 'failed'},
  {title: 'Cancelled', value: 'cancelled'},
]

// Orders are created server-side (app/api/checkout) when a customer pays via
// HitPay, and updated by the webhook / confirm route as payment status
// changes. Line items are a plain snapshot (not references) so an order stays
// accurate even if the underlying collection/item is later edited or removed.
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'string',
      description: 'Internal order reference — also used to match HitPay payments.',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ORDER_STATUS_OPTIONS, layout: 'radio'},
      initialValue: 'pending',
      description:
        'Paid orders appear under "To ship". After posting the parcel, set this to Shipped.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'courier',
      title: 'Courier',
      type: 'string',
      description: 'Optional — e.g. J&T, Pos Laju, Ninja Van.',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking number',
      type: 'string',
      description: 'Optional — fill in when you ship.',
    }),
    defineField({
      name: 'courierRequested',
      title: 'Book courier',
      type: 'boolean',
      description:
        'Tick this and press Publish to book a courier automatically (cheapest pick-up service). The tracking number and label appear below within a minute. Only works on paid orders.',
      initialValue: false,
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = (context.document as {status?: string} | undefined)?.status
          if (value && status !== 'paid') return 'Only paid orders can be booked.'
          return true
        }),
    }),
    defineField({
      name: 'courierError',
      title: 'Courier booking error',
      type: 'string',
      description: 'Only appears if the last booking attempt failed — fix the cause, then tick "Book courier" again.',
      readOnly: true,
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'courierName',
      title: 'Courier',
      type: 'string',
      description: 'Filled automatically when a courier is booked.',
      readOnly: true,
    }),
    defineField({
      name: 'awbUrl',
      title: 'Waybill (label) link',
      type: 'url',
      description: 'Open this to print the parcel label.',
      readOnly: true,
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Tracking link',
      type: 'url',
      readOnly: true,
    }),
    defineField({
      name: 'courierStatus',
      title: 'Courier status',
      type: 'string',
      description: 'Latest status from the courier (e.g. Delivery In Transit, Delivered).',
      readOnly: true,
    }),
    defineField({
      name: 'courierCost',
      title: 'Courier cost (RM)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'easyparcelShipmentNo',
      title: 'EasyParcel shipment number',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerName',
      title: 'Customer name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping address',
      type: 'object',
      fields: [
        defineField({name: 'line1', title: 'Address line 1', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'line2', title: 'Address line 2', type: 'string'}),
        defineField({name: 'city', title: 'City', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'state', title: 'State', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'postcode', title: 'Postcode', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'country', title: 'Country', type: 'string', initialValue: 'Malaysia'}),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'slug', title: 'Slug', type: 'string'}),
            defineField({name: 'kind', title: 'Kind', type: 'string'}),
            defineField({name: 'size', title: 'Size', type: 'string'}),
            defineField({name: 'colour', title: 'Colour', type: 'string'}),
            defineField({name: 'price', title: 'Price (RM)', type: 'number'}),
            defineField({name: 'qty', title: 'Quantity', type: 'number'}),
          ],
          preview: {
            select: {title: 'name', qty: 'qty', price: 'price'},
            prepare({title, qty, price}) {
              return {title, subtitle: `${qty} × RM${price}`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal (RM)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'shippingFee',
      title: 'Shipping fee (RM)',
      type: 'number',
      description: 'Charged to the customer at checkout (0 = free shipping).',
      validation: (rule) => rule.min(0),
    }),
    defineField({name: 'courierBookingClaimedAt', title: 'Courier booking claimed at', type: 'datetime', hidden: true}),
    defineField({name: 'courierBookedAt', title: 'Courier booked at', type: 'datetime', readOnly: true}),
    defineField({name: 'shippedNotifiedAt', title: 'Shipped email sent at', type: 'datetime', readOnly: true}),
    defineField({
      name: 'paidNotifiedAt',
      title: 'Paid alert sent at',
      type: 'datetime',
      description: 'Set automatically once the "new paid order" emails go out.',
      readOnly: true,
    }),
    defineField({
      name: 'stockDeductedAt',
      title: 'Stock deducted at',
      type: 'datetime',
      description: 'Set automatically once this order\'s items were deducted from stock.',
      readOnly: true,
    }),
    defineField({
      name: 'stockError',
      title: 'Stock deduction error',
      type: 'string',
      description: 'Only set if deducting stock for this order failed — check stock counts by hand.',
      readOnly: true,
    }),
    defineField({
      name: 'total',
      title: 'Total (RM)',
      type: 'number',
      description: 'Subtotal + shipping fee — the amount charged through HitPay.',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'hitpayPaymentRequestId',
      title: 'HitPay payment request ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'hitpayPaymentId',
      title: 'HitPay payment ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      description: 'Internal fulfilment notes — not shown to the customer.',
    }),
  ],
  preview: {
    select: {name: 'customerName', reference: 'reference', total: 'total', status: 'status'},
    prepare({name, reference, total, status}) {
      const tail = typeof reference === 'string' ? reference.slice(0, 8) : ''
      return {
        title: `${name ?? 'Unknown'} · ${tail}`,
        subtitle: `RM${total ?? 0} · ${status ?? 'pending'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
