//import { UserButton } from "@clerk/nextjs";
//import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import BudgetItem from "./components/BudgetItem";
import budgets from "./data";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('/spendewise.jpg')", // Définir l'image en arrière-plan
        backgroundSize: "cover", // Assurez-vous que l'image couvre toute la zone
        backgroundPosition: "center", // Centrer l'image
        backgroundAttachment: "fixed", // Fixer l'image pendant le défilement
        height: "100vh", // Remplir toute la hauteur de la fenêtre
        margin: 0, // Supprimer la marge par défaut du body
        padding: 0, // Supprimer tout padding ajouté par défaut
        overflow: "hidden", // Empêche le défilement
      }}
    >
      <Navbar />
      <div className="flex items-center justify-center h-full px-4 md:px-16">
        <div className="text-center text-white py-10 max-w-4xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Prenez le contrôle <br /> de vos finances
          </h1>
          <p className="py-6 text-lg sm:text-xl md:text-2xl">
            Transformez votre manière de suivre vos budgets et vos dépenses <br />
            Suivez, contrôlez, et optimisez vos finances 💰 en toute simplicité avec
            notre application intuitive ❤️
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 gap-4">
            {budgets.map((budget) => (
              <Link href={""} key={budget.id}>
                <BudgetItem budget={budget} enableHover={1}></BudgetItem>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
