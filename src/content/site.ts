export interface SiteProject { name: string; summary: string; href?: string }
export interface SitePost { title: string; date: string; href?: string }
export interface SiteProfile { label: string; url: string }

// Empty fields stay omitted from production UI until owner-approved content is supplied.
export const SITE = {
  title: 'Portfolio',
  name: '',
  biography: [] as string[],
  projects: [] as SiteProject[],
  posts: [] as SitePost[],
  profiles: [] as SiteProfile[],
  email: '',
}

export interface AssetCredit { title: string; author: string; license: string; url: string }
export const ASSET_CREDITS: AssetCredit[] = []
