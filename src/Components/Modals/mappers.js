import languages from "./languages";
import getLanguage from "getLanguage.js";
import constants from "../../assets/constants";

const language = languages[getLanguage()];

const CAMPAIGN_GOAL_OPTIONS = [
  { label: language.goalAwareness, value: constants.GOAL_AWARENESS },
  {
    label: language.goalEncourageStore,
    value: constants.GOAL_ENCOURAGE_STORE,
  },
  {
    label: language.goalEncourageECommerce,
    value: constants.GOAL_ENCOURAGE_ECOMMERCE,
  },
  { label: language.goalLeadsData, value: constants.GOAL_LEADS_DATA },
  {
    label: language.goalSubscriptionRenewal,
    value: constants.GOAL_SUBSCRIPTION_RENEWAL,
  },
  { label: language.goalPromotions, value: constants.GOAL_PROMOTIONS },
  {
    label: language.goalEncourageEvent,
    value: constants.GOAL_ENCOURAGE_EVENT,
  },
  {
    label: language.goalReferralProgram,
    value: constants.GOAL_REFERRAL_PROGRAM,
  },
  {
    label: language.goalEncourageReactivation,
    value: constants.GOAL_ENCOURAGE_REACTIVATION,
  },
  {
    label: language.goalMeasureSatisfaction,
    value: constants.GOAL_MEASURE_SATISFACTION,
  },
  {
    label: language.goalNotifications,
    value: constants.GOAL_NOTIFICATIONS,
  },
  {
    label: language.goalEncourageBuyback,
    value: constants.GOAL_ENCOURAGE_BUYBACK,
  },
  {
    label: language.goalNurtureLeads,
    value: constants.GOAL_NURTURE_LEADS,
  },
  {
    label: language.goalImpulseFunnel,
    value: constants.GOAL_IMPULSE_FUNNEL,
  },
  {
    label: language.goalWebTraffic,
    value: constants.GOAL_WEB_TRAFFIC,
  },
  {
    label: language.goalPatternSurvey,
    value: constants.GOAL_PATTERN_SURVEY,
  },
  { label: language.goalOther, value: constants.GOAL_OTHER },
];

const TARGET_EVENT_OPTIONS = [
  {
    label: language.buttonClicksNumber,
    value: constants.TARGET_EVENT_BUTTON_LINK,
  },
  { label: language.clicksNumber, value: constants.TARGET_EVENT_LINK },
  { label: language.readersNumber, value: constants.TARGET_EVENT_READ },
];

export { CAMPAIGN_GOAL_OPTIONS, TARGET_EVENT_OPTIONS };
