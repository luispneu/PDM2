import { openDB } from 'idb';

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome', // A propriedade "nome" será usada como chave
                        });
                        // Criando um índice "id" na store
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                        break;
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message);
    }
}

window.addEventListener("DOMContentLoaded", async (event) => {
    createDB();

    const inputElement = document.getElementById("input");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnListar = document.getElementById("btnListar");

    btnSalvar.addEventListener("click", addData);
    btnListar.addEventListener("click", getData);
});

async function addData() {
    const tx = await db.transaction('pessoas', 'readwrite'); 
    const store = tx.objectStore('pessoas'); 

    store.add({ name: 'Fulano' }); 

    await tx.done; 
}
 async function  getData() {
    if (db == undefined) {
        showResult("Obanco de dados está fechado");
        return;
    }
const tx = await db.transaction('pessoas', 'readonly')
const store = tx.objectStore('pessoas');
const value = await store.getALL();
if (value) {
    showResult ("Dados do banco" + JSON.stringify(value))
} else{
    showResult('Não há nemhum dado no banco!')
}


 }

 function showResult(text) {
    document.querySelector("output").innerHTML = text;
 }

