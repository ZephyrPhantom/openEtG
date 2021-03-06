"use strict";
function hookRowMouseover(tr){
	tr.addEventListener("mouseover", function(e){
		for(var i=1; i<this.children.length; i++){
			var child = this.children[i].children[0];
			if (child.href && child.href.match(/\/Cards\/...\.png$/)){
				imgs[i-1].src = child.href;
				imgs[i-1].style.visibility = "";
			}else imgs[i-1].style.visibility = "hidden";
		}
		for(;i-1<imgs.length;i++){
			imgs[i-1].style.visibility = "hidden";
		}
	});
}
var Cards = require("./Cards");
Cards.loadcards();
var imgs = new Array(8), imgdiv = document.getElementById("imgdiv");
for(var i=0; i<8; i++) imgdiv.appendChild(imgs[i] = new Image());
var table = document.createElement("table");
[
	[["andretimpa", "//andretimpa.deviantart.com"], ["Opening Music", "sound/openingMusic.ogg"],
		["4sa", "4si", "4sj", "4sk", "4sl", "4sm", "4sn", "4so", "4sp", "4sq", "4sr", "4ss", "4st", "4su", "4te", "4vr", "55k", "55p", "55s", "5ic", "5m0", "5m3", "5ol", "5rl", "5vj", "61r", "61s", "621", "6ub"]],
	[["artimies", "//elementscommunity.org/forum/profile/?u=140"], ["593"]],
	[["Cryotube", "//cryotube.deviantart.com"],
		["566", "597", "5fe", "5lr"]],
	[["Dawn to Dusk", "?"], ["505", "ls9", "5sa", "62f", "6ul"]],
	[["Hawanja", "//hawanja.deviantart.com"], ["4vs"]],
	[["jarozaoz", "//elementscommunity.org/forum/profile/?u=6364"],
		["4t3", "4vn", "532", "5le", "5op"]],
	[["kae", "//willowdream.deviantart.com"], ["Sabbath Overlay", "assets/sabbath.png"],
		["4sd", "4sg", "4tc", "506", "501", "52l", "52q", "535", "536", "55u", "567", "56b", "56d", "58s", "598", "59b", "59c", "59d", "59e", "59j", "5bs", "5bu", "5c2", "5c4", "5c6", "5c7", "5f5", "5fb", "5fk", "5fl", "5fm",
		"5fo", "5ib", "5il", "5io", "5iq", "5j1", "5ld", "5lg", "5lj", "5ls", "5lt", "5m1", "5m3", "5od", "5oe", "5og", "5ok", "5om", "5oo", "5oq", "5os", "5ov", "5p0", "5rg", "5rj", "5rr", "5s4", "5s8", "5uo", "5v2", "5v8",
		"5vf", "5vj", "62b", "62e", "62i", "6rs", "7ae", "7ak", "77c", "7gr", "7h5", "7k0"]],
	[["Lost in Nowhere", "/forum/index.php?action=profile;u=38"], ["4vd", "4vg", "539", "5it", "5fh"]],
	[["mega plini", "//elementscommunity.org/forum/profile/?u=202"], ["5ig"]],
	[["moomoose", "//elementscommunity.org/forum/profile/?u=40"], ["5i6"]],
	[["OdinVanguard", "//elementscommunity.org/forum/profile/?u=232"],
		["4se", "4sf", "4t4", "4t5", "4td", "4tf", "4tg", "4vf", "4vk", "4vl", "4vo", "52i", "52m", "52o", "52p", "52s", "530", "538", "55m", "55t", "561", "565", "569", "56a", "56c", "56e", "594", "596", "59k", "5c5",
		"5cr", "5cs", "5f4", "5f6", "5f7", "5ff", "5fg", "5fj", "5fn", "5i8", "5ii", "5ir", "5lq", "5lu", "5lv", "5m2", "5oi", "5on", "5or", "5ri", "5ru", "5s1", "5s6", "5s7", "5s9", "5un", "5up", "5ur", "5us", "5v0",
		"5v1", "5vc", "5ve", "5vk", "61u", "623", "628", "629", "62d", "716", "7e7"]],
	[["pepokish", "//theowlettenest.com"],
		["52g", "58o", "5bv", "5f0", "5i4", "5ie", "5l8", "5lb", "5oj"]],
	[["Ravizant", "//elementscommunity.org/forum/profile/?u=8037"], ["Card Backgrounds", "assets/cardBacks.png"],
		["4sc", "4tb", "4vp", "4vi", "4vj", "4vm", "4vq", "4vt", "4vu", "4vv", "500", "503", "50a", "50u", "52h", "52j", "52k", "52n", "52r", "52u", "52v", "531", "533", "534", "537", "53e", "542", "55n", "55q",
		"55v", "564", "568", "56i", "576", "58p", "58q", "58r", "58u", "58v", "595", "599", "59a", "59f", "59g", "59i", "59m", "5bt", "5c3", "5c8", "5ca", "5cb", "5cc", "5cd", "5ce", "5cf", "5cg",
		"5ch", "5ci", "5cq", "5de", "5f3", "5f8", "5f9", "5fd", "5fi", "5fu", "5gi", "5ia", "5ih", "5ik", "5im", "5in", "5ip", "5is", "5j2", "5jm", "5l9", "5la", "5lc", "5lf", "5lh", "5li", "5lk", "5ln", "5lo", "5lp", "5m6", "5mq", "5oh",
		"5ou", "5p1", "5p3", "5pa", "5pu", "5rh", "5rm", "5rn", "5rq", "5rv", "5se", "5t2", "5uq", "5uu", "5vd", "5vg", "5vi", "61p", "61q", "61v", "620", "627", "62c", "62g", "62m", "6rr", "6u3", "77a", "77p", "7au", "7av", "7dj", "7e2", "7jq", "7k1", "7qa", "7ta", "809", "80a"]],
	[["serprex", "//fiction.wikia.com/wiki/User:Serprex"], ["504", "53a", "58t", "5cj", "5ct", "5fp", "5iv", "5j0", "5p4", "lrl", "5ro", "5rp", "5s0", "5sb", "5va", "5vh", "5vl", "622", "62a", "62h"]],
	[["Thalas", "//elementscommunity.org/forum/profile/?u=103"], ["5i9", "5if", "7dl"]],
	[["TheManuz", "//elementscommunity.org/forum/profile?u=75"], ["502", "5ot"]],
	[["vrt", "//vrt-designs.com"], ["Donation thread", "//elementscommunity.org/forum/card-art/help-support-an-artist"],
		["4sb", "4vc", "4ve", "4vh", "52t", "55l", "55o", "55r", "560", "562", "563", "591", "5c0", "5c1", "5c9", "5f1", "5f2", "5fa", "5fc", "5i5", "5i7", "5id", "5ij", "5ll", "5oc", "5of", "5rk", "5rs",
		"5rt", "5uk", "5ul", "5um", "5ut", "5uv", "5v3", "61o", "61t", "624", "625", "626", "74a", "80g", "590"]],
	[["NASA", "//nasa.gov"], ["5p2"]],
	[["freeSFX", "//freesfx.co.uk"],[]]
].forEach(function(credit){
	var tr = document.createElement("tr");
	hookRowMouseover(tr);
	tr.className = "padtop";
	var x = 0;
	function incx(text, link){
		var td = document.createElement("td");
		var a = document.createElement("a");
		a.href = link;
		a.appendChild(document.createTextNode(text));
		td.appendChild(a);
		tr.appendChild(td);
		if (++x == 9){
			table.appendChild(tr);
			tr = document.createElement("tr");
			hookRowMouseover(tr);
			tr.appendChild(document.createElement("td"));
			x = 1;
		}
	}
	for(var i=0; i<credit.length-1; i++){
		incx(credit[i][0], credit[i][1]);
	}
	var codes = credit[credit.length-1];
	if (codes.length){
		codes.sort();
		codes.forEach(function(code, i){
			incx(Cards.Codes[code].name, "Cards/"+code+".png");
		});
	}
	table.appendChild(tr);
});
document.body.insertBefore(table, imgdiv);