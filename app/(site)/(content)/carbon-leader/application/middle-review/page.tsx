import type { Metadata } from "next"

import ApplicationScreen from "@/app/(site)/(content)/carbon-leader/application/components/application-screen"
import { MIDDLE_IN_REVIEW } from "@/constants/carbon-leader-application-step-cards"

export const metadata: Metadata = {
  title: "선도기업 신청",
}

const ApplicationMiddleReviewPage = () => {
  return <ApplicationScreen cards={MIDDLE_IN_REVIEW} />
}

export default ApplicationMiddleReviewPage
