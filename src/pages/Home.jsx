import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Survey from "../components/Survey";
import Footer from "../components/Footer";

function Home() {
  const scrollToSurvey = () => {
    const surveyElement = document.getElementById("survey-section");

    if (!surveyElement) {
      return;
    }

    surveyElement.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <Navbar onStartSurvey={scrollToSurvey} />
      <Hero onStartSurvey={scrollToSurvey} />
      <Features />
      <Survey />
      <Footer />
    </div>
  );
}

export default Home;