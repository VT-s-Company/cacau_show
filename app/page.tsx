import { CampaignBanner } from "./components/home/CampaignBanner";
import { DrawIntro } from "./components/home/DrawIntro";
import { DrawSteps } from "./components/home/DrawSteps";
import { DrawWorkspace } from "./components/home/DrawWorkspace";
import { SiteFooter } from "./components/home/SiteFooter";
import { SiteHeader } from "./components/home/SiteHeader";
import { SubmitSection } from "./components/home/SubmitSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CampaignBanner />
      <SiteHeader />

      <main className="flex-1">
        <div className="flex flex-col items-center pb-8">
          <DrawSteps />
          <DrawIntro />
          <DrawWorkspace />
          <SubmitSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
