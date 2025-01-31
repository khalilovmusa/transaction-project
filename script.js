class Transactions {
    constructor() {
        this.transactionsArr = [];
    }
    addTransaction(item) {
        this.transactionsArr.push(item);
        document.querySelector(".list").innerHTML = '';
        transactionMethods.updateTransactionUi(this.transactionsArr.reverse());
    }
    removeTransaction(id) {
        fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete the transaction.");
            }
            return response.json();
        }).then((data) => {
            document.querySelector(".list").innerHTML = '';
            transactionMethods.updateTransactionUi(data);
        })
    }
    editTransaction(id, from, to, amount) {
        const updatedTransaction = {
            from: from, 
            to: to,
            amount: amount, 
        };
    
        fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTransaction),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update the transaction.");
                }
                return response.json();
            })
            .then((updatedData) => {
                console.log("Transaction updated:", updatedData);
    
                document.querySelector(".list").innerHTML = '';
                transactionMethods.updateTransactionUi(transactions.transactionsArr.map(transaction => 
                    transaction.id ===  Number(id) ? updatedData : transaction
                ));
            })
            .catch((error) => console.error("Error updating transaction:", error));
    }
    
}

class TransactionMethods {
    constructor() {
        this.list = document.querySelector(".list");
        this.editButtonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-pencil-fill" viewBox="0 0 16 16">
        <path
            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
    </svg>`;
        this.deleteButtonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
    class="bi bi-trash" viewBox="0 0 16 16">
    <path
        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
    <path
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
</svg>`;
    }

    transactionButtonEvent() {
        const addTransactionButton = document.querySelector(".transaction-add-button");
        const submitTransaction = document.querySelector(".create-transaction");
        addTransactionButton.addEventListener("click", () => {
            const popup = document.querySelector(".popup");
            document.querySelector(".success").classList.remove("message-active");
            document.querySelector(".popup-content").style.opacity = 1;
            if (!popup.classList.contains("active")) {
                addTransactionButton.textContent = "Close";
                popup.classList.add("active");
                document.querySelector(".transaction-add-button").style.zIndex = "2";
            } else {
                addTransactionButton.textContent = "Add Transaction";
                popup.classList.remove("active");
            }
            const overlay = document.querySelector(".overlay");
            overlay.addEventListener("click", () => {
                addTransactionButton.textContent = "Add Transaction";
                popup.classList.remove("active");
            });
            document.querySelector(".message-div").style.display = 0;
        })

        submitTransaction.addEventListener("click", () => {
            const fromInput = document.querySelector(".input-from");
            const toInput = document.querySelector(".input-to");
            const amountInput = document.querySelector(".input-amount");
            if (Number(amountInput.value ) > 0 && amountInput.value !== '' && fromInput.value !== '' && toInput.value !== '' ) {
                const transaction = {
                    from: fromInput.value,
                    to: toInput.value,
                    amount: amountInput.value
                }
                fetch("https://acb-api.algoritmika.org/api/transaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(transaction),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to add the transaction.");
                        }
                        return response.json();
                    })
                    .then((newTransaction) => {
                        transactions.transactionsArr.push(newTransaction);

                        document.querySelector(".list").innerHTML = '';
                        transactionMethods.updateTransactionUi(transactions.transactionsArr);

                        document.querySelector(".popup-content").style.opacity = 0;
                        document.querySelector(".success").classList.add("message-active");
                        fromInput.value = ''
                        amountInput.value = ''
                        toInput.value = ''
                    })
                    .catch((error) => {
                        console.log(`An error ocurred:`, error);
                    });
            } else {
                const message = document.querySelector(".message");
                message.classList.add("error");
                message.textContent = `Please fill up correctly`;
                fromInput.value = ''
                amountInput.value = ''
                toInput.value = ''
            }
        })
    }

    updateTransactionUi(dataArr) {
        transactions.transactionsArr = dataArr;
        dataArr.forEach((data) => {
            const listItem = document.createElement("li");
            const editButton = document.createElement("button");
            const deleteButton = document.createElement("button");
            const buttonsDiv = document.createElement("div");

            listItem.classList.add("list-item");
            editButton.classList.add("button");
            editButton.classList.add("edit-transaction");
            deleteButton.classList.add("button");
            deleteButton.classList.add("delete-transaction");

            listItem.id = data.id;

            editButton.innerHTML = this.editButtonSvg;
            deleteButton.innerHTML = this.deleteButtonSvg;

            buttonsDiv.append(editButton, deleteButton);

            listItem.textContent = `From: ${data.from} | To: ${data.to} | amount: ${data.amount}$  `;
            listItem.append(buttonsDiv);
            this.list.append(listItem);

            //! Remove button event handling

            deleteButton.addEventListener("click", (e) => {
                const deleteId = e.target.closest(".list-item").id
                transactions.removeTransaction(deleteId);
            })

            //! Edit button event handling

            editButton.addEventListener("click", (e) => {
                const editId = e.target.closest(".list-item").id;
                const editPopup = document.querySelector(".edit-popup");
                const cancelEditBtn = document.querySelector(".cancel-edit-btn");
                const editOverlay = document.querySelector(".edit-overlay");
                document.querySelector(".transaction-add-button").style.zIndex = "0";
            
                const editInputFrom = document.querySelector(".input-edit-from");
                const editInputTo = document.querySelector(".input-edit-to");
                const editInputAmount = document.querySelector(".input-edit-amount");

                // let transaction = 0;

                const transaction = transactions.transactionsArr.find((t) => t.id === Number(editId));
                // transactions.transactionsArr.forEach((element) => {
                //     if(Number(editId) === element.id){
                //         transaction = element.id;
                //     }
                // });

                if (transaction) {
                    editInputFrom.value = transaction.from;
                    editInputTo.value = transaction.to;
                    editInputAmount.value = transaction.amount;
            
                    editPopup.classList.add("active");
            
                    const saveEditBtn = document.querySelector(".edit-transaction-button");
                    saveEditBtn.addEventListener("click", () => {
                        transactions.editTransaction(
                            editId,
                            editInputFrom.value,
                            editInputTo.value,
                            Number(editInputAmount.value)
                        );
                        editPopup.classList.remove("active");
                    });
            
                    cancelEditBtn.addEventListener("click", () => {
                        editPopup.classList.remove("active");
                    });
            
                    editOverlay.addEventListener("click", () => {
                        editPopup.classList.remove("active");
                    });
                }
            });
            
        })
        console.log(transactions.transactionsArr)
    }

    init() {
        fetch('https://acb-api.algoritmika.org/api/transaction').then((res) => {
            return res.json();
        }).then((dataArr) => {
            this.updateTransactionUi(dataArr);
        })
    }
}


const transactions = new Transactions();
const transactionMethods = new TransactionMethods();

transactionMethods.init();
transactionMethods.transactionButtonEvent();