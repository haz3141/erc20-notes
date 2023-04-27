// Fetch and parse the ABI JSON file
async function getContractABI() {
    const response = await fetch('./abis/TinyNotesTokenABI.json');
    const data = await response.json();
    return data;
}

async function getFaucetContractABI() {
    const response = await fetch('./abis/TinyNotesTokenFaucetABI.json');
    const data = await response.json();
    return data;
}

async function displayNotes(contract) {
    const notesContainer = document.getElementById("notes");
    notesContainer.innerHTML = ""; // Clear the container before adding new notes

    const noteCount = await contract.methods.noteIds().call(); // Call the getNoteCount function

    for (let noteId = 0; noteId <= noteCount; noteId++) {
        const noteData = await contract.methods.readNote(noteId).call();
        
        // Skip the note if the content is empty
        if (noteData.content === "") {
            continue;
        }

        const noteElement = document.createElement("div");
        noteElement.className = "note";
        noteElement.innerHTML = `
            <h3>${noteData.title}</h3>
            <p>${noteData.content}</p>
            <button onclick="updateNote(${noteId})">Update</button>
            <button onclick="deleteNote(${noteId})">Delete</button>
        `;
        notesContainer.appendChild(noteElement);
    }
}

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        console.error('No web3 detected.');
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    document.getElementById('account').innerText = `Account: ${account}`;

    const tokenContractABI = await getContractABI();
    const tokenContractAddress = '0x0052474e9EED5450fD671DE04F67fa2c46e1f95B';

    const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

    const faucetContractABI = await getFaucetContractABI();
    const faucetContractAddress = '0xf7C177ef8FFB35d200e34b64C485f6544568d1A7';

    const faucetContract = new web3.eth.Contract(faucetContractABI, faucetContractAddress);

    document.getElementById('create-note').addEventListener('click', async () => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        
        await tokenContract.methods.createNote(title, content).send({ from: account });
        alert('Note created!');

        await displayNotes(tokenContract);
    });

    document.getElementById('request-tokens').addEventListener('click', async () => {
        await faucetContract.methods.requestTokens().send({ from: account });
        alert('Tokens requested!');
    });    

    // Add event listeners for other contract functions (e.g., readNote, updateNote, deleteNote)

    await displayNotes(tokenContract);
});
