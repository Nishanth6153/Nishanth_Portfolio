/**
 * Content model — typed data file for all personal portfolio content.
 * Per spec §8: managed separately from scene logic.
 * All fields use clearly marked placeholders until user supplies final details.
 */

export interface OnlineProfile {
  label: string
  url: string
  display: string
}

export interface ContentModel {
  identity: {
    name: string
    tagline: string
    shortBio: string
  }
  about: string[]           // paragraphs
  profiles: OnlineProfile[]
  credits: string           // attribution text for third-party assets used
}

export const CONTENT: ContentModel = {
  identity: {
    name: '[YOUR NAME]',
    tagline: '[YOUR TAGLINE]',
    shortBio: '[SHORT INTRODUCTION — one or two sentences.]',
  },
  about: [
    '[YOUR BIOGRAPHY — replace this paragraph with your own.]',
    '[SECOND PARAGRAPH — career highlights, current focus, etc.]',
  ],
  profiles: [
    { label: 'GitHub',   url: 'https://github.com/[YOUR_HANDLE]',   display: 'github.com/[YOUR_HANDLE]' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/[YOUR_HANDLE]', display: 'linkedin.com/in/[YOUR_HANDLE]' },
  ],
  credits: 'Credits for third-party assets will appear here once assets are sourced and licensed.',
}
