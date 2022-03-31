var a1 = {};
a1.id = function (i) {
	return document.getElementById(i);
};
a1.show = function(id) {
	a1.id(id).style.display = "block";
};
a1.hide = function(id) {
	a1.id(id).style.display = "none";
};
a1.create = function(type, id, content) {
	const elm = document.createElement(type);
	elm.id = id;
	elm.innerHTML = content;
	document.body.appendChild(elm);
};
