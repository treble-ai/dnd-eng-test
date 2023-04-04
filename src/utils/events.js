
export default {
  identify: (
    userId,
    tier,
    segment,
    activeIntegrations,
    email,
    companyId,
    hubspotCompanyId
  ) => {
    console.log('identify', userId)
  },

  track: (eventName, data) => {
    console.log('track', eventName, data)
  },

  reset: () => {
    console.log('reset')
  },

  page: (page_name) => {
    console.log('page', page_name)
  },

  setUserProperties: (properties) => {
    console.log('set properties', properties)
  },
};
