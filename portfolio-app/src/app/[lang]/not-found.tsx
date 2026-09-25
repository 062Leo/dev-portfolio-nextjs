import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { NotFoundMessage } from "@/components/NotFoundMessage";

// Rendered inside the [lang] layout for every notFound() under it, so the 404 page keeps
// the visitor's language, the navbar and the footer.
export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-text">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <NotFoundMessage />
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
