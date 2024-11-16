class Transactions {
    constructor() {
        this.transactionsArr = [];
    }
    addTransaction(item) {
        this.transactionsArr.push(item);
    }
    removeTransaction(id) {
        fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete the transaction.");
            }
            return response.json(); // Optional: depends on your API response
        }).then((data) => {
            document.querySelector(".list").innerHTML = '';
            transactionMethods.updateTransactionUi(data);
        })
    }
    editTransaction() { }
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
//
    transactionButtonEvent() {
        const addTransactionButton = document.querySelector(".transaction-add-button");

        addTransactionButton.addEventListener("click", () => {
            const popup = document.querySelector(".popup");
            if (!popup.classList.contains("active")) {
                addTransactionButton.textContent = "Close";
                popup.classList.add("active");
                console.log(popup.classList.contains("active"))
            } else {
                addTransactionButton.textContent = "Add Transaction";
                popup.classList.remove("active");
                const overlay = document.querySelector(".overlay");
                overlay.addEventListener("click", () => {
                    addTransactionButton.textContent = "Add Transaction";
                    popup.classList.remove("active");
                });
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

            //! Remove button event add

            deleteButton.addEventListener("click", (e) => {
                const deleteId = e.target.closest(".list-item").id
                transactions.removeTransaction(deleteId);
            })

            //! Add button event adding


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