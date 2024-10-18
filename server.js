import express from "express";
import fetch from "node-fetch";

const app = express();

const redirect_uri = "http://localhost:3000/callback";

global.access_token;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/authorize", (req, res) => {
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope:"",
    redirect_uri: redirect_uri
  })

  res.redirect("https://accounts.spotify.com/authorize?" + auth_query_parameters.toString());

});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code"
  })

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
      "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
    }
  })

  const data = await response.json();
  global.access_token = data.access_token;

  res.redirect("dashboard")

});

app.get("/dashboard", async (req, res) => {


  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token,
    }
  })

  const data = await response.json();
  console.log(data);
  res.render("dashboard", {user: data})

});

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
