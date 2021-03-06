#!/usr/bin/node
"use strict";
var write = process.stdout.write.bind(process.stdout);
function writetd(){
	write("[tr]");
	for(var i=0; i<arguments.length; i++)
		if (arguments[i] !== undefined) write("[td]"+arguments[i]+"[/td]");
	write("[/tr]");
}
if (process.argv.length < 3){
	var etg = require("./etg");
	require("./Cards").loadcards();
	write("[right][table]");
	writetd("Tot", "Ele", "C", "P", "S", "|", "R", "U", "C", "", "");
	for(var i=0; i<13; i++){
		var ofele = etg.filtercards(false, function(x){return x.element == i});
		var creas = 0, perms = 0, spels = 0, comm = new Uint32Array(3), last = 0;
		ofele.forEach(function(x){
			if (x.type <= etg.PermanentEnum) perms++;
			else if (x.type == etg.CreatureEnum) creas++;
			else if (x.type == etg.SpellEnum) spels++;
			if (x.rarity > 0 && x.rarity < 4){
				comm[x.rarity-1]++;
				if (x.code > last) last = x.code;
			}
		});
		writetd(ofele.length, etg.eleNames[i], creas, perms, spels, "|", comm[2], comm[1], comm[0], last.toString(32), (last+2000).toString(32));
	}
	write("[/table][/right]\n");
}else{
	var decks = require("./Decks")[process.argv[2]];
	if (decks){
		decks.forEach(function(deck){
			write("[deck title="+deck[0]+"]"+deck[1]+"[/deck]");
		});
	}
}