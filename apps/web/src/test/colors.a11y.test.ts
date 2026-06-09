import { contrastRatio } from './contrast'

// Valores definidos em apps/web/src/styles.css (@theme)
const colors = {
  brand:            '#81fe88',
  brandHover:       '#6ee676',
  onBrand:          '#132e35',
  pageBg:           '#0a0d0e',
  cardBg:           '#17191b',
  inputBg:          '#2a2d2f',
  inputBorder:      '#3a3d3f',
  inputPlaceholder: '#6b6f70',
  textPrimary:      '#f0f0f0',
  textMuted:        '#8c9094',
  error:            '#f87171',
}

// WCAG 2.1 AA: 4,5:1 para texto normal (<18pt / <14pt bold)
const AA_NORMAL = 4.5

describe('Contraste de cores – WCAG 2.1 AA (WCAG 1.4.3)', () => {
  describe('Texto principal (textPrimary)', () => {
    it('sobre card background', () => {
      expect(contrastRatio(colors.textPrimary, colors.cardBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })

    it('sobre input background', () => {
      expect(contrastRatio(colors.textPrimary, colors.inputBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })
  })

  describe('Texto auxiliar (textMuted)', () => {
    it('sobre card background', () => {
      expect(contrastRatio(colors.textMuted, colors.cardBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })

    it('sobre page background', () => {
      expect(contrastRatio(colors.textMuted, colors.pageBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })
  })

  describe('Placeholder de input (inputPlaceholder)', () => {
    it('sobre input background deve atingir 4,5:1', () => {
      // WCAG 1.4.3 se aplica a placeholder pois transmite informação ao usuário
      expect(contrastRatio(colors.inputPlaceholder, colors.inputBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })
  })

  describe('Botão primário', () => {
    it('texto (onBrand) sobre fundo (brand)', () => {
      expect(contrastRatio(colors.onBrand, colors.brand)).toBeGreaterThanOrEqual(AA_NORMAL)
    })

    it('texto (onBrand) sobre brand em hover (brandHover)', () => {
      expect(contrastRatio(colors.onBrand, colors.brandHover)).toBeGreaterThanOrEqual(AA_NORMAL)
    })
  })

  describe('Mensagem de erro (error)', () => {
    it('sobre card background', () => {
      expect(contrastRatio(colors.error, colors.cardBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })

    it('sobre input background', () => {
      expect(contrastRatio(colors.error, colors.inputBg)).toBeGreaterThanOrEqual(AA_NORMAL)
    })
  })
})
