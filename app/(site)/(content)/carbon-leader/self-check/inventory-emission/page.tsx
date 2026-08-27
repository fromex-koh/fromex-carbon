import type { Metadata } from "next"

import CarbonBanner from "@/app/(site)/(content)/carbon-leader/self-check/components/carbon-banner"
import InventoryEmission from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-emission"

export const metadata: Metadata = {
  title: "자가진단 · 인벤토리 배출량 산정",
}

const InventoryEmissionPage = () => {
  return (
    <>
      <CarbonBanner />
      <InventoryEmission />
    </>
  )
}

export default InventoryEmissionPage
