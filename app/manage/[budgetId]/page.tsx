"use client"
import { addTransactionToBudget, deleteBudget, deleteTransaction, getTrasactionsByBudgetId } from '@/app/actions'
import BudgetItem from '@/app/components/BudgetItem'
import Wrapper from '@/app/components/Wrapper'
import { Budget } from '@/type'
import React, { useEffect, useState } from 'react'
import Notification from '@/app/components/Notification'
import { Send, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'

const Page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [description, setDescription] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [notification, setNotification] = useState<string>("");

  const closeNotification = () => {
    setNotification("")
  }

  async function fetchBudgetData(budgetId: string) {
    try {
      if (budgetId) {
        const budgetData = await getTrasactionsByBudgetId(budgetId)
        setBudget(budgetData)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du budget et des transactions:", error)
    }
  }

  useEffect(() => {
    const getId = async () => {
      try {
        const resolvedParams = await params;
        fetchBudgetData(resolvedParams.budgetId)
      } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
      }
    }
    getId()
  }, [params])

  const handleAddTransaction = async () => {
    if (!amount || !description) {
      setNotification("Veuillez remplir tous les champs.")
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setNotification("Le montant doit être un nombre positif.");
      return;
    }

    try {
      await addTransactionToBudget(budget?.id ?? '', amountNumber);
      setNotification(`Transaction ajoutée avec succès`);
      fetchBudgetData(budget?.id ?? '');
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error);
      setNotification(`Vous avez dépassé votre budget`);
    }
  }

  const handleDeleteBudget = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?");
    if (confirmed) {
      try {
        await deleteBudget(budget?.id ?? '');
        redirect("/budjets");
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);
      }
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?");
    if (confirmed) {
      try {
        await deleteTransaction(transactionId);
        fetchBudgetData(budget?.id ?? '');
        setNotification("Dépense supprimée");
      } catch (error) {
        console.error("Erreur lors de la suppression de la transaction:", error);
      }
    }
  }

  return (
    <Wrapper>
      {notification && <Notification message={notification} onclose={closeNotification} />}

      {budget && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <BudgetItem budget={budget} enableHover={0} />
            <button onClick={handleDeleteBudget} className="mt-4 btn">
              Supprimer le budget
            </button>

            <div className="flex flex-col mt-4 space-y-4">
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="input input-bordered"
              />

              <input
                type="number"
                id="amount"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input input-bordered"
                min="1"
              />

              <button onClick={handleAddTransaction} className="btn">
                Ajouter votre dépense
              </button>
            </div>
          </div>

          {budget.transactions && budget.transactions.length > 0 ? (
            <div className="mt-4 ml-4 overflow-x-auto md:mt-0 md:w-2/3">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Montant</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-lg md:text-3xl">{transaction.emoji}</td>
                      <td>
                        <div className="badge badge-accent badge-xs md:badge-sm">
                          {transaction.amount} MAD
                        </div>
                      </td>
                      <td>{transaction.description}</td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td>{new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}</td>
                      <td>
                        <button onClick={() => handleDeleteTransaction(transaction.id)} className="btn btn-sm">
                          <Trash className="w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center mt-10 md:w-2/3 md:ml-4">
              <Send strokeWidth={1.5} className="w-8 h-8 text-accent" />
              <span className="ml-2 text-gray-500">Aucune transaction.</span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  )
}

export default Page;
