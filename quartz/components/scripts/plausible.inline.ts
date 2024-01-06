import Plausible from "plausible-tracker"

const { apiHost } = window.plausibleOptions || {}

const plausibleOptions = {
  ...(apiHost && { apiHost }),
}

const { trackPageview } = Plausible(plausibleOptions)
document.addEventListener("nav", () => trackPageview())
