import Encargos from "@/components/Encargos";
import Estudio from "@/components/Estudio";
import Footer from "@/components/Footer";
import Galeria from "@/components/Galeria";
import Hero from "@/components/Hero";
import Marcos from "@/components/Marcos";
import Nav from "@/components/Nav";
import Preguntas from "@/components/Preguntas";
import Tienda from "@/components/Tienda";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <Tienda>
      <a className="skip" href="#galeria">Saltar a la galería</a>
      <Nav />
      <main>
        <Hero />
        <Galeria />
        <Marcos />
        <Encargos />
        <Estudio />
        <Preguntas />
      </main>
      <WhatsAppFloat />
      <Footer />
    </Tienda>
  );
}
