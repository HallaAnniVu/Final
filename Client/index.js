document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
    .catch(error => console.error('Error loading initial data:', error));
});

const addBtn = document.querySelector('#addname-btn');
addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const programInput = document.querySelector('#program-input');
    const name = nameInput.value.trim();
    const program = programInput.value.trim();
    nameInput.value = "";
    programInput.value = "";

    if (name && program) {
        fetch('http://localhost:5000/insert', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name, program: program })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:5000/getAll') // Refresh table
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']))
                .catch(error => console.error('Error refreshing table after insert:', error));
            } else {
                console.error('Insert failed:', data);
            }
        })
        .catch(error => console.error('Error inserting data:', error));
    } else {
        alert('Name and Program cannot be empty!');
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";
    data.forEach(function ({id, name, program, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${program}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id="${id}">Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id="${id}">Edit</button></td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-row-btn')) {
        const id = event.target.getAttribute("data-id");
        fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:5000/getAll') // Refresh table
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']))
                .catch(error => console.error('Error refreshing table after delete:', error));
            } else {
                console.error('Delete failed:', data);
            }
        })
        .catch(error => console.error('Error deleting data:', error));
    }

    if (event.target.classList.contains('edit-row-btn')) {
        const id = event.target.getAttribute("data-id");
        fetch(`http://localhost:5000/getById/${id}`) // Fetch record details by ID
        .then(response => response.json())
        .then(data => {
            if (data) {
                const { name, program } = data;
                document.querySelector('#update-id').value = id;
                document.querySelector('#update-name-input').value = name;
                document.querySelector('#update-program-input').value = program;
                document.querySelector('#update-row').classList.remove('hidden'); // Show update section
            } else {
                console.error('Failed to fetch record details:', data);
            }
        })
        .catch(error => console.error('Error fetching record details:', error));
    }
});

const updateBtn = document.querySelector('#update-row-btn');
updateBtn.onclick = function () {
    const id = document.querySelector('#update-id').value;
    const name = document.querySelector('#update-name-input').value.trim();
    const program = document.querySelector('#update-program-input').value.trim();

    if (name && program) {
        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                name: name,
                program: program
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:5000/getAll') // Refresh table
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']))
                .catch(error => console.error('Error refreshing table after update:', error));
                document.querySelector('#update-row').classList.add('hidden'); // Hide update form
            } else {
                console.error('Update failed:', data);
            }
        })
        .catch(error => console.error('Error updating data:', error));
    } else {
        alert('Name and Program cannot be empty!');
    }
}

const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function () {
    const searchInput = document.querySelector('#search-input').value.trim();
    if (searchInput) {
        fetch(`http://localhost:5000/search/${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => console.error('Error searching data:', error));
    } else {
        alert('Search input cannot be empty!');
    }
}
