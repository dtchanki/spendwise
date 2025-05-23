"use client";
import React, { useCallback, useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { addBudget, getBudgetsByUser } from "../actions";
import Notification from "../components/Notification";
import { Budget } from "@/type";
import Link from "next/link";
import BudgetItem from "../components/BudgetItem";
import { Landmark } from "lucide-react";

const Page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [notification, setNotification] = useState<string>("");
  const [error, setError] = useState<string>("");

  const closeNotification = () => {
    setNotification("");
  };

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Le montant doit être un nombre positif.");
      }

      await addBudget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectedEmoji
      );

      fetchBudgets();
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }

      setNotification("Nouveau budget créé avec succès.");
      setBudgetName("");
      setBudgetAmount("");
      setSelectedEmoji("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      setError("Erreur lors de la suppression du budget");
  }
};

  const fetchBudgets = useCallback(async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const userBudgets = await getBudgetsByUser(user?.primaryEmailAddress?.emailAddress);
        setBudgets(userBudgets);
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);      }
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const fetchTransactions = async () => {
    // Logique pour récupérer les transactions de l'utilisateur
    try {
      // Exemple de récupération de données
      const response = await fetch('/api/transactions');
      const data = await response.json();
      console.log('Transactions:', data);
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [user?.primaryEmailAddress?.emailAddress, fetchBudgets]);

  return (
    <Wrapper>
      {notification && (
        <Notification message={notification} onclose={closeNotification} />
      )}

      {error && <div className="text-red-500">{error}</div>}

      <button
        className="btn mb-4"
        onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()}
      >
        Nouveau Budget
        <Landmark className="w-4" />
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Création d&apos;un budjets</h3>
          <p className="py-4">Permet de controler ces depenses facilement</p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered mb-3"
              required
            />
            <input
              type="number"
              value={budgetAmount}
              placeholder="Montant"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered mb-3"
              required
            />
            <button
              className="btn mb-3 "
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji || "sélectionnez un emoji 🫵"}
            </button>
            {showEmojiPicker && (
              <div className="flex justify-center items-center my-4">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            <button onClick={handleAddBudget} className="btn">
              Ajouter Budjet
            </button>
          </div>
        </div>
      </dialog>

      <ul className="grid md:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <Link href={`/manage/${budget.id}`} key={budget.id}>
            <BudgetItem budget={budget} enableHover={1} />
          </Link>
        ))}
      </ul>
    </Wrapper>
  );
};

export default Page;
