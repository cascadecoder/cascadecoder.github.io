var user = cookie.get("user");

if (user == null || user == "") {

user = prompt("Choose a username:");
if(!user) {
alert("We cannot work with you like that! Reload! Now!");
} else {
cookie.set("user", user);
}
