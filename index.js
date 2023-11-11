const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;
// Routes 

//with out /api it i.e./users it will render htmlDoc
// with /api/users it'll send json, perfect for hybrid server (mob+web)

app.get("/api/users", (req, res) => {
    return res.json(users);
})

app.get("/users", (req, res) => {

    const html = `
    <ul> ${users.map((user) => `<ul>${user.first_name}</ul>`)} </ul>
    `;
    res.send(html);
})

app.get("/api/users/:id", (req, res) => {
    id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user);
})

app.post("/api/users", (req, res) => {
    return res.json({ status: "Pending" });
})

app.patch("/api/users/:id", (req, res) => {
    return res.json({ status: "Pending" });
});

app.delete("api/users/:id", (req, res) => {
    return res.json({ status: "Pending" });
})

app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));