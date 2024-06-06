function drawBio(biodata) {
    let html = `<table>
    <tr>
        <th>No.</th>
        <th>Name</th>
        <th>Height</th>
        <th>Weight</th>
        <th>Birth Date</th>
        <th>Is Married</th>
        <th>Action</th>
    </tr>`
    biodata.forEach((isi, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${isi.name}</td>
            <td>${isi.height}</td>
            <td>${isi.weight}</td>
            <td>${isi.birthdate}</td>
            <td>${isi.married?'Yes':'Not Yet'}</td>
            <td><a href="/edit/${index}">update</a> <a href="/delete/${index}">delete</a></td>
        </tr>`
    })
    html += `   
    </table>`
    return html;
}

module.exports = { drawBio }