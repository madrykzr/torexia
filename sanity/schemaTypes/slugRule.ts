// Shared reminder + guard for every "Slug" (page address) box in Studio.
// The owner kept typing addresses by hand with spaces/capitals ("office wear"),
// which makes the page 404. The box now explains itself, and refuses to publish
// an address that can't work.

export const SLUG_HELP =
  'DON’T TYPE THIS — click “Generate”. It makes the page address from the name. A space or a capital letter in it makes the page show “404 not found”.'

export const slugCheck = (value: {current?: string} | undefined) => {
  const slug = value?.current
  if (!slug) return true
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ? true
    : 'This address won’t work (spaces or capital letters). Delete it and click “Generate” instead of typing.'
}
