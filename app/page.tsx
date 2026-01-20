import Navbar from "@/components/homepage/Navbar";
import Hero from "@/components/new-landing/hero";
import NewStories from "@/components/new-landing/new-stories";
import Create from "@/components/new-landing/create";
import EventsMini from "@/components/new-landing/events";
import Nerdworker from "@/components/new-landing/nerdworker";
import JajaGame from "@/components/new-landing/jaja";
import Sponsors from "@/assets/new/sponsors";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  return (
    <div className="bg-[#0D0D0D]">
      <Navbar />
      <Hero />
      <NewStories />
      <Create />
      <EventsMini />
      <Nerdworker />
      <JajaGame />
      <Sponsors />
      <Footer />
    </div>
  );
}
