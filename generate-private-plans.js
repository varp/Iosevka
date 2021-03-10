"use strict";

const ejs = require('ejs');

const family = 'Iosevka VardanPro';
const spacings = {
	'normal': '',
	'fontconfig-mono': 'Term',
};

const variants = {
	default: '',
	ss07: 'Monaco Style',
	ss13: 'Lucida Style',
	ss12: 'Ubuntu Style'
};

const design = `asterisk = "low"
ampersand = "upper-open"
dollar = "open"
lig-ltgteq = "slanted"`;

const designTerm = `asterisk = "low"
ampersand = "upper-open"
dollar = "open"`;

const ligations = `inherits = "php"`;

const weights = {
	normal: {
		shape: 300,
		menu: 300,
		css: 300
	},
};

const slopes = {
	upright: 'normal',
	italic: 'italic',
	oblique: 'oblique'
};

const BUILD_LITE = true;

const template = `
########################  <%- fontDisplayName %> #####################################
[buildPlans.<%- fontKeyBuildId %>]
family = "<%- fontDisplayName %>"
spacing = "<%- fontSpacing %>"
serifs = "sans"
<%_ if (fontSpacing === 'fontconfig-mono') { _%>
no-cv-ss = false
<%_ } _%>
<%_ if (fontVariant !== 'default') { _%>
[buildPlans.<%- fontKeyBuildId %>.variants]
inherits = "<%- fontVariant %>"
<%_ } _%>
[buildPlans.<%- fontKeyBuildId %>.variants.design]
<%- design %>
<%_ if (fontSpacing !== 'fontconfig-mono') { _%>
[buildPlans.<%- fontKeyBuildId %>.ligations]
inherits = "php"
<%_ } _%>
<%_ if (fontKeyBuildId.includes('light')) { _%>
<%- fontWeightsProperties %>
<%_ } _%>
<%- fontSlopesProperties %>

`;



function buildWeights(fontKeyBuildId, weights) {
	let fontWeightsProperties = '';
	for (const fontWeight in weights) {
		fontWeightsProperties += `[buildPlans.${fontKeyBuildId}.weights.${fontWeight}]\n${Object.entries(weights[fontWeight]).map((v) => v.join('=')).join('\n')}`;
	}

	return fontWeightsProperties;
}


function buildSlopes(fontKeyBuildId, slopes) {
	let fontSlopesProperties = `[buildPlans.${fontKeyBuildId}.slopes]\n`;
	for (const fontSlope in slopes) {
		fontSlopesProperties += `${fontSlope} = "${slopes[fontSlope]}"\n`;
	}

	return fontSlopesProperties;
}

function buildTemplateData(fontDisplayName, fontSpacing, fontVariant, weights, slopes) {
	fontDisplayName = fontDisplayName.replaceAll(/\s+/g, ' ');
	let fontKeyBuildId = fontDisplayName.replaceAll(/\s+/ig, '-').toLowerCase();
	let fontWeightsProperties = buildWeights(fontKeyBuildId, weights);
	let fontSlopesProperties = buildSlopes(fontKeyBuildId, slopes);

	return {
		'fontDisplayName': fontDisplayName,
		'fontKeyBuildId': fontKeyBuildId,
		'fontSpacing': fontSpacing,
		'fontVariant': fontVariant,
		'design': fontSpacing === 'fontconfig-mono' ? designTerm : design,
		'fontWeightsProperties': fontWeightsProperties,
		'fontSlopesProperties': fontSlopesProperties
	};
}


function render(data) {
	let rendered = ejs.render(template, data, {
		rmWhitespace: true
	}).replaceAll(/^$/g, '');

	console.log(rendered);
	console.error(data.fontKeyBuildId);
}

for (const fontSpacing in spacings) {
	for (const fontVariant in variants) {
		let fontDisplayName = `${family} ${spacings[fontSpacing]} ${variants[fontVariant]}`.trim();
		let data = buildTemplateData(fontDisplayName, fontSpacing, fontVariant, weights, slopes);
		render(data);

		if (BUILD_LITE) {
			let fontDisplayName = `${family} ${spacings[fontSpacing]} ${variants[fontVariant]} Light`.trim();
			let data = buildTemplateData(fontDisplayName, fontSpacing, fontVariant, weights, slopes);
			render(data);
		}
	}

}

const collectPlans = `

[collectPlans.iosevka-vardanpro]
from = [
	"iosevka-vardanpro",
	"iosevka-vardanpro-monaco-style",
	"iosevka-vardanpro-lucida-style",
	"iosevka-vardanpro-ubuntu-style",
]

[collectPlans.iosevka-vardanpro-term]
from = [
	"iosevka-vardanpro-term",
	"iosevka-vardanpro-term-monaco-style",
	"iosevka-vardanpro-term-lucida-style",
	"iosevka-vardanpro-term-ubuntu-style",
]


[collectPlans.iosevka-vardanpro-light]
from = [
	"iosevka-vardanpro.weights.light",
	"iosevka-vardanpro-monaco-style.weights.light",
	"iosevka-vardanpro-lucida-style.weights.light",
	"iosevka-vardanpro-ubuntu-style.weights.light",

	"iosevka-vardanpro-term.weights.light",
	"iosevka-vardanpro-term-monaco-style.weights.light",
	"iosevka-vardanpro-term-lucida-style.weights.light",
	"iosevka-vardanpro-term-ubuntu-style.weights.light",
]



[collectConfig]
distinguishWeights = true
distinguishWidths = false
distinguishSlope = false
`;
// console.log(collectPlans);
