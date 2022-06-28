import { plugins } from '../../gatsby-config'

type GtagPlugin =
  | {
      resolve: string
      options: {
        trackingId: string
      }
    }
  | undefined

const getTrackingId = () => {
  // find plugin config for GA
  const gaPluginConfig = plugins.find(
    (p: any) => typeof p !== 'string' && p.resolve === `gatsby-plugin-gtag`
  ) as GtagPlugin
  const trackingId = gaPluginConfig?.options.trackingId

  // if GA not yet configured, return undefined
  if (trackingId === 'G-XXXXXXXXXX') return undefined
  return trackingId
}

export default getTrackingId
