"use client";

import { CampaignBanner } from "./components/home/CampaignBanner";
import DetailsModal from "./components/home/DatailsModal";
import { DrawIntro } from "./components/home/DrawIntro";
import { DrawSteps } from "./components/home/DrawSteps";
import { DrawWorkspace } from "./components/home/DrawWorkspace";
import { SiteFooter } from "./components/home/SiteFooter";
import { SiteHeader } from "./components/home/SiteHeader";
import { SubmitSection } from "./components/home/SubmitSection";
import {
  DrawFlowProvider,
  useDrawFlow,
} from "./components/home/DrawFlowContext";

function HomeContent() {
  const { isAnalyzing, showResult, showPrize } = useDrawFlow();
  const shouldHideInitialComponents = isAnalyzing || showResult || showPrize;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DetailsModal />

      <CampaignBanner />
      <SiteHeader />

      <main className="flex-1">
        <div className="flex flex-col items-center pb-8">
          {!shouldHideInitialComponents && (
            <>
              <DrawSteps />
              <DrawIntro />
              <DrawWorkspace />
            </>
          )}
          <SubmitSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function Home() {
  return (
    <DrawFlowProvider>
      <HomeContent />
    </DrawFlowProvider>
  );
}
