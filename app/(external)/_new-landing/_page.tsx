import Sponsors from "@/assets/new/sponsors";
import EventLists from "@/components/events/Events";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import Create from "@/components/new-landing/create";
import Hero from "@/components/new-landing/hero";
import JajaGame from "@/components/new-landing/jaja";
import Nerdworker from "@/components/new-landing/nerdworker";
import NewStories from "@/components/new-landing/new-stories";

export default function Home() {
  return (
    <div className="bg-[#0D0D0D]">
      <Navbar />
      <Hero />
      <NewStories />
      <Create />
      <EventLists />
      <Nerdworker />
      <JajaGame />
      <Sponsors />
      <Footer />
    </div>
  );
}
