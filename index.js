const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware 
app.use(express.urlencoded({ extended: false })); //otherwise the data we'll get in as response body will be undefined

app.use((req, res, next) => {
    fs.appendFile('./requestLogs', `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`, (err, res) => {
        next(); //otherwise request will stuck
    })
});

app.use((req, res, next) => {
    console.log("Hello from middleware 2");
    next();
})

// Routes 

//with out /api it i.e./users it will render htmlDoc
// with /api/users it'll send json, perfect for hybrid server (mob+web)

//Grouped
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id == id);
        if (!user) return res.status(404).json({ error: "User not found" })
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id == id);
        console.log(users[index]);
        users[index].first_name = req.body.first_name;
        users[index].email = req.body.email;
        fs.writeFile('./MOCK_DATA', JSON.stringify(users), (err, result) => {
            return res.json({ status: "used edited", user: users[index] });
        })


    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(user => user.id == id);
        users.splice(index, 1);
        fs.writeFile('./MOCK_DATA', JSON.stringify(users), (err, result) => {
            return res.json({ status: "User Deleted ", userId: index + 1 })
        })
    });

app.get("/api/users", (req, res) => {
    res.setHeader("X-MyName", "Khadija Ishaq");
    return res.json(users);
})

app.get("/users", (req, res) => {

    const html = `
    <ul> ${users.map((user) => `<ul>${user.first_name}</ul>`)} </ul>
    `;
    res.send(html);
})

app.post("/api/users", (req, res) => {
    const body = req.body;
    if (!body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json({ msg: "The infromation is missing" })
    }
    users.push({ ...body, id: users.length + 1 })
    fs.writeFile('./MOCK_DATA', JSON.stringify(users), (err, result) => {
        return res.status(201).json({ status: "Sucess", id: users.length });
    })

})

app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));