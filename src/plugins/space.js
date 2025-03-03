import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'space-x': (modifier, { theme }) => {
          let value = asValue(modifier, theme['space'])

          if (value === undefined) {
            return []
          }

          value = value === '0' ? '0px' : value

          return {
            [`${nameClass('space-x', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-space-x-reverse': '0',
              'margin-right': `calc(${value} * var(--tw-space-x-reverse))`,
              'margin-left': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          }
        },
        'space-y': (modifier, { theme }) => {
          let value = asValue(modifier, theme['space'])

          if (value === undefined) {
            return []
          }

          value = value === '0' ? '0px' : value

          return {
            [`${nameClass('space-y', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-space-y-reverse': '0',
              'margin-top': `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              'margin-bottom': `calc(${value} * var(--tw-space-y-reverse))`,
            },
          }
        },
      })

      addUtilities({
        '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '1',
        },
        '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
      })
    } else {
      const generators = [
        (_size, modifier) => {
          const size = _size === '0' ? '0px' : _size
          return {
            [`${nameClass('space-y', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-space-y-reverse': '0',
              'margin-top': `calc(${size} * calc(1 - var(--tw-space-y-reverse)))`,
              'margin-bottom': `calc(${size} * var(--tw-space-y-reverse))`,
            },
            [`${nameClass('space-x', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-space-x-reverse': '0',
              'margin-right': `calc(${size} * var(--tw-space-x-reverse))`,
              'margin-left': `calc(${size} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          }
        },
      ]

      const utilities = _.flatMap(generators, (generator) => {
        return [
          ..._.flatMap(theme('space'), generator),
          {
            '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-y-reverse': '1',
            },
            '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-x-reverse': '1',
            },
          },
        ]
      })

      addUtilities(utilities, variants('space'))
    }
  }
}
