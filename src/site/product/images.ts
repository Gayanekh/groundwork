import type { PhotoData } from './Photo';

/** Unsplash photos (Unsplash License), self-hosted in /public/images. Illustrative only: never shown as customers. */
export const PHOTOS = {
  installers: {
    src: '/images/roof-installers.jpg',
    alt: 'Two installers in safety harnesses set a solar panel on a shingle roof.',
    photographer: 'Raze Solar',
    pageUrl: 'https://unsplash.com/photos/pIcseKMisrs',
  },
  homeowner: {
    src: '/images/homeowner.jpg',
    alt: 'A woman on the phone with a laptop open on her kitchen table.',
    photographer: 'Vitaly Gariev',
    pageUrl: 'https://unsplash.com/photos/woman-talking-on-phone-while-working-on-laptop-at-table-j5B2A4R4NKU',
  },
  coordinator: {
    src: '/images/coordinator.jpg',
    alt: 'A man in glasses reviews documents at a desk with a laptop.',
    photographer: 'Vitaly Gariev',
    pageUrl: 'https://unsplash.com/photos/man-in-glasses-reviewing-documents-at-desk-xQydhL4LmlA',
  },
} satisfies Record<string, PhotoData>;
