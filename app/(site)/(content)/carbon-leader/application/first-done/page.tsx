import type { Metadata } from "next"

import ApplicationScreen from "@/app/(site)/(content)/carbon-leader/application/components/application-screen"
import { FIRST_COMPLETED } from "@/constants/carbon-leader-application-step-cards"

export const metadata: Metadata = {
  title: "선도기업 신청",
}

const ApplicationFirstDonePage = () => {
  return <ApplicationScreen cards={FIRST_COMPLETED} />
}

export default ApplicationFirstDonePage
