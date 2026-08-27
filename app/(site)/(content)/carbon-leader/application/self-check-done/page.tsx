import type { Metadata } from "next"

import ApplicationScreen from "@/app/(site)/(content)/carbon-leader/application/components/application-screen"
import { SELF_CHECK_COMPLETED } from "@/constants/carbon-leader-application-step-cards"

export const metadata: Metadata = {
  title: "선도기업 신청",
}

const ApplicationSelfCheckDonePage = () => {
  return <ApplicationScreen cards={SELF_CHECK_COMPLETED} />
}

export default ApplicationSelfCheckDonePage
