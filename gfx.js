"use strict";
var ui = require("./ui");
var Cards = require("./Cards");
var etgutil = require("./etgutil");
var options = require("./options");
var Shaders = require("./Shaders");
exports.loaded = false;
function load(progress, postload){
	exports.load = undefined;
	var assets = ["cardBacks", "atlas"];
	function process(asset, tex, base){
		var id = asset.match(/\d+$/), tex = new PIXI.Texture(tex, base?new PIXI.math.Rectangle(base[0], base[1], base[2], base[3]):null);
		if (id){
			asset = asset.slice(0, -id[0].length);
			if (!(asset in exports)) exports[asset] = [];
			exports[asset][id[0]] = tex;
		}else exports[asset] = tex;
	}
	var loadCount = 0;
	assets.forEach(function(asset){
		var img = new Image();
		img.addEventListener("load", function(){
			loadCount++;
			progress(loadCount/assets.length);
			var tex = new PIXI.BaseTexture(this);
			if (asset == "cardBacks"){
				var ts = [], bs = [];
				for (var x = 0; x < tex.width; x += 128){
					ts.push(new PIXI.Texture(tex, new PIXI.math.Rectangle(x, 0, 128, tex.height)));
					bs.push(new PIXI.Texture(tex, new PIXI.math.Rectangle(x, 0, 128, 16)));
				}
				exports.cardBacks = ts;
				exports.cardBorders = bs;
			}else if (asset == "atlas"){
				var atlas = require("./assets/atlas");
				for(var key in atlas){
					process(key, tex, atlas[key]);
				}
			}else process(asset, tex);
			if (loadCount == assets.length){
				ui.loadSounds("cardClick", "buttonClick", "permPlay", "creaturePlay");
				exports.r[0] = exports.nopic;
				exports.r[-1] = exports.r[5];
				exports.loaded = true;
				postload();
			}
		});
		img.src = "assets/" + asset + ".png";
	});
}
function Text(text, fontsize, color, bgcolor){
	var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
	var font = ctx.font = fontsize + "px Dosis";
	canvas.width = ctx.measureText(text).width+1;
	canvas.height = fontsize*1.4;
	if (bgcolor !== undefined){
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	ctx.font = font;
	ctx.fillStyle = color || "black";
	ctx.fillText(text, 0, fontsize);
	return new PIXI.Texture(new PIXI.BaseTexture(canvas));
}
var caimgcache = [], artimagecache = [], shinyShader, grayShader;
function setShinyShader(renderer, sprite, card){
	if (card.shiny && PIXI.gl) sprite.shader = shinyShader || (shinyShader = Shaders.GBRA(renderer));
	return sprite;
}
function setGrayBorderShader(renderer, sprite, card){
	if (!card.upped && PIXI.gl) sprite.shader = grayShader || (grayShader = Shaders.DarkGrayScale(renderer));
	return sprite;
}
function makeArt(code, art, rend) {
	if (!rend) rend = require("./px").mkRenderTexture(128, 256);
	var template = new PIXI.Container();
	var card = Cards.Codes[code];
	template.addChild(new PIXI.Sprite(exports.cardBacks[card.element+(card.upped?13:0)]));
	var typemark = new PIXI.Sprite(exports.t[card.type]);
	typemark.anchor.set(1, 1);
	typemark.position.set(128, 252);
	template.addChild(typemark);
	var rarity = new PIXI.Sprite(exports.r[card.rarity]);
	rarity.anchor.set(1, 1);
	rarity.position.set(102, 252);
	template.addChild(rarity);
	if (art) {
		var artspr = setShinyShader(rend.renderer, new PIXI.Sprite(art), card);
		artspr.position.set(0, 20);
		template.addChild(artspr);
	}
	if (card.shiny){
		template.addChild(setGrayBorderShader(rend.renderer, new PIXI.Sprite(exports.shinyborder), card));
	}
	var nametag = new PIXI.Sprite(Text(card.name, 12, card.upped ? "black" : "white"));
	nametag.position.set(2, 2);
	template.addChild(nametag);
	if (card.cost) {
		var text = new PIXI.Sprite(Text(card.cost, 12, card.upped ? "black" : "white"));
		text.anchor.x = 1;
		text.position.set(rend.width-3, 2);
		template.addChild(text);
		if (card.element && ((card.costele == card.element) ^ !options.showCostIcon)) {
			var eleicon = new PIXI.Sprite(exports.e[card.costele]);
			eleicon.position.set(rend.width-text.width-5, 10);
			eleicon.anchor.set(1, .5);
			eleicon.scale.set(.5, .5);
			template.addChild(eleicon);
		}
	}
	var infospr = new PIXI.Sprite(ui.getTextImage(card.info(), 11, card.upped ? "black" : "white", "", rend.width-4));
	infospr.position.set(2, 150);
	template.addChild(infospr);
	rend.render(template);
	return rend;
}
function artFactory(realcb){
	var cache = {};
	return function(code){
		function cb(art){
			cache[code] = realcb(code, art, cache[code]);
			return cache[code];
		}
		function mkOnError(code){
			return function onError(){
				if (code > 6999){
					var redcode = etgutil[code & 16384?"asShiny":"asUpped"](code, false);
					if (redcode in artimagecache) cb(artimagecache[code] = artimagecache[redcode]);
					else{
						this.removeEventListener("error", onError);
						this.addEventListener("error", mkOnError(redcode));
						this.addEventListener("load", function(){
							artimagecache[redcode] = artimagecache[code];
						});
						this.src = "Cards/" + redcode.toString(32) + ".png";
					}
				}else artimagecache[code] = undefined;
			}
		}
		if (!(code in artimagecache)){
			var img = new Image();
			img.addEventListener("load", function(){
				cb(artimagecache[code] = new PIXI.Texture(new PIXI.BaseTexture(this)));
			});
			img.addEventListener("error", mkOnError(code));
			img.src = "Cards/" + code.toString(32) + ".png";
		}
		return cache[code] || cb(artimagecache[code]);
	}
}
var getArt = artFactory(makeArt);
function getSlotImage(card, code){
	if (code in caimgcache) return caimgcache[code];
	else{
		var rend = require("./px").mkRenderTexture(100, 20);
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(1, card && card.shiny ? 0xdaa520 : 0x222222);
		graphics.beginFill(card ? ui.maybeLighten(card) : code == 0 ? 0x887766 : 0x111111);
		graphics.drawRect(0, 0, 99, 19);
		if (card) {
			var clipwidth = rend.width-2;
			if (card.cost) {
				var text = new PIXI.Sprite(Text(card.cost, 11, card.upped ? "black" : "white"));
				text.anchor.x = 1;
				text.position.set(rend.width-2, 3);
				graphics.addChild(text);
				clipwidth -= text.width+2;
				if (card.element && ((card.costele == card.element) ^ !options.showCostIcon)) {
					var eleicon = new PIXI.Sprite(exports.e[card.costele]);
					eleicon.position.set(clipwidth, 10);
					eleicon.anchor.set(1, .5);
					eleicon.scale.set(.5, .5);
					graphics.addChild(eleicon);
					clipwidth -= 18;
				}
			}
			var text = new PIXI.Sprite(Text(card.name, 11, card.upped ? "black" : "white"));
			text.position.set(2, 3);
			if (text.width > clipwidth){
				text.width = clipwidth;
			}
			graphics.addChild(text);
		}
		rend.render(graphics);
		return caimgcache[code] = rend;
	}
}
function getAbilityImage(ability) {
	return getSlotImage(ability, JSON.stringify(ability));
}
function getCardImage(code) {
	return getSlotImage(Cards.Codes[code], code);
}
function getInstImage(scale){
	return artFactory(function(code, art, rend){
		if (!rend) rend = require("./px").mkRenderTexture(Math.ceil(128 * scale), Math.ceil(160 * scale));
		var card = Cards.Codes[code];
		var btex = exports.cardBorders[card.element + (card.upped ? 13 : 0)];
		var c = new PIXI.Container();
		var border = new PIXI.Sprite(btex), border2 = new PIXI.Sprite(btex);
		border2.position.y = 160;
		border2.scale.y = -1;
		c.addChild(border);
		c.addChild(border2);
		var graphics = new PIXI.Graphics();
		c.addChild(graphics);
		graphics.beginFill(ui.maybeLighten(card));
		graphics.drawRect(0, 16, 128, 128);
		if (card.shiny){
			graphics.lineStyle(2, 0xdaa520);
			graphics.moveTo(0, 14);
			graphics.lineTo(128, 14);
			graphics.moveTo(0, 147);
			graphics.lineTo(128, 147);
		}
		if (art) {
			var artspr = new PIXI.Sprite(art);
			artspr.position.y = 16;
			setShinyShader(rend.renderer, artspr, card);
			c.addChild(artspr);
		}
		var text = new PIXI.Sprite(Text(card.name, 16, card.upped ? "black" : "white"));
		text.anchor.x = .5;
		text.position.set(64, 142);
		c.addChild(text);
		var mtx = new PIXI.math.Matrix();
		mtx.scale(scale, scale);
		rend.render(c, mtx);
		return rend;
	});
}
exports.refreshCaches = function() {
	caimgcache.forEach(function(img){
		img.destroy(true);
	});
	caimgcache.length = 0;
}
if (typeof PIXI !== "undefined"){
	exports.nopic = PIXI.Texture.emptyTexture;
	exports.load = load;
	exports.getPermanentImage = exports.getCreatureImage = getInstImage(.5);
	exports.getWeaponShieldImage = getInstImage(5/8);
	exports.getArt = getArt;
	exports.getCardImage = getCardImage;
	exports.getAbilityImage = getAbilityImage;
	exports.Text = Text;
}