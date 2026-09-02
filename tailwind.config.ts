import type { Config } from 'tailwindcss'

/**
 * Every value here maps to a CSS variable defined in src/app/globals.css,
 * which is a direct transcription of the Claude Design export tokens under
 * design-reference/_ds/itutor-design-system-<id>/tokens/ (colors.css,
 * typography.css, spacing.css, effects.css, fonts.css).
 * Do not invent values — add them to globals.css first, then alias here.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Raw brand palette
        itutor: {
          green: 'var(--itutor-green)',
          black: 'var(--itutor-black)',
          white: 'var(--itutor-white)',
          card: 'var(--itutor-card)',
          border: 'var(--itutor-border)',
          muted: 'var(--itutor-muted)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)',
          accent: 'var(--brand-accent)',
          soft: 'var(--brand-soft)',
          deep: 'var(--brand-deep)',
        },
        ink: { DEFAULT: 'var(--ink)', muted: 'var(--ink-muted)' },
        forest: 'var(--forest)',
        coral: { DEFAULT: 'var(--coral)', soft: 'var(--coral-soft)' },
        mint: { DEFAULT: 'var(--mint)', deep: 'var(--mint-deep)' },
        lavender: 'var(--lavender)',
        peach: 'var(--peach)',
        sky: 'var(--sky)',
        surface: {
          DEFAULT: 'var(--surface)',
          soft: 'var(--surface-soft)',
          border: 'var(--surface-border)',
          card: 'var(--surface-card)',
          page: 'var(--surface-page)',
          inset: 'var(--surface-inset)',
        },
        // Semantic aliases
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        border: 'var(--border)',
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
        warning: { bg: 'var(--warning-bg)', fg: 'var(--warning-fg)' },
        danger: { bg: 'var(--danger-bg)', fg: 'var(--danger-fg)' },
        info: { bg: 'var(--info-bg)', fg: 'var(--info-fg)' },
        progress: { bg: 'var(--progress-bg)', fg: 'var(--progress-fg)' },
        neutral: { bg: 'var(--neutral-bg)', fg: 'var(--neutral-fg)' },
        star: 'var(--star)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        hero: ['var(--text-hero)', { lineHeight: 'var(--leading-tight)' }],
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-tight)' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-snug)' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-snug)' }],
        h4: ['var(--text-h4)', { lineHeight: 'var(--leading-snug)' }],
        lg: 'var(--text-lg)',
        base: 'var(--text-base)',
        sm: 'var(--text-sm)',
        xs: 'var(--text-xs)',
        '2xs': 'var(--text-2xs)',
        '3xs': 'var(--text-3xs)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
        heading: 'var(--tracking-heading)',
        eyebrow: 'var(--tracking-eyebrow)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        card: 'var(--radius-card)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        band: 'var(--radius-band)',
      },
      boxShadow: {
        pop: 'var(--shadow-pop)',
        card: 'var(--shadow-card)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'hover-card': 'var(--shadow-hover-card)',
        glass: 'var(--shadow-glass)',
        'brand-glow': 'var(--shadow-brand-glow)',
        'button-green': 'var(--shadow-button-green)',
      },
      backgroundImage: {
        brand: 'var(--gradient-brand)',
        'brand-text': 'var(--gradient-brand-text)',
        'cta-band': 'var(--gradient-cta-band)',
        auth: 'var(--gradient-auth)',
        'auth-learner': 'var(--gradient-auth-learner)',
        'mint-wash': 'var(--gradient-mint-wash)',
        'peach-wash': 'var(--gradient-peach-wash)',
      },
      maxWidth: {
        marketing: 'var(--container-marketing)',
        content: 'var(--container-content)',
        narrow: 'var(--container-narrow)',
      },
      spacing: {
        card: 'var(--card-padding)',
        'card-lg': 'var(--card-padding-lg)',
        topbar: 'var(--topbar-h)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        reveal: 'var(--dur-reveal)',
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
      },
    },
  },
  plugins: [],
}

export default config
